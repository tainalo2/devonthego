#!/usr/bin/env bash
set -euo pipefail

# Dev on the go — Image de base OpenVSCode Server
FROM gitpod/openvscode-server:latest

USER root

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    git \
    curl \
    wget \
    ca-certificates \
    sudo \
    build-essential \
  && rm -rf /var/lib/apt/lists/*

COPY entrypoint.sh /usr/local/bin/dotg-entrypoint.sh
RUN chmod +x /usr/local/bin/dotg-entrypoint.sh

USER openvscode-server
WORKDIR /home/workspace

ENV OPENVSCODE_SERVER_ROOT="/home/.openvscode-server"
ENV OPENVSCODE="${OPENVSCODE_SERVER_ROOT}/bin/openvscode-server"

SHELL ["/bin/bash", "-c"]
RUN \
  exts=( \
    "GitHub.vscode-pull-request-github" \
    "eamodio.gitlens" \
  ) \
  && for ext in "${exts[@]}"; do \
    ${OPENVSCODE} --install-extension "${ext}"; \
  done

EXPOSE 3000
ENTRYPOINT ["/usr/local/bin/dotg-entrypoint.sh"]
