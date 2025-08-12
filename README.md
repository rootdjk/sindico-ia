# SINDICO IA - Agente em Background

Este é um agente em background para o sistema SINDICO IA, desenvolvido com as cores do Paraíba (vermelho e preto).

## 🚀 Como usar

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto com:
```
PORT=3001
NODE_ENV=development
```

### 3. Iniciar o agente
```bash
# Modo desenvolvimento (com auto-reload)
npm run dev

# Modo produção
npm start
```

## 📋 Funcionalidades

### Tarefas em Background
- **Verificar processos pendentes**: Executa a cada 5 minutos
- **Atualizar dados do sistema**: Executa a cada hora
- **Limpar logs antigos**: Executa diariamente às 2h da manhã

### API Endpoints
- `GET /` - Status do agente
- `GET /health` - Verificação de saúde
- `GET /tasks` - Lista de tarefas disponíveis
- `POST /execute-task/:taskName` - Executar tarefa manualmente

## 🎨 Cores do Paraíba
- **Primária**: #FF0000 (Vermelho)
- **Secundária**: #000000 (Preto)
- **Destaque**: #CC0000 (Vermelho escuro)

## 🔧 Configuração do Git

Para configurar o Git no Windows:

1. **Baixar o Git**: Acesse https://git-scm.com/download/win
2. **Instalar**: Execute o instalador como administrador
3. **Configurar**: Após a instalação, abra o PowerShell e execute:
   ```bash
   git config --global user.name "Seu Nome"
   git config --global user.email "seu.email@exemplo.com"
   ```

4. **Inicializar o repositório**:
   ```bash
   git init
   git add .
   git commit -m "Primeiro commit - Agente SINDICO IA"
   ```

## 📁 Estrutura do Projeto
```
SINDICO IA/
├── src/
│   └── index.js          # Arquivo principal do agente
├── package.json          # Dependências e scripts
├── .env                  # Variáveis de ambiente
└── README.md            # Este arquivo
```

## 🛠️ Desenvolvimento

Para adicionar novas tarefas em background, edite o objeto `backgroundTasks` no arquivo `src/index.js`.

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.
