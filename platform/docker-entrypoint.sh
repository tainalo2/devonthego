#!/bin/sh
set -e
cd /app
node build/ace.js migration:run --force
node build/ace.js db:seed --force || true
exec node build/bin/server.js
