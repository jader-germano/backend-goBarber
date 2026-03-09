# --- Build stage ---
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production=false

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# --- Production stage ---
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/shared/infra/typeorm/migrations ./dist/shared/infra/typeorm/migrations

RUN mkdir -p tmp/uploads

EXPOSE 3333

CMD ["node", "dist/shared/infra/http/server.js"]
