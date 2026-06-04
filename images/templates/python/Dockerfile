FROM devonthego/base:latest

USER root

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 python3-pip python3-venv \
  && rm -rf /var/lib/apt/lists/*

USER openvscode-server

ENV OPENVSCODE_SERVER_ROOT="/home/.openvscode-server"
ENV OPENVSCODE="${OPENVSCODE_SERVER_ROOT}/bin/openvscode-server"

SHELL ["/bin/bash", "-c"]
RUN \
  exts=( \
    "ms-python.python" \
    "charliermarsh.ruff" \
  ) \
  && for ext in "${exts[@]}"; do \
    ${OPENVSCODE} --install-extension "${ext}"; \
  done
