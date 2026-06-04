FROM devonthego/base:latest

USER root

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    php-cli \
    php-mbstring \
    php-xml \
    php-curl \
    php-zip \
    unzip \
  && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
  && rm -rf /var/lib/apt/lists/*

USER openvscode-server

ENV OPENVSCODE_SERVER_ROOT="/home/.openvscode-server"
ENV OPENVSCODE="${OPENVSCODE_SERVER_ROOT}/bin/openvscode-server"

SHELL ["/bin/bash", "-c"]
RUN \
  exts=( \
    "bmewburn.vscode-intelephense-client" \
    "xdebug.php-debug" \
  ) \
  && for ext in "${exts[@]}"; do \
    ${OPENVSCODE} --install-extension "${ext}"; \
  done
