#!/bin/bash
# deploy.sh — Script de deploy do GoBarber no VPS
# VPS: srv1443703.hstgr.cloud (187.77.227.151)
# Uso: bash scripts/deploy.sh

set -e

echo "==> Fazendo pull do repositório..."
git pull origin master

echo "==> Parando containers existentes..."
docker compose down

echo "==> Fazendo build e subindo containers..."
docker compose up -d --build

echo "==> Aguardando banco de dados ficar pronto..."
sleep 5

echo "==> Executando migrations..."
docker compose exec api node dist/shared/infra/http/server.js &
sleep 2
docker compose exec api npx typeorm migration:run -d dist/database/data-source.js || true

echo "==> Deploy concluído!"
echo "==> API disponível em: http://187.77.227.151"
docker compose ps
