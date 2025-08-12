@echo off
echo 🏢 Síndico Online - Iniciando o sistema...

REM Verificar se as dependências estão instaladas
if not exist "node_modules" (
    echo 📦 Instalando dependências principais...
    npm install
)

if not exist "apps\backend\node_modules" (
    echo 📦 Instalando dependências do backend...
    cd apps\backend && npm install && cd ..\..
)

if not exist "apps\frontend\node_modules" (
    echo 📦 Instalando dependências do frontend...
    cd apps\frontend && npm install && cd ..\..
)

REM Verificar se o banco está configurado
if not exist "apps\backend\.env" (
    echo ⚠️  Arquivo .env não encontrado no backend!
    echo Configure o arquivo apps\backend\.env com suas credenciais do PostgreSQL
    pause
    exit /b 1
)

echo 🚀 Iniciando backend e frontend...
echo 📚 Backend: http://localhost:3001/api/docs
echo 🌐 Frontend: http://localhost:3000
echo.
echo Pressione Ctrl+C para parar

REM Executar backend e frontend simultaneamente
npm run dev