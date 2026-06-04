#!/usr/bin/env bash
set -euo pipefail

# Dev on the go — Bootstrap VPS
# Usage: curl -fsSL .../install.sh | bash
#    or: ./install.sh

REPO_URL="${DOTG_REPO_URL:-https://github.com/tainalo2/dev-on-the-go.git}"
INSTALL_DIR="${DOTG_INSTALL_DIR:-/opt/devonthego}"
MIN_DOCKER_VERSION="24.0.0"

log() { echo "[devonthego] $*"; }
error() { echo "[devonthego] ERROR: $*" >&2; exit 1; }

require_root() {
  [[ "${EUID}" -eq 0 ]] || error "Ce script doit être exécuté en root (sudo)."
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

prompt_env() {
  if [[ -f "${INSTALL_DIR}/.env" ]]; then
    log "Fichier .env existant, configuration conservée."
    return
  fi

  read -rp "Domaine principal (ex: dev.example.com): " DOMAIN
  read -rp "Email Let's Encrypt: " ACME_EMAIL
  read -rp "Email administrateur: " ADMIN_EMAIL
  read -rsp "Mot de passe administrateur (laisser vide pour générer): " ADMIN_PASSWORD
  echo

  if [[ -z "${ADMIN_PASSWORD}" ]]; then
    ADMIN_PASSWORD="$(openssl rand -base64 16)"
    log "Mot de passe admin généré."
  fi

  APP_KEY="$(openssl rand -base64 32)"

  cp "${INSTALL_DIR}/.env.example" "${INSTALL_DIR}/.env"
  sed -i "s|^DOMAIN=.*|DOMAIN=${DOMAIN}|" "${INSTALL_DIR}/.env"
  sed -i "s|^ACME_EMAIL=.*|ACME_EMAIL=${ACME_EMAIL}|" "${INSTALL_DIR}/.env"
  sed -i "s|^ADMIN_EMAIL=.*|ADMIN_EMAIL=${ADMIN_EMAIL}|" "${INSTALL_DIR}/.env"
  sed -i "s|^ADMIN_PASSWORD=.*|ADMIN_PASSWORD=${ADMIN_PASSWORD}|" "${INSTALL_DIR}/.env"
  sed -i "s|^APP_KEY=.*|APP_KEY=${APP_KEY}|" "${INSTALL_DIR}/.env"
  sed -i "s|^APP_URL=.*|APP_URL=https://admin.${DOMAIN}|" "${INSTALL_DIR}/.env"

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
║  Admin:     https://admin.${DOMAIN}
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
