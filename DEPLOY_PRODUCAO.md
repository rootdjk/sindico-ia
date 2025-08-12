# 🚀 Deploy em Produção - Síndico Online

## 📋 Visão Geral

Este documento contém instruções detalhadas para colocar o sistema **Síndico Online** em produção de forma segura e escalável.

## 🛡️ Checklist Pré-Deploy

### ✅ Requisitos Obrigatórios

- [ ] **Servidor Linux** (Ubuntu 20.04+ recomendado)
- [ ] **Docker** e **Docker Compose** instalados
- [ ] **Certificado SSL** (Let's Encrypt ou comercial)
- [ ] **Domínio** configurado apontando para o servidor
- [ ] **PostgreSQL** em produção (RDS, DigitalOcean, etc.)
- [ ] **Backup strategy** definida
- [ ] **Monitoramento** configurado

### 🔐 Segurança

- [ ] Firewall configurado (portas 80, 443, 22)
- [ ] SSH com chave pública/privada
- [ ] Usuário não-root para aplicação
- [ ] Variáveis de ambiente seguras
- [ ] Rate limiting configurado
- [ ] CORS restritivo

## 🐳 Docker Setup

### 1. Dockerfile Backend

Crie `apps/backend/Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copiar aplicação
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./package.json

USER nestjs

EXPOSE 3001

CMD ["node", "dist/main"]
```

### 2. Dockerfile Frontend

Crie `apps/frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
```

### 3. Docker Compose

Crie `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./apps/backend
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      - FRONTEND_URL=${FRONTEND_URL}
    ports:
      - "3001:3001"
    restart: unless-stopped
    depends_on:
      - postgres
    networks:
      - sindico-network

  frontend:
    build:
      context: ./apps/frontend
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
    ports:
      - "3000:3000"
    restart: unless-stopped
    depends_on:
      - backend
    networks:
      - sindico-network

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    ports:
      - "5432:5432"
    restart: unless-stopped
    networks:
      - sindico-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
    networks:
      - sindico-network

volumes:
  postgres_data:

networks:
  sindico-network:
    driver: bridge
```

## 🔧 Configuração do Nginx

Crie `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name sindicoonline.com www.sindicoonline.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS Frontend
    server {
        listen 443 ssl http2;
        server_name sindicoonline.com www.sindicoonline.com;

        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        location / {
            proxy_pass http://frontend:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /api/ {
            limit_req zone=api burst=20 nodelay;
            
            proxy_pass http://backend:3001;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /api/auth/login {
            limit_req zone=login burst=5 nodelay;
            
            proxy_pass http://backend:3001;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

## 🔑 Variáveis de Ambiente de Produção

Crie `.env.production`:

```env
# Database
DATABASE_URL="postgresql://username:password@postgres:5432/sindico_online_prod"
POSTGRES_DB=sindico_online_prod
POSTGRES_USER=sindico_user
POSTGRES_PASSWORD=SENHA_SUPER_SEGURA_AQUI

# JWT (OBRIGATÓRIO: Gere uma chave de 32+ caracteres)
JWT_SECRET="sua-chave-ultra-secreta-de-32-caracteres-ou-mais"
JWT_EXPIRES_IN="7d"

# Application
NODE_ENV=production
PORT=3001
FRONTEND_URL="https://sindicoonline.com"
NEXT_PUBLIC_API_URL="https://sindicoonline.com/api"

# Email (Opcional - para notificações futuras)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="noreply@sindicoonline.com"
SMTP_PASS="senha_do_email"

# Monitoring (Opcional)
SENTRY_DSN="https://your-sentry-dsn"

# Backup
BACKUP_RETENTION_DAYS=30
```

## 📦 Scripts de Deploy

### 1. Script de Deploy Inicial

Crie `deploy.sh`:

```bash
#!/bin/bash

echo "🚀 Iniciando deploy do Síndico Online..."

# Parar serviços existentes
echo "⏹️ Parando serviços..."
docker-compose -f docker-compose.prod.yml down

# Fazer backup do banco
echo "💾 Fazendo backup do banco..."
docker exec sindico-postgres pg_dump -U $POSTGRES_USER $POSTGRES_DB > ./backups/backup_$(date +%Y%m%d_%H%M%S).sql

# Atualizar código
echo "📥 Atualizando código..."
git pull origin main

# Rebuild das imagens
echo "🔨 Construindo imagens..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Executar migrations
echo "🗃️ Executando migrations..."
docker-compose -f docker-compose.prod.yml run --rm backend npm run db:migrate

# Subir serviços
echo "🚀 Subindo serviços..."
docker-compose -f docker-compose.prod.yml up -d

# Verificar saúde dos serviços
echo "🏥 Verificando saúde dos serviços..."
sleep 30
curl -f http://localhost:3001/api/health || echo "❌ Backend não está respondendo"
curl -f http://localhost:3000 || echo "❌ Frontend não está respondendo"

echo "✅ Deploy concluído!"
```

### 2. Script de Backup

Crie `backup.sh`:

```bash
#!/bin/bash

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-30}

echo "💾 Iniciando backup..."

# Criar diretório de backup se não existir
mkdir -p $BACKUP_DIR

# Backup do banco
docker exec sindico-postgres pg_dump -U $POSTGRES_USER $POSTGRES_DB | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Backup dos uploads (se existirem)
if [ -d "./uploads" ]; then
    tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz ./uploads
fi

# Remover backups antigos
find $BACKUP_DIR -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "✅ Backup concluído: $BACKUP_DIR/db_backup_$DATE.sql.gz"
```

## 🔐 Certificado SSL (Let's Encrypt)

### 1. Instalar Certbot

```bash
sudo apt update
sudo apt install snapd
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

### 2. Gerar Certificado

```bash
# Parar nginx temporariamente
sudo systemctl stop nginx

# Gerar certificado
sudo certbot certonly --standalone -d sindicoonline.com -d www.sindicoonline.com

# Configurar renovação automática
sudo crontab -e
# Adicionar linha:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

### 3. Copiar Certificados

```bash
sudo cp /etc/letsencrypt/live/sindicoonline.com/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/sindicoonline.com/privkey.pem ./ssl/
sudo chown $USER:$USER ./ssl/*
```

## 📊 Monitoramento

### 1. Health Check Endpoint

Adicione ao backend (`apps/backend/src/health/health.controller.ts`):

```typescript
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }
}
```

### 2. Script de Monitoramento

Crie `monitor.sh`:

```bash
#!/bin/bash

check_service() {
    local service=$1
    local url=$2
    
    if curl -f -s $url > /dev/null; then
        echo "✅ $service está funcionando"
    else
        echo "❌ $service está com problemas"
        # Aqui você pode adicionar alertas (email, Slack, etc.)
    fi
}

echo "🔍 Verificando serviços..."
check_service "Frontend" "http://localhost:3000"
check_service "Backend" "http://localhost:3001/api/health"
check_service "API Docs" "http://localhost:3001/api/docs"

# Verificar espaço em disco
df -h | grep -E "/$|/var"

# Verificar memória
free -h

# Verificar containers
docker ps --format "table {{.Names}}\t{{.Status}}"
```

## 🔧 Configurações de Sistema

### 1. Configurar Firewall

```bash
# UFW (Ubuntu)
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Verificar status
sudo ufw status
```

### 2. Configurar Swap

```bash
# Criar swap de 2GB
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Tornar permanente
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 3. Otimizar PostgreSQL

Adicione ao `postgresql.conf`:

```conf
# Conexões
max_connections = 100

# Memória
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB

# WAL
wal_buffers = 16MB
checkpoint_completion_target = 0.7

# Logging
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
log_min_duration_statement = 1000
```

## 📈 Otimizações de Performance

### 1. PM2 para Node.js (alternativa ao Docker)

```bash
# Instalar PM2
npm install -g pm2

# Configurar ecosystem
# ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'sindico-backend',
      script: 'dist/main.js',
      cwd: './apps/backend',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    },
    {
      name: 'sindico-frontend',
      script: 'npm',
      args: 'start',
      cwd: './apps/frontend',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};

# Iniciar aplicações
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 2. Redis Cache (opcional)

```yaml
# Adicionar ao docker-compose.prod.yml
redis:
  image: redis:7-alpine
  ports:
    - "6379:6379"
  volumes:
    - redis_data:/data
  restart: unless-stopped
  networks:
    - sindico-network
```

## 🚨 Troubleshooting

### Logs dos Containers

```bash
# Ver logs em tempo real
docker-compose -f docker-compose.prod.yml logs -f

# Logs específicos
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend
```

### Problemas Comuns

#### 1. Container não inicia
```bash
# Verificar status
docker-compose -f docker-compose.prod.yml ps

# Debugar container
docker-compose -f docker-compose.prod.yml run --rm backend sh
```

#### 2. Banco não conecta
```bash
# Testar conexão
docker-compose -f docker-compose.prod.yml exec postgres psql -U $POSTGRES_USER -d $POSTGRES_DB
```

#### 3. SSL não funciona
```bash
# Verificar certificados
sudo certbot certificates

# Renovar manualmente
sudo certbot renew --dry-run
```

## ✅ Checklist Final

### Antes do Go-Live

- [ ] Todos os serviços rodando sem erros
- [ ] SSL funcionando corretamente
- [ ] Backup automático configurado
- [ ] Monitoramento ativo
- [ ] DNS apontando corretamente
- [ ] Testes de carga realizados
- [ ] Documentação atualizada
- [ ] Equipe treinada

### Pós Go-Live

- [ ] Monitorar logs por 24h
- [ ] Verificar performance
- [ ] Testar backups
- [ ] Documentar incidentes
- [ ] Coletar feedback dos usuários

---

**🎉 Parabéns! Seu sistema está pronto para produção!**

Para suporte em deploy, entre em contato: **deploy@sindicoonline.com**