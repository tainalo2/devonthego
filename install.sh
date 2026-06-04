#!/usr/bin/env bash
set -euo pipefail

# Dev on the go — Bootstrap VPS
# Usage: curl -fsSL .../install.sh | bash
#    or: ./install.sh
#    ou: ./install.sh --non-interactive  (conserve .env sans questions)

REPO_URL="${DOTG_REPO_URL:-https://github.com/tainalo2/dev-on-the-go.git}"
INSTALL_DIR="${DOTG_INSTALL_DIR:-/opt/devonthego}"
NON_INTERACTIVE=false

log() { echo "[devonthego] $*"; }
error() { echo "[devonthego] ERROR: $*" >&2; exit 1; }

require_root() {
  [[ "${EUID}" -eq 0 ]] || error "Ce script doit être exécuté en root (sudo)."
}

parse_args() {
  for arg in "$@"; do
    case "${arg}" in
      --non-interactive) NON_INTERACTIVE=true ;;
      -h|--help)
        cat <<EOF
Usage: install.sh [options]

Options:
  --non-interactive   Utilise le .env existant sans poser de questions
  -h, --help          Affiche cette aide

Variables d'environnement:
  DOTG_REPO_URL       URL du dépôt Git (défaut: GitHub tainalo2/dev-on-the-go)
  DOTG_INSTALL_DIR    Répertoire d'installation (défaut: /opt/devonthego)
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

  log "Configuration du firewall (ports 22, 80, 443)..."
  ufw allow 22/tcp
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw --force enable || true
}

# Lit une variable depuis un fichier KEY=VALUE (sans l'exporter)
read_env_value() {
  local key="$1"
  local file="$2"
  local line value

  [[ -f "${file}" ]] || return 0

  line="$(grep -E "^${key}=" "${file}" 2>/dev/null | tail -1 || true)"
  [[ -n "${line}" ]] || return 0

  value="${line#*=}"
  # Retire les guillemets entourants éventuels
  value="${value%\"}"
  value="${value#\"}"
  value="${value%\'}"
  value="${value#\'}"
  printf '%s' "${value}"
}

# Échappe une valeur pour écriture dans .env (guillemets si caractères spéciaux)
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

  # Variables configurées interactivement (écrasent .env.example)
  local -a CONFIG_KEYS=(
    DOMAIN ACME_EMAIL ADMIN_EMAIL ADMIN_FULL_NAME ADMIN_PASSWORD
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
      echo "Valeur actuelle : ******** (masquée)"
    else
      echo "Valeur actuelle : ${current}"
    fi

    local confirm
    read -rp "Conserver cette valeur ? [O/n] " confirm
    if [[ ! "${confirm}" =~ ^[Nn]$ ]]; then
      printf -v "${var_name}" '%s' "${current}"
      return
    fi
  else
    echo "Aucune valeur définie."
  fi

  local new_value
  if [[ "${is_secret}" == "true" ]]; then
    read -rsp "Nouvelle valeur (Entrée = laisser vide) : " new_value
    echo
  else
    read -rp "Nouvelle valeur : " new_value
  fi

  if [[ -z "${new_value}" && "${allow_empty}" != "true" ]]; then
    read -rp "La valeur ne peut pas être vide. Nouvelle valeur : " new_value
    while [[ -z "${new_value}" ]]; do
      read -rp "La valeur ne peut pas être vide. Nouvelle valeur : " new_value
    done
  fi

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
    read -rp "Activer ? [o/N] (true/false) : " answer
    case "${answer,,}" in
      true|t|o|oui|y|yes|1) printf -v "${var_name}" '%s' "true"; return ;;
      false|f|n|non|''|0) printf -v "${var_name}" '%s' "false"; return ;;
      *) echo "Répondez par true ou false." ;;
    esac
  done
}

prompt_env() {
  local source_file="${INSTALL_DIR}/.env.example"
  if [[ -f "${INSTALL_DIR}/.env" ]]; then
    source_file="${INSTALL_DIR}/.env"
    log "Configuration existante détectée : ${INSTALL_DIR}/.env"
  else
    log "Aucun .env trouvé — utilisation de .env.example comme base."
  fi

  if [[ "${NON_INTERACTIVE}" == "true" && -f "${INSTALL_DIR}/.env" ]]; then
    log "Mode non-interactif : .env conservé tel quel."
    return
  fi

  echo ""
  echo "╔══════════════════════════════════════════════════════════════╗"
  echo "║        Configuration Dev on the go                           ║"
  echo "╠══════════════════════════════════════════════════════════════╣"
  echo "║  Pour chaque variable : confirmez [O] ou saisissez [n]       ║"
  echo "╚══════════════════════════════════════════════════════════════╝"

  # shellcheck disable=SC2034
  DOMAIN="$(read_env_value DOMAIN "${source_file}")"
  # shellcheck disable=SC2034
  ACME_EMAIL="$(read_env_value ACME_EMAIL "${source_file}")"
  # shellcheck disable=SC2034
  ADMIN_EMAIL="$(read_env_value ADMIN_EMAIL "${source_file}")"
  # shellcheck disable=SC2034
  ADMIN_FULL_NAME="$(read_env_value ADMIN_FULL_NAME "${source_file}")"
  # shellcheck disable=SC2034
  ADMIN_PASSWORD="$(read_env_value ADMIN_PASSWORD "${source_file}")"
  # shellcheck disable=SC2034
  APP_KEY="$(read_env_value APP_KEY "${source_file}")"
  # shellcheck disable=SC2034
  APP_URL="$(read_env_value APP_URL "${source_file}")"
  # shellcheck disable=SC2034
  ALLOW_PUBLIC_SIGNUP="$(read_env_value ALLOW_PUBLIC_SIGNUP "${source_file}")"
  # shellcheck disable=SC2034
  ENV_CPU_LIMIT="$(read_env_value ENV_CPU_LIMIT "${source_file}")"
  # shellcheck disable=SC2034
  ENV_MEMORY_LIMIT="$(read_env_value ENV_MEMORY_LIMIT "${source_file}")"

  # Valeurs par défaut si absentes
  ADMIN_FULL_NAME="${ADMIN_FULL_NAME:-Administrator}"
  ALLOW_PUBLIC_SIGNUP="${ALLOW_PUBLIC_SIGNUP:-false}"
  ENV_CPU_LIMIT="${ENV_CPU_LIMIT:-1}"
  ENV_MEMORY_LIMIT="${ENV_MEMORY_LIMIT:-1024m}"

  confirm_or_prompt DOMAIN "Domaine principal (ex: dev.example.com)" "${DOMAIN}"
  confirm_or_prompt ACME_EMAIL "Email Let's Encrypt (certificats TLS)" "${ACME_EMAIL}"
  confirm_or_prompt ADMIN_EMAIL "Email administrateur plateforme" "${ADMIN_EMAIL}"
  confirm_or_prompt ADMIN_FULL_NAME "Nom complet de l'administrateur" "${ADMIN_FULL_NAME}" false true

  confirm_or_prompt ADMIN_PASSWORD "Mot de passe administrateur" "${ADMIN_PASSWORD}" true true
  if [[ -z "${ADMIN_PASSWORD}" ]]; then
    ADMIN_PASSWORD="$(openssl rand -base64 16)"
    log "Mot de passe admin généré automatiquement."
  fi

  # APP_URL dérivé du domaine par défaut
  local default_app_url="https://admin.${DOMAIN}"
  if [[ -z "${APP_URL}" || "${APP_URL}" == *"example.com"* || "${APP_URL}" == *"\${HOST}"* ]]; then
    APP_URL="${default_app_url}"
  fi

  confirm_or_prompt APP_URL "URL de l'interface admin" "${APP_URL}"

  confirm_or_prompt_bool ALLOW_PUBLIC_SIGNUP "Inscription publique autorisée" "${ALLOW_PUBLIC_SIGNUP}"
  confirm_or_prompt ENV_CPU_LIMIT "Limite CPU par environnement (cores)" "${ENV_CPU_LIMIT}"
  confirm_or_prompt ENV_MEMORY_LIMIT "Limite RAM par environnement (ex: 1024m)" "${ENV_MEMORY_LIMIT}"

  if [[ -z "${APP_KEY}" ]]; then
    APP_KEY="$(openssl rand -base64 32)"
    log "APP_KEY générée automatiquement."
  else
    echo ""
    echo "── Clé de chiffrement application (APP_KEY) ──"
    echo "Valeur actuelle : ******** (masquée)"
    local regen_key
    read -rp "Regénérer APP_KEY ? [o/N] " regen_key
    if [[ "${regen_key}" =~ ^[OoYy]$ ]]; then
      APP_KEY="$(openssl rand -base64 32)"
      log "APP_KEY regénérée."
    fi
  fi

  echo ""
  echo "── Récapitulatif ──"
  echo "  DOMAIN              = ${DOMAIN}"
  echo "  ACME_EMAIL          = ${ACME_EMAIL}"
  echo "  ADMIN_EMAIL         = ${ADMIN_EMAIL}"
  echo "  ADMIN_FULL_NAME     = ${ADMIN_FULL_NAME}"
  echo "  ADMIN_PASSWORD      = ********"
  echo "  APP_URL             = ${APP_URL}"
  echo "  ALLOW_PUBLIC_SIGNUP = ${ALLOW_PUBLIC_SIGNUP}"
  echo "  ENV_CPU_LIMIT       = ${ENV_CPU_LIMIT}"
  echo "  ENV_MEMORY_LIMIT    = ${ENV_MEMORY_LIMIT}"
  echo ""

  if [[ "${NON_INTERACTIVE}" != "true" ]]; then
    local final_confirm
    read -rp "Enregistrer cette configuration dans .env ? [O/n] " final_confirm
    if [[ "${final_confirm}" =~ ^[Nn]$ ]]; then
      error "Installation annulée par l'utilisateur."
    fi
  fi

  write_env_file

  log "Configuration sauvegardée dans ${INSTALL_DIR}/.env"
  log "Identifiants admin — email: ${ADMIN_EMAIL} / mot de passe: ${ADMIN_PASSWORD}"
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
  docker compose pull
  docker compose build platform
  docker compose up -d

  log "Attente du démarrage de la plateforme..."
  sleep 10
  docker compose exec -T platform node ace migration:run --force || true
  docker compose exec -T platform node ace db:seed || true
}

print_summary() {
  # shellcheck source=/dev/null
  source "${INSTALL_DIR}/.env"
  cat <<EOF

╔══════════════════════════════════════════════════════════════╗
║           Dev on the go — Installation terminée              ║
╠══════════════════════════════════════════════════════════════╣
║  Admin:     ${APP_URL}
║  Email:     ${ADMIN_EMAIL}
║  Password:  ${ADMIN_PASSWORD}
╠══════════════════════════════════════════════════════════════╣
║  Commandes utiles:
║    cd ${INSTALL_DIR}
║    docker compose logs -f platform
║    docker compose restart
╚══════════════════════════════════════════════════════════════╝
EOF
}

main() {
  parse_args "$@"
  require_root
  detect_os
  install_docker
  configure_firewall
  clone_or_update
  prompt_env
  build_images
  start_stack
  print_summary
}

main "$@"
