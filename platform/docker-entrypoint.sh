#!/bin/sh
set -e
cd /app
node build/ace.js migration:run --force
exec node build/bin/server.js
