#!/bin/bash

echo "🏢 Síndico Online - Iniciando o sistema..."

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências principais..."
    npm install
fi

if [ ! -d "apps/backend/node_modules" ]; then
    echo "📦 Instalando dependências do backend..."
    cd apps/backend && npm install && cd ../..
fi

if [ ! -d "apps/frontend/node_modules" ]; then
    echo "📦 Instalando dependências do frontend..."
    cd apps/frontend && npm install && cd ../..
fi

# Verificar se o banco está configurado
if [ ! -f "apps/backend/.env" ]; then
    echo "⚠️  Arquivo .env não encontrado no backend!"
    echo "Configure o arquivo apps/backend/.env com suas credenciais do PostgreSQL"
    exit 1
fi

echo "🚀 Iniciando backend e frontend..."
echo "📚 Backend: http://localhost:3001/api/docs"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "Pressione Ctrl+C para parar"

# Executar backend e frontend simultaneamente
npm run dev