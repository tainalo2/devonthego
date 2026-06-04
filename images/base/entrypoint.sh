#!/usr/bin/env bash
set -euo pipefail

OPENVSCODE_SERVER_ROOT="${OPENVSCODE_SERVER_ROOT:-/home/.openvscode-server}"
OPENVSCODE="${OPENVSCODE:-${OPENVSCODE_SERVER_ROOT}/bin/openvscode-server}"

args=(--host 0.0.0.0 --port 3000)

if [[ -n "${CONNECTION_TOKEN:-}" ]]; then
  args+=(--connection-token "${CONNECTION_TOKEN}")
else
  args+=(--without-connection-token)
fi

exec "${OPENVSCODE}" "${args[@]}"
