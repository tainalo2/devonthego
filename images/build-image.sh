#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

NAME=""
BASE_IMAGE="devonthego/base:latest"
DOCKERFILE=""
TEMPLATE=""
TAG="latest"
REGISTRY="${DOCKER_REGISTRY:-registry:5000}"
PUSH=false
BUILD_BASE=false

usage() {
  cat <<EOF
Usage: $(basename "$0") [options]

Build a custom Dev on the go environment image.

Options:
  --name NAME           Image name (required), e.g. my-project
  --base IMAGE          Base image (default: devonthego/base:latest)
  --dockerfile PATH     Custom Dockerfile path
  --template NAME       Use a built-in template: node, python, php
  --tag TAG             Image tag (default: latest)
  --registry URL        Local registry (default: registry:5000)
  --push                Push to local registry after build
  --build-base          Build base image before custom image
  -h, --help            Show this help

Examples:
  $(basename "$0") --build-base --name base --dockerfile images/base/Dockerfile
  $(basename "$0") --template node --name node-dev
  $(basename "$0") --name laravel --dockerfile ./my/Dockerfile --push
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --name) NAME="$2"; shift 2 ;;
    --base) BASE_IMAGE="$2"; shift 2 ;;
    --dockerfile) DOCKERFILE="$2"; shift 2 ;;
    --template) TEMPLATE="$2"; shift 2 ;;
    --tag) TAG="$2"; shift 2 ;;
    --registry) REGISTRY="$2"; shift 2 ;;
    --push) PUSH=true; shift ;;
    --build-base) BUILD_BASE=true; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage; exit 1 ;;
  esac
done

if [[ "${BUILD_BASE}" == "true" ]]; then
  echo "==> Building base image..."
  docker build -t devonthego/base:latest -f "${ROOT_DIR}/images/base/Dockerfile" "${ROOT_DIR}/images/base"
fi

if [[ -n "${TEMPLATE}" ]]; then
  DOCKERFILE="${ROOT_DIR}/images/templates/${TEMPLATE}/Dockerfile"
  if [[ ! -f "${DOCKERFILE}" ]]; then
    echo "Template not found: ${TEMPLATE}" >&2
    exit 1
  fi
  [[ -z "${NAME}" ]] && NAME="${TEMPLATE}"
fi

if [[ -z "${NAME}" ]]; then
  echo "Error: --name is required" >&2
  usage
  exit 1
fi

if [[ -z "${DOCKERFILE}" ]]; then
  echo "Error: --dockerfile or --template is required" >&2
  usage
  exit 1
fi

if [[ ! -f "${DOCKERFILE}" ]]; then
  echo "Dockerfile not found: ${DOCKERFILE}" >&2
  exit 1
fi

LOCAL_TAG="devonthego/custom:${NAME}-${TAG}"
REGISTRY_TAG="${REGISTRY}/devonthego/custom:${NAME}-${TAG}"

echo "==> Building ${LOCAL_TAG} from ${DOCKERFILE}"
docker build \
  --build-arg "BASE_IMAGE=${BASE_IMAGE}" \
  -t "${LOCAL_TAG}" \
  -f "${DOCKERFILE}" \
  "$(dirname "${DOCKERFILE}")"

docker tag "${LOCAL_TAG}" "${REGISTRY_TAG}"

echo "==> Tagged as ${REGISTRY_TAG}"

if [[ "${PUSH}" == "true" ]]; then
  echo "==> Pushing to ${REGISTRY}..."
  docker push "${REGISTRY_TAG}"
fi

echo "Done. Image ready: ${LOCAL_TAG}"
