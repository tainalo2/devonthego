#!/usr/bin/env bash
set -euo pipefail

# Generate a self-signed TLS certificate for bootstrap access (server IP).
# Usage: generate-bootstrap-certs.sh <cert_dir> <server_ip>

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# shellcheck source=/dev/null
source "${SCRIPT_DIR}/lib/i18n.sh"
dotg_i18n_init

CERT_DIR="${1:?$(t certs.error.cert_dir)}"
SERVER_IP="${2:?$(t certs.error.server_ip)}"

mkdir -p "${CERT_DIR}"

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout "${CERT_DIR}/key.pem" \
  -out "${CERT_DIR}/cert.pem" \
  -subj "/CN=devonthego-bootstrap/O=Dev on the go/C=FR" \
  -addext "subjectAltName=IP:${SERVER_IP},DNS:bootstrap.local" 2>/dev/null

chmod 600 "${CERT_DIR}/key.pem"
chmod 644 "${CERT_DIR}/cert.pem"

echo "[generate-bootstrap-certs] $(t certs.created ip="${SERVER_IP}" dir="${CERT_DIR}")"
