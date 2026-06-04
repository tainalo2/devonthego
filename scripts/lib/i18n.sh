#!/usr/bin/env bash
# Dev on the go — shell script i18n (en, fr, es, de, pt, it). Default: en.
# Usage: source scripts/lib/i18n.sh && dotg_i18n_init

declare -gA DOTG_MSG=()
declare -g DOTG_LOCALE="en"

dotg_detect_locale() {
  local raw="${DOTG_LANG:-${LANG:-${LC_ALL:-en}}}"
  raw="${raw%%.*}"
  raw="${raw%%_*}"
  raw="${raw,,}"
  case "${raw}" in
    en | fr | es | de | pt | it) printf '%s' "${raw}" ;;
    *) printf '%s' "en" ;;
  esac
}

dotg_load_locale() {
  local locale="$1"
  local lib_dir

  lib_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/lang"
  DOTG_MSG=()
  DOTG_LOCALE="${locale}"

  # shellcheck source=/dev/null
  source "${lib_dir}/${locale}.sh" 2>/dev/null || source "${lib_dir}/en.sh"
}

dotg_i18n_init() {
  dotg_load_locale "$(dotg_detect_locale)"
}

# t KEY [name=value ...]
t() {
  local key="$1"
  shift
  local msg="${DOTG_MSG[${key}]:-${key}}"

  while [[ $# -gt 0 ]]; do
    local pair="$1"
    local var="${pair%%=*}"
    local val="${pair#*=}"
    msg="${msg//\{${var}\}/${val}}"
    shift
  done

  printf '%s' "${msg}"
}

log_msg() {
  printf '[devonthego] %s\n' "$(t "$@")"
}

error_msg() {
  printf '[devonthego] ERROR: %s\n' "$(t "$@")" >&2
  exit 1
}
