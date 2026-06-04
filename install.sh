#!/usr/bin/env bash
set -euo pipefail

# Dev on the go — Bootstrap VPS
# Usage: curl -fsSL .../install.sh | bash
#    or: ./install.sh
#
# Par défaut : zero-config HTTPS autosigné (port 8443) + assistant web /setup
#    ./install.sh --configure-cli  Configuration CLI (stack bootstrap déjà démarrée)
#    ./install.sh --interactive    Configuration CLI avant tout démarrage web
#    ./install.sh --non-interactive Conserve le .env existant

REPO_URL="${DOTG_REPO_URL:-https://github.com/tainalo2/devonthego.git}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INSTALL_DIR="${DOTG_INSTALL_DIR:-${SCRIPT_DIR}}"
INSTALL_MODE="bootstrap"
NON_INTERACTIVE=false
COMPOSE_FILES=(-f docker-compose.yml -f docker-compose.bootstrap.yml)
BOOTSTRAP_PORT=8443

log() { echo "[devonthego] $*"; }
error() { echo "[devonthego] ERROR: $*" >&2; exit 1; }

require_root() {
  [[ "${EUID}" -eq 0 ]] || error "Ce script doit être exécuté en root (sudo)."
}

parse_args() {
  for arg in "$@"; do
    case "${arg}" in
      --interactive) INSTALL_MODE="interactive" ;;
      --configure-cli) INSTALL_MODE="configure-cli" ;;
      --non-interactive) NON_INTERACTIVE=true ;;
      -h|--help)
        cat <<EOF
Usage: install.sh [options]

Options:
  (défaut)            Zero-config : HTTPS autosigné sur :${BOOTSTRAP_PORT} + wizard web
  --configure-cli     Configuration CLI (après démarrage bootstrap, sans navigateur)
  --interactive       Configuration CLI complète avant déploiement (sans wizard web)
  --non-interactive   Conserve le .env existant sans questions
  -h, --help          Affiche cette aide

Variables d'environnement:
  DOTG_REPO_URL       URL du dépôt Git
  DOTG_INSTALL_DIR    Répertoire d'installation (défaut: emplacement du script)
EOF
        exit 0
        ;;
      *) error "Option inconnue: ${arg}" ;;
    esac
  done
}

detect_os() {
  if [[ -f /etc/os-release ]]; then
    # shellcheck source=/dev/null
    . /etc/os-release
    OS_ID="${ID:-unknown}"
    OS_VERSION="${VERSION_ID:-unknown}"
  else
    error "OS non supporté."
  fi

  case "${OS_ID}" in
    ubuntu|debian) ;;
    *) error "OS non supporté: ${OS_ID}. Utilisez Ubuntu 22.04+ ou Debian 12+." ;;
  esac
  log "OS détecté: ${OS_ID} ${OS_VERSION}"
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
    log "Docker déjà installé: $(docker --version)"
    return
  fi

  log "Installation de Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
}

configure_firewall() {
  if ! command -v ufw >/dev/null 2>&1; then
    log "UFW non disponible, configuration firewall ignorée."
    return
  fi

  log "Configuration du firewall (ports 22, 80, 443, ${BOOTSTRAP_PORT})..."
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
  local cert_dir="${INSTALL_DIR}/certs/bootstrap"
  local gen_script="${INSTALL_DIR}/scripts/generate-bootstrap-certs.sh"

  [[ -x "${gen_script}" ]] || chmod +x "${gen_script}"
  "${gen_script}" "${cert_dir}" "${server_ip}"
}

generate_bootstrap_env() {
  if [[ -f "${INSTALL_DIR}/.env" && "${NON_INTERACTIVE}" == "true" ]]; then
    log "Mode non-interactif : .env conservé tel quel."
    return
  fi

  if [[ -f "${INSTALL_DIR}/.env" ]]; then
    local completed
    completed="$(read_env_value BOOTSTRAP_MODE "${INSTALL_DIR}/.env")"
    if [[ "${completed}" == "false" ]]; then
      log "Configuration production déjà présente — .env conservé."
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

  log "Configuration bootstrap générée (${INSTALL_DIR}/.env)"
  export BOOTSTRAP_SUMMARY_IP="${server_ip}"
  export BOOTSTRAP_SUMMARY_PASSWORD="${bootstrap_password}"
}

confirm_or_prompt() {
  local var_name="$1"
  local label="$2"
  local current="$3"
  local is_secret="${4:-false}"
  local allow_empty="${5:-false}"

  if [[ "${NON_INTERACTIVE}" == "true" ]]; then
    if [[ -z "${current}" && "${allow_empty}" != "true" ]]; then
      error "Variable ${var_name} manquante en mode non-interactif."
    fi
    printf -v "${var_name}" '%s' "${current}"
    return
  fi

  echo ""
  echo "── ${label} (${var_name}) ──"
  if [[ -n "${current}" ]]; then
    if [[ "${is_secret}" == "true" ]]; then
      echo "Valeur actuelle : ********"
    else
      echo "Valeur actuelle : ${current}"
    fi
    local confirm
    read -rp "Conserver cette valeur ? [O/n] " confirm
    if [[ ! "${confirm}" =~ ^[Nn]$ ]]; then
      printf -v "${var_name}" '%s' "${current}"
      return
    fi
  fi

  local new_value
  if [[ "${is_secret}" == "true" ]]; then
    read -rsp "Nouvelle valeur : " new_value
    echo
  else
    read -rp "Nouvelle valeur : " new_value
  fi

  while [[ -z "${new_value}" && "${allow_empty}" != "true" ]]; do
    read -rp "La valeur ne peut pas être vide. Nouvelle valeur : " new_value
  done

  printf -v "${var_name}" '%s' "${new_value}"
}

confirm_or_prompt_bool() {
  local var_name="$1"
  local label="$2"
  local current="$3"

  if [[ "${NON_INTERACTIVE}" == "true" ]]; then
    printf -v "${var_name}" '%s' "${current}"
    return
  fi

  echo ""
  echo "── ${label} (${var_name}) ──"
  echo "Valeur actuelle : ${current}"
  local confirm
  read -rp "Conserver cette valeur ? [O/n] " confirm
  if [[ ! "${confirm}" =~ ^[Nn]$ ]]; then
    printf -v "${var_name}" '%s' "${current}"
    return
  fi

  local answer
  while true; do
    read -rp "Activer ? [o/N] : " answer
    case "${answer,,}" in
      true|t|o|oui|y|yes|1) printf -v "${var_name}" '%s' "true"; return ;;
      false|f|n|non|''|0) printf -v "${var_name}" '%s' "false"; return ;;
      *) echo "Répondez par true ou false." ;;
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
  echo "║     Configuration Dev on the go (mode CLI)                  ║"
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

  confirm_or_prompt DOMAIN "Domaine principal" "${DOMAIN}"
  confirm_or_prompt ACME_EMAIL "Email Let's Encrypt" "${ACME_EMAIL}"
  confirm_or_prompt ADMIN_EMAIL "Email administrateur" "${ADMIN_EMAIL}"
  confirm_or_prompt ADMIN_FULL_NAME "Nom administrateur" "${ADMIN_FULL_NAME}" false true
  confirm_or_prompt ADMIN_PASSWORD "Mot de passe admin" "${ADMIN_PASSWORD}" true true
  if [[ -z "${ADMIN_PASSWORD}" ]]; then
    ADMIN_PASSWORD="$(openssl rand -base64 16)"
  fi

  local default_app_url="https://admin.${DOMAIN}"
  if [[ -z "${APP_URL}" || "${APP_URL}" == *"example.com"* || "${APP_URL}" == *":8443"* ]]; then
    APP_URL="${default_app_url}"
  fi
  confirm_or_prompt APP_URL "URL interface admin" "${APP_URL}"
  confirm_or_prompt_bool ALLOW_PUBLIC_SIGNUP "Inscription publique" "${ALLOW_PUBLIC_SIGNUP}"
  confirm_or_prompt ENV_CPU_LIMIT "CPU par environnement" "${ENV_CPU_LIMIT}"
  confirm_or_prompt ENV_MEMORY_LIMIT "RAM par environnement" "${ENV_MEMORY_LIMIT}"

  if [[ -z "${APP_KEY}" ]]; then
    APP_KEY="$(openssl rand -base64 32)"
  fi

  write_env_file
  COMPOSE_FILES=(-f docker-compose.yml)
  log "Configuration sauvegardée dans ${INSTALL_DIR}/.env"
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
    log "Mise à jour du dépôt..."
    git -C "${INSTALL_DIR}" pull --ff-only
  else
    log "Clonage du dépôt dans ${INSTALL_DIR}..."
    git clone "${REPO_URL}" "${INSTALL_DIR}"
  fi
}

build_images() {
  log "Construction de l'image de base..."
  docker build -t devonthego/base:latest -f "${INSTALL_DIR}/images/base/Dockerfile" "${INSTALL_DIR}/images/base"

  log "Construction des templates..."
  for template in node python php; do
    "${INSTALL_DIR}/images/build-image.sh" --template "${template}" --name "${template}" || true
  done
}

start_stack() {
  log "Démarrage de la stack..."
  cd "${INSTALL_DIR}"
  export DOTG_INSTALL_DIR="${INSTALL_DIR}"
  docker compose "${COMPOSE_FILES[@]}" pull
  docker compose "${COMPOSE_FILES[@]}" build platform
  docker compose "${COMPOSE_FILES[@]}" up -d

  log "Attente du démarrage de la plateforme..."
  sleep 15
}

apply_cli_configuration() {
  [[ -f "${INSTALL_DIR}/.env" ]] || error "Aucune installation dans ${INSTALL_DIR}"

  local bootstrap_mode
  bootstrap_mode="$(read_env_value BOOTSTRAP_MODE "${INSTALL_DIR}/.env")"
  [[ "${bootstrap_mode}" == "true" ]] || error "Configuration déjà terminée (BOOTSTRAP_MODE=false)."

  COMPOSE_FILES=(-f docker-compose.yml -f docker-compose.bootstrap.yml)
  prompt_env_interactive

  cd "${INSTALL_DIR}"
  export DOTG_INSTALL_DIR="${INSTALL_DIR}"

  log "Enregistrement de la configuration dans la base..."
  docker compose "${COMPOSE_FILES[@]}" exec -T platform node build/ace.js dotg:complete-setup-cli

  log "Basculage vers le mode production HTTPS..."
  bash "${INSTALL_DIR}/scripts/finish-setup.sh" "${INSTALL_DIR}"

  log "Attente du redémarrage..."
  sleep 20

  INSTALL_MODE="production"
  print_summary_production
}

offer_cli_configuration() {
  [[ "${INSTALL_MODE}" == "bootstrap" ]] || return
  [[ "${NON_INTERACTIVE}" == "true" ]] && return

  echo ""
  echo "──────────────────────────────────────────────────────────────"
  echo "Le portail web est démarré. Configuration possible :"
  echo "  • Navigateur : https://<IP>:${BOOTSTRAP_PORT} (certificat autosigné)"
  echo "  • SSH plus tard : ${INSTALL_DIR}/install.sh --configure-cli"
  echo "──────────────────────────────────────────────────────────────"

  local answer
  read -rp "Configurer maintenant en CLI (sans navigateur) ? [o/N] " answer
  if [[ "${answer,,}" =~ ^(o|oui|y|yes)$ ]]; then
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
║        Dev on the go — Installation bootstrap terminée       ║
╠══════════════════════════════════════════════════════════════╣
║  1. Ouvrez :  https://${ip}:${BOOTSTRAP_PORT}
║     (certificat autosigné — acceptez l'avertissement navigateur)
║  2. Connectez-vous :
║       Email           admin@bootstrap.local
║       Mot de passe    ${password}
║  3. Suivez l'assistant /setup
╠══════════════════════════════════════════════════════════════╣
║  Sans navigateur : ${INSTALL_DIR}/install.sh --configure-cli
║  Après configuration : https://admin.<votre-domaine>
╚══════════════════════════════════════════════════════════════╝
EOF
}

print_summary_production() {
  # shellcheck source=/dev/null
  source "${INSTALL_DIR}/.env"
  cat <<EOF

╔══════════════════════════════════════════════════════════════╗
║           Dev on the go — Installation terminée              ║
╠══════════════════════════════════════════════════════════════╣
║  Admin:     ${APP_URL}
║  Email:     ${ADMIN_EMAIL}
║  Password:  ${ADMIN_PASSWORD}
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
    apply_cli_configuration
    exit 0
  fi

  detect_os
  install_docker
  configure_firewall
  clone_or_update
  configure_env
  build_images
  start_stack
  print_summary
  offer_cli_configuration
}

main "$@"
