#!/usr/bin/env bash
set -euo pipefail

# Finalise le déploiement après l'assistant web (mode production HTTPS).
# Appelé depuis le conteneur platform via SetupService.

INSTALL_DIR="${1:-/opt/devonthego}"

if [[ ! -f "${INSTALL_DIR}/.env" ]]; then
  echo "[finish-setup] ERROR: .env introuvable dans ${INSTALL_DIR}" >&2
  exit 1
fi

cd "${INSTALL_DIR}"

log() { echo "[finish-setup] $*"; }

log "Recréation Traefik et plateforme (mode production)..."
docker compose -f docker-compose.yml up -d --force-recreate traefik platform

log "Terminé. La plateforme redémarre avec HTTPS sur admin.\${DOMAIN}."
