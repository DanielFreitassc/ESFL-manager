# Etapa 1 — Build da aplicação
FROM node:20-alpine AS builder

# Define diretório de trabalho
WORKDIR /app

# Copia arquivos necessários
COPY package*.json ./
# Instala dependências
RUN npm ci

# Copia o restante do código
COPY . .

# Build da aplicação
RUN npm run build

# Etapa 2 — Execução em produção
FROM node:20-alpine AS runner

WORKDIR /app

# Copia apenas os arquivos necessários para execução
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Define variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000

# Expõe a porta 3000
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "start"]