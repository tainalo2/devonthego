FROM devonthego/base:latest

USER root

RUN curl -fsSL https://deb.nodesource.com/setup_24.x | bash - \
  && apt-get install -y nodejs \
  && npm install -g pnpm \
  && rm -rf /var/lib/apt/lists/*

USER openvscode-server

ENV OPENVSCODE_SERVER_ROOT="/home/.openvscode-server"
ENV OPENVSCODE="${OPENVSCODE_SERVER_ROOT}/bin/openvscode-server"

SHELL ["/bin/bash", "-c"]
RUN \
  exts=( \
    "dbaeumer.vscode-eslint" \
    "esbenp.prettier-vscode" \
  ) \
  && for ext in "${exts[@]}"; do \
    ${OPENVSCODE} --install-extension "${ext}"; \
  done
