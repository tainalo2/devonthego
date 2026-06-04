#!/usr/bin/env bash
set -euo pipefail

# Dev on the go — VPS bootstrap
# Usage: curl -fsSL .../install.sh | sudo bash
#    or: ./install.sh
#
# Default: zero-config self-signed HTTPS (port 8443) + web /setup wizard
#    ./install.sh --configure-cli   CLI setup (bootstrap already running)
#    ./install.sh --interactive       Full CLI before web start
#    ./install.sh --non-interactive   Keep existing .env
#
# Language: DOTG_LANG=en|fr|es|de|pt|it (default: en)

REPO_URL="${DOTG_REPO_URL:-https://github.com/tainalo2/devonthego.git}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INSTALL_DIR="${DOTG_INSTALL_DIR:-/opt/devonthego}"
INSTALL_MODE="bootstrap"
NON_INTERACTIVE=false
COMPOSE_FILES=(-f docker-compose.yml -f docker-compose.bootstrap.yml)
BOOTSTRAP_PORT=8443

log() { log_msg "$@"; }
error() { error_msg "$@"; }

init_i18n() {
  local lib=""
  if [[ -f "${INSTALL_DIR}/scripts/lib/i18n.sh" ]]; then
    lib="${INSTALL_DIR}/scripts/lib/i18n.sh"
  elif [[ -f "${SCRIPT_DIR}/scripts/lib/i18n.sh" ]]; then
    lib="${SCRIPT_DIR}/scripts/lib/i18n.sh"
  fi

  if [[ -z "${lib}" ]]; then
    echo "[devonthego] ERROR: Translation files not found. Clone the repository first." >&2
    exit 1
  fi

  # shellcheck source=/dev/null
  source "${lib}"
  dotg_i18n_init
}

require_root() {
  [[ "${EUID}" -eq 0 ]] || {
    echo "[devonthego] ERROR: This script must be run as root (sudo)." >&2
    exit 1
  }
}

parse_args() {
  for arg in "$@"; do
    case "${arg}" in
      --interactive) INSTALL_MODE="interactive" ;;
      --configure-cli) INSTALL_MODE="configure-cli" ;;
      --non-interactive) NON_INTERACTIVE=true ;;
      -h|--help)
        if [[ -f "${SCRIPT_DIR}/scripts/lib/i18n.sh" ]]; then
          # shellcheck source=/dev/null
          source "${SCRIPT_DIR}/scripts/lib/i18n.sh"
          dotg_i18n_init
          print_help
        elif [[ -f "${INSTALL_DIR}/scripts/lib/i18n.sh" ]]; then
          # shellcheck source=/dev/null
          source "${INSTALL_DIR}/scripts/lib/i18n.sh"
          dotg_i18n_init
          print_help
        else
          echo "Usage: install.sh [--configure-cli|--interactive|--non-interactive|-h]"
        fi
        exit 0
        ;;
      *)
        if declare -F error_msg >/dev/null 2>&1; then
          error error.unknown_option "arg=${arg}"
        else
          echo "[devonthego] ERROR: Unknown option: ${arg}" >&2
          exit 1
        fi
        ;;
    esac
  done
}

print_help() {
  cat <<EOF
$(t help.usage)

Options:
  $(t help.default port="${BOOTSTRAP_PORT}")
  --configure-cli     $(t help.configure_cli)
  --interactive       $(t help.interactive)
  --non-interactive   $(t help.non_interactive)
  -h, --help          $(t help.help_opt)

Environment:
  DOTG_REPO_URL       $(t help.env_repo)
  DOTG_INSTALL_DIR    $(t help.env_install_dir)
  DOTG_LANG           $(t help.env_lang)
EOF
}

detect_os() {
  if [[ -f /etc/os-release ]]; then
    # shellcheck source=/dev/null
    . /etc/os-release
    OS_ID="${ID:-unknown}"
    OS_VERSION="${VERSION_ID:-unknown}"
  else
    error error.unsupported_os
  fi

  case "${OS_ID}" in
    ubuntu|debian) ;;
    *) error error.unsupported_os_detail "os=${OS_ID}" ;;
  esac
  log log.os_detected "os=${OS_ID}" "version=${OS_VERSION}"
}

detect_public_ip() {
  local ip=""
  ip="$(curl -4 -fsSL --max-time 5 https://api.ipify.org 2>/dev/null || true)"
  if [[ -z "${ip}" ]]; then
    ip="$(hostname -I 2>/dev/null | awk '{print $1}' || true)"
  fi
  [[ -n "${ip}" ]] || ip="127.0.0.1"
  printf '%s' "${ip}"
}

install_docker() {
  if command -v docker >/dev/null 2>&1; then
    log log.docker_installed "version=$(docker --version)"
    return
  fi

  log log.installing_docker
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
}

configure_firewall() {
  if ! command -v ufw >/dev/null 2>&1; then
    log log.ufw_unavailable
    return
  fi

  log log.configuring_firewall "port=${BOOTSTRAP_PORT}"
  ufw allow 22/tcp
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw allow "${BOOTSTRAP_PORT}"/tcp
  ufw --force enable || true
}

read_env_value() {
  local key="$1"
  local file="$2"
  local line value

  [[ -f "${file}" ]] || return 0
  line="$(grep -E "^${key}=" "${file}" 2>/dev/null | tail -1 || true)"
  [[ -n "${line}" ]] || return 0
  value="${line#*=}"
  value="${value%\"}"
  value="${value#\"}"
  value="${value%\'}"
  value="${value#\'}"
  printf '%s' "${value}"
}

escape_env_value() {
  local value="$1"
  if [[ "${value}" =~ [[:space:]#\$\\\"\'] ]]; then
    value="${value//\\/\\\\}"
    value="${value//\"/\\\"}"
    printf '"%s"' "${value}"
  else
    printf '%s' "${value}"
  fi
}

write_env_file() {
  local env_file="${INSTALL_DIR}/.env"
  local tmp_file
  tmp_file="$(mktemp)"

  local -a CONFIG_KEYS=(
    BOOTSTRAP_MODE DOTG_INSTALL_DIR DOMAIN ACME_EMAIL
    ADMIN_EMAIL ADMIN_FULL_NAME ADMIN_PASSWORD
    BOOTSTRAP_ADMIN_EMAIL BOOTSTRAP_ADMIN_PASSWORD
    APP_KEY APP_URL ALLOW_PUBLIC_SIGNUP ENV_CPU_LIMIT ENV_MEMORY_LIMIT
  )

  while IFS= read -r line || [[ -n "${line}" ]]; do
    if [[ "${line}" =~ ^([A-Za-z_][A-Za-z0-9_]*)= ]]; then
      local key="${BASH_REMATCH[1]}"
      local found=false
      for cfg_key in "${CONFIG_KEYS[@]}"; do
        if [[ "${key}" == "${cfg_key}" ]]; then
          found=true
          break
        fi
      done
      if [[ "${found}" == "true" ]]; then
        # shellcheck disable=SC2086
        printf '%s=%s\n' "${key}" "$(escape_env_value "${!key}")" >> "${tmp_file}"
        continue
      fi
    fi
    printf '%s\n' "${line}" >> "${tmp_file}"
  done < "${INSTALL_DIR}/.env.example"

  mv "${tmp_file}" "${env_file}"
  chmod 600 "${env_file}"
}

generate_bootstrap_certs() {
  local server_ip="$1"
  local gen_script="${INSTALL_DIR}/scripts/generate-bootstrap-certs.sh"

  [[ -x "${gen_script}" ]] || chmod +x "${gen_script}"
  "${gen_script}" "${INSTALL_DIR}/certs/bootstrap" "${server_ip}"
}

generate_bootstrap_env() {
  if [[ -f "${INSTALL_DIR}/.env" && "${NON_INTERACTIVE}" == "true" ]]; then
    log log.non_interactive_env
    return
  fi

  if [[ -f "${INSTALL_DIR}/.env" ]]; then
    local completed
    completed="$(read_env_value BOOTSTRAP_MODE "${INSTALL_DIR}/.env")"
    if [[ "${completed}" == "false" ]]; then
      log log.production_env_kept
      COMPOSE_FILES=(-f docker-compose.yml)
      INSTALL_MODE="production"
      return
    fi
  fi

  local server_ip app_key bootstrap_password
  server_ip="$(detect_public_ip)"
  app_key="$(openssl rand -base64 32)"
  bootstrap_password="$(openssl rand -base64 12)"

  generate_bootstrap_certs "${server_ip}"

  # shellcheck disable=SC2034
  BOOTSTRAP_MODE=true
  DOTG_INSTALL_DIR="${INSTALL_DIR}"
  DOMAIN=bootstrap.local
  ACME_EMAIL=bootstrap@local.invalid
  ADMIN_EMAIL=
  ADMIN_PASSWORD=
  ADMIN_FULL_NAME=
  BOOTSTRAP_ADMIN_EMAIL=admin@bootstrap.local
  BOOTSTRAP_ADMIN_PASSWORD="${bootstrap_password}"
  APP_KEY="${app_key}"
  APP_URL="https://${server_ip}:${BOOTSTRAP_PORT}"
  ALLOW_PUBLIC_SIGNUP=false
  ENV_CPU_LIMIT=1
  ENV_MEMORY_LIMIT=1024m

  write_env_file
  chmod +x "${INSTALL_DIR}/scripts/finish-setup.sh" 2>/dev/null || true
  chmod +x "${INSTALL_DIR}/scripts/generate-bootstrap-certs.sh" 2>/dev/null || true

  log log.bootstrap_env_generated "path=${INSTALL_DIR}"
  export BOOTSTRAP_SUMMARY_IP="${server_ip}"
  export BOOTSTRAP_SUMMARY_PASSWORD="${bootstrap_password}"
}

confirm_or_prompt() {
  local var_name="$1"
  local label_key="$2"
  local current="$3"
  local is_secret="${4:-false}"
  local allow_empty="${5:-false}"

  if [[ "${NON_INTERACTIVE}" == "true" ]]; then
    if [[ -z "${current}" && "${allow_empty}" != "true" ]]; then
      error error.missing_var "var=${var_name}"
    fi
    printf -v "${var_name}" '%s' "${current}"
    return
  fi

  echo ""
  echo "── $(t "${label_key}") (${var_name}) ──"
  if [[ -n "${current}" ]]; then
    if [[ "${is_secret}" == "true" ]]; then
      echo "$(t prompt.current_value_secret)"
    else
      echo "$(t prompt.current_value value="${current}")"
    fi
    local confirm
    read -rp "$(t prompt.keep_value) " confirm
    if [[ ! "${confirm}" =~ ^[Nn]$ ]]; then
      printf -v "${var_name}" '%s' "${current}"
      return
    fi
  fi

  local new_value
  if [[ "${is_secret}" == "true" ]]; then
    read -rsp "$(t prompt.new_value_secret) " new_value
    echo
  else
    read -rp "$(t prompt.new_value) " new_value
  fi

  while [[ -z "${new_value}" && "${allow_empty}" != "true" ]]; do
    read -rp "$(t prompt.cannot_empty) " new_value
  done

  printf -v "${var_name}" '%s' "${new_value}"
}

confirm_or_prompt_bool() {
  local var_name="$1"
  local label_key="$2"
  local current="$3"

  if [[ "${NON_INTERACTIVE}" == "true" ]]; then
    printf -v "${var_name}" '%s' "${current}"
    return
  fi

  echo ""
  echo "── $(t "${label_key}") (${var_name}) ──"
  echo "$(t prompt.current_value value="${current}")"
  local confirm
  read -rp "$(t prompt.keep_value) " confirm
  if [[ ! "${confirm}" =~ ^[Nn]$ ]]; then
    printf -v "${var_name}" '%s' "${current}"
    return
  fi

  local answer
  while true; do
    read -rp "$(t prompt.enable_bool) " answer
    case "${answer,,}" in
      true|t|o|oui|y|yes|1|j|ja|s|si) printf -v "${var_name}" '%s' "true"; return ;;
      false|f|n|non|''|0) printf -v "${var_name}" '%s' "false"; return ;;
      *) echo "$(t prompt.answer_true_false)" ;;
    esac
  done
}

prompt_env_interactive() {
  local source_file="${INSTALL_DIR}/.env.example"
  if [[ -f "${INSTALL_DIR}/.env" ]]; then
    source_file="${INSTALL_DIR}/.env"
  fi

  if [[ "${NON_INTERACTIVE}" == "true" && -f "${INSTALL_DIR}/.env" ]]; then
    COMPOSE_FILES=(-f docker-compose.yml)
    return
  fi

  echo ""
  echo "╔══════════════════════════════════════════════════════════════╗"
  printf "║  %-59s  ║\n" "$(t prompt.cli_header)"
  echo "╚══════════════════════════════════════════════════════════════╝"

  # shellcheck disable=SC2034
  BOOTSTRAP_MODE=false
  DOTG_INSTALL_DIR="${INSTALL_DIR}"
  DOMAIN="$(read_env_value DOMAIN "${source_file}")"
  ACME_EMAIL="$(read_env_value ACME_EMAIL "${source_file}")"
  ADMIN_EMAIL="$(read_env_value ADMIN_EMAIL "${source_file}")"
  ADMIN_FULL_NAME="$(read_env_value ADMIN_FULL_NAME "${source_file}")"
  ADMIN_PASSWORD="$(read_env_value ADMIN_PASSWORD "${source_file}")"
  APP_KEY="$(read_env_value APP_KEY "${source_file}")"
  APP_URL="$(read_env_value APP_URL "${source_file}")"
  ALLOW_PUBLIC_SIGNUP="$(read_env_value ALLOW_PUBLIC_SIGNUP "${source_file}")"
  ENV_CPU_LIMIT="$(read_env_value ENV_CPU_LIMIT "${source_file}")"
  ENV_MEMORY_LIMIT="$(read_env_value ENV_MEMORY_LIMIT "${source_file}")"
  BOOTSTRAP_ADMIN_EMAIL=
  BOOTSTRAP_ADMIN_PASSWORD=

  [[ "${DOMAIN}" == "bootstrap.local" ]] && DOMAIN=""
  [[ "${ACME_EMAIL}" == *"@local.invalid" ]] && ACME_EMAIL=""

  ADMIN_FULL_NAME="${ADMIN_FULL_NAME:-Administrator}"
  ALLOW_PUBLIC_SIGNUP="${ALLOW_PUBLIC_SIGNUP:-false}"
  ENV_CPU_LIMIT="${ENV_CPU_LIMIT:-1}"
  ENV_MEMORY_LIMIT="${ENV_MEMORY_LIMIT:-1024m}"

  confirm_or_prompt DOMAIN label.domain "${DOMAIN}"
  confirm_or_prompt ACME_EMAIL label.acme_email "${ACME_EMAIL}"
  confirm_or_prompt ADMIN_EMAIL label.admin_email "${ADMIN_EMAIL}"
  confirm_or_prompt ADMIN_FULL_NAME label.admin_name "${ADMIN_FULL_NAME}" false true
  confirm_or_prompt ADMIN_PASSWORD label.admin_password "${ADMIN_PASSWORD}" true true
  if [[ -z "${ADMIN_PASSWORD}" ]]; then
    ADMIN_PASSWORD="$(openssl rand -base64 16)"
  fi

  local default_app_url="https://admin.${DOMAIN}"
  if [[ -z "${APP_URL}" || "${APP_URL}" == *"example.com"* || "${APP_URL}" == *":8443"* ]]; then
    APP_URL="${default_app_url}"
  fi
  confirm_or_prompt APP_URL label.app_url "${APP_URL}"
  confirm_or_prompt_bool ALLOW_PUBLIC_SIGNUP label.public_signup "${ALLOW_PUBLIC_SIGNUP}"
  confirm_or_prompt ENV_CPU_LIMIT label.env_cpu "${ENV_CPU_LIMIT}"
  confirm_or_prompt ENV_MEMORY_LIMIT label.env_memory "${ENV_MEMORY_LIMIT}"

  if [[ -z "${APP_KEY}" ]]; then
    APP_KEY="$(openssl rand -base64 32)"
  fi

  write_env_file
  COMPOSE_FILES=(-f docker-compose.yml)
  log log.config_saved "path=${INSTALL_DIR}"
}

configure_env() {
  if [[ "${INSTALL_MODE}" == "interactive" ]]; then
    prompt_env_interactive
  elif [[ "${INSTALL_MODE}" != "configure-cli" ]]; then
    generate_bootstrap_env
  fi
}

clone_or_update() {
  if [[ -d "${INSTALL_DIR}/.git" ]]; then
    log log.updating_repo
    git -C "${INSTALL_DIR}" pull --ff-only
  else
    log log.cloning_repo "dir=${INSTALL_DIR}"
    mkdir -p "${INSTALL_DIR}"
    git clone "${REPO_URL}" "${INSTALL_DIR}"
  fi
}

build_images() {
  log log.building_base
  docker build -t devonthego/base:latest -f "${INSTALL_DIR}/images/base/Dockerfile" "${INSTALL_DIR}/images/base"

  log log.building_templates
  for template in node python php; do
    DOTG_LANG="${DOTG_LOCALE:-en}" "${INSTALL_DIR}/images/build-image.sh" --template "${template}" --name "${template}" || true
  done
}

start_stack() {
  log log.starting_stack
  cd "${INSTALL_DIR}"
  export DOTG_INSTALL_DIR="${INSTALL_DIR}"
  docker compose "${COMPOSE_FILES[@]}" pull
  docker compose "${COMPOSE_FILES[@]}" build platform
  docker compose "${COMPOSE_FILES[@]}" up -d

  log log.waiting_platform
  sleep 15
}

apply_cli_configuration() {
  [[ -f "${INSTALL_DIR}/.env" ]] || error error.no_installation "dir=${INSTALL_DIR}"

  local bootstrap_mode
  bootstrap_mode="$(read_env_value BOOTSTRAP_MODE "${INSTALL_DIR}/.env")"
  [[ "${bootstrap_mode}" == "true" ]] || error error.already_configured

  COMPOSE_FILES=(-f docker-compose.yml -f docker-compose.bootstrap.yml)
  prompt_env_interactive

  cd "${INSTALL_DIR}"
  export DOTG_INSTALL_DIR="${INSTALL_DIR}"

  log log.saving_config_db
  docker compose "${COMPOSE_FILES[@]}" exec -T platform node build/ace.js dotg:complete-setup-cli

  log log.switching_production
  bash "${INSTALL_DIR}/scripts/finish-setup.sh" "${INSTALL_DIR}"

  log log.waiting_restart
  sleep 20

  INSTALL_MODE="production"
  print_summary_production
}

offer_cli_configuration() {
  [[ "${INSTALL_MODE}" == "bootstrap" ]] || return
  [[ "${NON_INTERACTIVE}" == "true" ]] && return

  echo ""
  echo "──────────────────────────────────────────────────────────────"
  echo "$(t prompt.cli_options_header)"
  echo "  • $(t prompt.cli_option_browser port="${BOOTSTRAP_PORT}")"
  echo "  • $(t prompt.cli_option_ssh dir="${INSTALL_DIR}")"
  echo "──────────────────────────────────────────────────────────────"

  local answer
  read -rp "$(t prompt.cli_configure_now) " answer
  if [[ "${answer,,}" =~ ^(o|oui|y|yes|s|si|j|ja)$ ]]; then
    apply_cli_configuration
  fi
}

print_summary_bootstrap() {
  local ip="${BOOTSTRAP_SUMMARY_IP:-$(detect_public_ip)}"
  local password="${BOOTSTRAP_SUMMARY_PASSWORD:-}"

  if [[ -z "${password}" && -f "${INSTALL_DIR}/.env" ]]; then
    password="$(read_env_value BOOTSTRAP_ADMIN_PASSWORD "${INSTALL_DIR}/.env")"
  fi

  cat <<EOF

╔══════════════════════════════════════════════════════════════╗
║  $(t summary.bootstrap.title)
╠══════════════════════════════════════════════════════════════╣
║  $(t summary.bootstrap.step1 ip="${ip}" port="${BOOTSTRAP_PORT}")
║  $(t summary.bootstrap.step1_hint)
║  $(t summary.bootstrap.step2)
║  $(t summary.bootstrap.email)
║  $(t summary.bootstrap.password password="${password}")
║  $(t summary.bootstrap.step3)
╠══════════════════════════════════════════════════════════════╣
║  $(t summary.bootstrap.cli dir="${INSTALL_DIR}")
║  $(t summary.bootstrap.after)
╚══════════════════════════════════════════════════════════════╝
EOF
}

print_summary_production() {
  # shellcheck source=/dev/null
  source "${INSTALL_DIR}/.env"
  cat <<EOF

╔══════════════════════════════════════════════════════════════╗
║  $(t summary.production.title)
╠══════════════════════════════════════════════════════════════╣
║  $(t summary.production.admin url="${APP_URL}")
║  $(t summary.production.email email="${ADMIN_EMAIL}")
║  $(t summary.production.password password="${ADMIN_PASSWORD}")
╚══════════════════════════════════════════════════════════════╝
EOF
}

print_summary() {
  if [[ "${INSTALL_MODE}" == "bootstrap" ]]; then
    print_summary_bootstrap
  else
    print_summary_production
  fi
}

main() {
  parse_args "$@"
  require_root

  if [[ "${INSTALL_MODE}" == "configure-cli" ]]; then
    init_i18n
    apply_cli_configuration
    exit 0
  fi

  clone_or_update
  init_i18n

  detect_os
  install_docker
  configure_firewall
  configure_env
  build_images
  start_stack
  print_summary
  offer_cli_configuration
}

main "$@"
