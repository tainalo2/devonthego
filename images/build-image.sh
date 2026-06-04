#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

# shellcheck source=/dev/null
source "${ROOT_DIR}/scripts/lib/i18n.sh"
dotg_i18n_init

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
$(t build.help.usage name="$(basename "$0")")

$(t build.help.description)

Options:
  --name NAME           $(t build.help.name)
  --base IMAGE          $(t build.help.base)
  --dockerfile PATH     $(t build.help.dockerfile)
  --template NAME       $(t build.help.template)
  --tag TAG             $(t build.help.tag)
  --registry URL        $(t build.help.registry)
  --push                $(t build.help.push)
  --build-base          $(t build.help.build_base)
  -h, --help            $(t build.help.help)

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
    *)
      echo "$(t build.error.unknown_option opt="$1")" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ "${BUILD_BASE}" == "true" ]]; then
  echo "$(t build.building_base)"
  docker build -t devonthego/base:latest -f "${ROOT_DIR}/images/base/Dockerfile" "${ROOT_DIR}/images/base"
fi

if [[ -n "${TEMPLATE}" ]]; then
  DOCKERFILE="${ROOT_DIR}/images/templates/${TEMPLATE}/Dockerfile"
  if [[ ! -f "${DOCKERFILE}" ]]; then
    echo "$(t build.error.template_not_found name="${TEMPLATE}")" >&2
    exit 1
  fi
  [[ -z "${NAME}" ]] && NAME="${TEMPLATE}"
fi

if [[ -z "${NAME}" ]]; then
  echo "$(t build.error.name_required)" >&2
  usage
  exit 1
fi

if [[ -z "${DOCKERFILE}" ]]; then
  echo "$(t build.error.dockerfile_required)" >&2
  usage
  exit 1
fi

if [[ ! -f "${DOCKERFILE}" ]]; then
  echo "$(t build.error.dockerfile_not_found path="${DOCKERFILE}")" >&2
  exit 1
fi

LOCAL_TAG="devonthego/custom:${NAME}-${TAG}"
REGISTRY_TAG="${REGISTRY}/devonthego/custom:${NAME}-${TAG}"

echo "$(t build.building_from tag="${LOCAL_TAG}" dockerfile="${DOCKERFILE}")"
docker build \
  --build-arg "BASE_IMAGE=${BASE_IMAGE}" \
  -t "${LOCAL_TAG}" \
  -f "${DOCKERFILE}" \
  "$(dirname "${DOCKERFILE}")"

docker tag "${LOCAL_TAG}" "${REGISTRY_TAG}"

echo "$(t build.tagged tag="${REGISTRY_TAG}")"

if [[ "${PUSH}" == "true" ]]; then
  echo "$(t build.pushing registry="${REGISTRY}")"
  docker push "${REGISTRY_TAG}"
fi

echo "$(t build.done tag="${LOCAL_TAG}")"
