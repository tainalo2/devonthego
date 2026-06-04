#!/usr/bin/env bash
set -euo pipefail

# Finalize deployment after web setup wizard (production HTTPS mode).
# Called from platform container via SetupService.

INSTALL_DIR="${1:-/opt/devonthego}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=/dev/null
source "${SCRIPT_DIR}/lib/i18n.sh"
dotg_i18n_init

if [[ ! -f "${INSTALL_DIR}/.env" ]]; then
  echo "[finish-setup] ERROR: $(t finish.error.no_env dir="${INSTALL_DIR}")" >&2
  exit 1
fi

cd "${INSTALL_DIR}"

log() { echo "[finish-setup] $(t "$@")"; }

log finish.recreating
docker compose -f docker-compose.yml up -d --force-recreate traefik platform

log finish.done
