# 🏢 Síndico Online - Sistema de Gestão para Condomínios

[![GitHub](https://img.shields.io/badge/GitHub-Síndico%20Online-red)](https://github.com/sindico-online)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-brightgreen)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)](https://postgresql.org/)

## 📋 Visão Geral

O **Síndico Online** é um sistema SaaS completo para gestão de condomínios, desenvolvido com foco na **funcionalidade de registro de ocorrências**. O sistema utiliza as cores oficiais da Paraíba (vermelho #FF0000 e preto #000000) seguindo padrões governamentais.

### 🎯 Módulos Implementados

✅ **Registro de Ocorrências** - Sistema completo de gestão de ocorrências  
🔄 **Segunda Via de Boletos** - Em desenvolvimento  
🔄 **Advertências e Multas** - Em desenvolvimento  
🔄 **Gestão de Manutenção** - Em desenvolvimento  

## 🛠️ Stack Tecnológica

### Backend
- **Node.js** 18+ com **TypeScript**
- **NestJS** - Framework robusto e escalável
- **Prisma ORM** - ORM type-safe para PostgreSQL
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação stateless
- **Swagger** - Documentação automática da API

### Frontend
- **Next.js** 14 - Framework React com SSR
- **React** 18+ com TypeScript
- **Tailwind CSS** - Framework CSS utility-first
- **React Hook Form** - Gerenciamento de formulários
- **React Query** - Cache e sincronização de dados
- **React Icons** - Biblioteca de ícones

### DevOps
- **Docker** - Containerização
- **Jest** - Testes unitários e integração
- **ESLint + Prettier** - Qualidade de código

## 🚀 Instalação e Configuração

### Pré-requisitos

```bash
# Versões necessárias
Node.js >= 18.0.0
PostgreSQL >= 15.0
npm >= 9.0.0
```

### 1. Clone o Repositório

```bash
git clone https://github.com/sindico-online/sindico-online.git
cd sindico-online
```

### 2. Instale as Dependências

```bash
# Instalar dependências do projeto principal
npm install

# Instalar dependências do backend
cd apps/backend
npm install

# Instalar dependências do frontend
cd ../frontend
npm install
cd ../..
```

### 3. Configuração do Banco de Dados

```bash
# Criar banco PostgreSQL
createdb sindico_online

# Configurar variáveis de ambiente do backend
cp apps/backend/.env.example apps/backend/.env
```

#### Configurar `apps/backend/.env`:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/sindico_online?schema=public"

# JWT
JWT_SECRET="sua-chave-secreta-super-segura-aqui"
JWT_EXPIRES_IN="7d"

# App
PORT=3001
NODE_ENV=development

# Frontend URL (CORS)
FRONTEND_URL="http://localhost:3000"
```

### 4. Executar Migrations

```bash
cd apps/backend
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Configurar Frontend

```bash
# Configurar variáveis de ambiente do frontend
cp apps/frontend/.env.local.example apps/frontend/.env.local
```

#### Configurar `apps/frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🎮 Executando o Sistema

### Desenvolvimento (Modo Watch)

```bash
# Executar backend e frontend simultaneamente
npm run dev

# OU executar separadamente:

# Backend (porta 3001)
npm run dev:backend

# Frontend (porta 3000)
npm run dev:frontend
```

### Acessar o Sistema

- 🌐 **Frontend**: [http://localhost:3000](http://localhost:3000)
- 📚 **API Docs**: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)
- 🔍 **Prisma Studio**: `cd apps/backend && npx prisma studio`

### Produção

```bash
# Build do projeto
npm run build

# Executar em produção
npm start
```

## 📖 Documentação da API

### Endpoints Principais de Ocorrências

#### `POST /api/occurrences`
Criar nova ocorrência

```json
{
  "title": "Problema no elevador",
  "description": "Elevador fazendo ruídos estranhos",
  "type": "ELEVADOR",
  "priority": "ALTA",
  "location": "Bloco A"
}
```

#### `GET /api/occurrences`
Listar ocorrências com filtros

**Query Parameters:**
- `page` - Página (default: 1)
- `limit` - Itens por página (default: 10, max: 100)
- `status` - Filtrar por status
- `type` - Filtrar por tipo
- `priority` - Filtrar por prioridade
- `search` - Buscar em título/descrição

#### `GET /api/occurrences/:id`
Buscar ocorrência específica

#### `PATCH /api/occurrences/:id`
Atualizar ocorrência

#### `DELETE /api/occurrences/:id`
Remover ocorrência

#### `GET /api/occurrences/statistics`
Estatísticas das ocorrências

### Tipos e Enums

```typescript
enum OccurrenceStatus {
  ABERTA = "ABERTA"
  EM_ANDAMENTO = "EM_ANDAMENTO"
  RESOLVIDA = "RESOLVIDA"
  CANCELADA = "CANCELADA"
}

enum OccurrencePriority {
  BAIXA = "BAIXA"
  MEDIA = "MEDIA"
  ALTA = "ALTA"
  URGENTE = "URGENTE"
}

enum OccurrenceType {
  MANUTENCAO = "MANUTENCAO"
  SEGURANCA = "SEGURANCA"
  RUIDO = "RUIDO"
  LIMPEZA = "LIMPEZA"
  ELEVADOR = "ELEVADOR"
  PORTARIA = "PORTARIA"
  VAGA_GARAGEM = "VAGA_GARAGEM"
  OBRA_REFORMA = "OBRA_REFORMA"
  ANIMAL = "ANIMAL"
  OUTROS = "OUTROS"
}
```

## 📱 Funcionalidades do Frontend

### Design Responsivo

O sistema foi desenvolvido com **mobile-first approach**, garantindo funcionamento perfeito em:

- 📱 **Mobile** (320px+) - Interface touch-friendly
- 📟 **Tablet** (768px+) - Layout adaptado
- 💻 **Desktop** (1024px+) - Interface completa

### Características da Interface

- **Cores da Paraíba**: Vermelho #FF0000 e preto #000000
- **Tipografia**: Inter (Google Fonts)
- **Ícones**: Feather Icons via React Icons
- **Animações**: Transições suaves e micro-interações
- **Acessibilidade**: Suporte a leitores de tela

### Páginas Implementadas

1. **Dashboard** (`/`) - Visão geral com estatísticas
2. **Lista de Ocorrências** (`/ocorrencias`) - Listagem completa
3. **Detalhes da Ocorrência** (`/ocorrencias/[id]`) - Visualização completa

## 🧪 Testes

```bash
# Executar testes do backend
cd apps/backend
npm test

# Executar testes do frontend
cd apps/frontend
npm test

# Executar testes com coverage
npm run test:cov
```

## 🗃️ Estrutura do Banco de Dados

### Tabelas Principais

#### `users` - Usuários do sistema
- Suporte a diferentes tipos de usuário (ADMIN, SINDICO, MORADOR, etc.)
- Relacionamento com condomínio

#### `condominiums` - Condomínios
- Dados básicos e endereço
- CNPJ único para identificação

#### `occurrences` - Ocorrências
- Protocolo único gerado automaticamente (OC-YYYYMMDD-XXXX)
- Status, tipo, prioridade
- Relacionamentos com usuário criador e responsável

#### `occurrence_attachments` - Anexos
- Upload de arquivos (imagens, documentos)
- Metadata completo dos arquivos

#### `occurrence_status_history` - Histórico
- Auditoria completa de mudanças de status
- Comentários e responsáveis pelas alterações

## 🔒 Segurança

### Implementações de Segurança

- **JWT Authentication** - Tokens com expiração configurável
- **Validação de Dados** - Class-validator em todos os DTOs
- **CORS Configurado** - Apenas origens autorizadas
- **Sanitização** - Prevenção contra XSS e SQL Injection
- **Rate Limiting** - Proteção contra ataques DDoS

### Recomendações para Produção

```bash
# Variáveis de ambiente obrigatórias
DATABASE_URL=""
JWT_SECRET=""  # Mínimo 32 caracteres
NODE_ENV="production"
```

## 🚢 Deploy

### Docker

```bash
# Build das imagens
docker-compose build

# Executar em produção
docker-compose up -d
```

### Variáveis de Ambiente para Produção

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/sindico_online_prod"

# Security
JWT_SECRET="sua-chave-ultra-secreta-com-32-caracteres+"
NODE_ENV="production"

# CORS
FRONTEND_URL="https://sindicoonline.com"

# Opcional: Monitoring
SENTRY_DSN=""
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📞 Suporte

- 📧 **Email**: suporte@sindicoonline.com
- 💬 **Discord**: [Comunidade Síndico Online](https://discord.gg/sindicoonline)
- 📖 **Documentação**: [docs.sindicoonline.com](https://docs.sindicoonline.com)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido com ❤️ pela equipe Síndico Online**  
*Sistema de gestão para condomínios - Paraíba, Brasil* 🇧🇷

