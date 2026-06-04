#!/usr/bin/env bash
set -euo pipefail

# Génère un certificat TLS autosigné pour l'accès bootstrap (IP du serveur).
# Usage: generate-bootstrap-certs.sh <cert_dir> <server_ip>

CERT_DIR="${1:?Répertoire certificats requis}"
SERVER_IP="${2:?IP du serveur requise}"

mkdir -p "${CERT_DIR}"

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout "${CERT_DIR}/key.pem" \
  -out "${CERT_DIR}/cert.pem" \
  -subj "/CN=devonthego-bootstrap/O=Dev on the go/C=FR" \
  -addext "subjectAltName=IP:${SERVER_IP},DNS:bootstrap.local" 2>/dev/null

chmod 600 "${CERT_DIR}/key.pem"
chmod 644 "${CERT_DIR}/cert.pem"

echo "[generate-bootstrap-certs] Certificat créé pour IP ${SERVER_IP} dans ${CERT_DIR}"
