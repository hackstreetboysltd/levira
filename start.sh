#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

PORT="${PORT:-3000}"
URL="http://localhost:${PORT}"

free_port() {
  local port="$1"
  local pids=""

  if command -v fuser >/dev/null 2>&1; then
    pids="$(fuser "${port}/tcp" 2>/dev/null || true)"
  elif command -v lsof >/dev/null 2>&1; then
    pids="$(lsof -t -iTCP:"${port}" -sTCP:LISTEN 2>/dev/null || true)"
  elif command -v ss >/dev/null 2>&1; then
    pids="$(
      ss -lptn "sport = :${port}" 2>/dev/null \
        | grep -oE 'pid=[0-9]+' \
        | cut -d= -f2 \
        | sort -u \
        || true
    )"
  fi

  pids="$(echo "${pids}" | tr -s '[:space:]' '\n' | grep -E '^[0-9]+$' | sort -u | tr '\n' ' ' || true)"

  if [[ -z "${pids// }" ]]; then
    return 0
  fi

  echo "Port ${port} is in use by PID(s): ${pids}"
  echo "Stopping those process(es)…"
  # shellcheck disable=SC2086
  kill ${pids} 2>/dev/null || true
  sleep 0.4

  local still=""
  if command -v fuser >/dev/null 2>&1; then
    still="$(fuser "${port}/tcp" 2>/dev/null || true)"
  elif command -v lsof >/dev/null 2>&1; then
    still="$(lsof -t -iTCP:"${port}" -sTCP:LISTEN 2>/dev/null || true)"
  fi
  still="$(echo "${still}" | tr -s '[:space:]' '\n' | grep -E '^[0-9]+$' | sort -u | tr '\n' ' ' || true)"
  if [[ -n "${still// }" ]]; then
    # shellcheck disable=SC2086
    kill -9 ${still} 2>/dev/null || true
    sleep 0.2
  fi
}

open_browser() {
  local url="$1"
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$url" >/dev/null 2>&1 || true
  elif command -v gio >/dev/null 2>&1; then
    gio open "$url" >/dev/null 2>&1 || true
  else
    echo "Open ${url} in your browser."
  fi
}

wait_for_server() {
  local url="$1"
  local attempts=60
  local i
  for ((i = 1; i <= attempts; i++)); do
    if curl -fsS "$url" >/dev/null 2>&1; then
      return 0
    fi
    sleep 0.25
  done
  return 1
}

if [[ ! -d node_modules ]]; then
  echo "Installing dependencies…"
  npm install
fi

free_port "$PORT"

echo "Starting LEVIRA on ${URL}"
npm run dev -- --port "$PORT" &
DEV_PID=$!

cleanup() {
  if kill -0 "$DEV_PID" 2>/dev/null; then
    kill "$DEV_PID" 2>/dev/null || true
    wait "$DEV_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

if wait_for_server "$URL"; then
  echo "Opening ${URL}"
  open_browser "$URL"
else
  echo "Server did not become ready in time — open ${URL} manually."
fi

wait "$DEV_PID"
