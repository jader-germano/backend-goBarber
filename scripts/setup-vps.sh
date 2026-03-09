#!/bin/bash
# setup-vps.sh — Configuração inicial do VPS Hostinger
# Rodar APENAS UMA VEZ no VPS: bash scripts/setup-vps.sh
# VPS: srv1443703.hstgr.cloud (187.77.227.151)

set -e

echo "==> Atualizando sistema..."
apt update && apt upgrade -y

echo "==> Instalando Docker..."
curl -fsSL https://get.docker.com | sh
usermod -aG docker $USER

echo "==> Instalando Docker Compose..."
apt install -y docker-compose-plugin

echo "==> Instalando Git..."
apt install -y git

echo "==> Instalando Certbot para SSL..."
apt install -y certbot python3-certbot-nginx

echo "==> Clonando repositório GoBarber..."
mkdir -p /app
cd /app
git clone https://github.com/jader-germano/backend-goBarber .

echo "==> Criando arquivo .env de produção..."
cat > .env << 'EOF'
NODE_ENV=production
PORT=3333

DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASS=GoBarber2024!Secure
DB_NAME=gostack_gobarber

JWT_SECRET=TROQUE_POR_UMA_SECRET_FORTE_E_ALEATORIA
JWT_EXPIRES_IN=1d
EOF

echo "==> Configuração inicial concluída!"
echo ""
echo "PRÓXIMOS PASSOS:"
echo "1. Edite /app/.env com as configurações corretas"
echo "2. cd /app && bash scripts/deploy.sh"
echo "3. Após comprar o domínio, configure SSL:"
echo "   certbot --nginx -d SEU_DOMINIO.com.br"
