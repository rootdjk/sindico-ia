# 🌱 Guia do Iniciante - Síndico Online

## 👋 Bem-vindo!

Este guia foi criado especialmente para **iniciantes em programação** que querem aprender a usar e entender o sistema Síndico Online. Vamos explicar tudo passo a passo, de forma simples e didática.

## 🤔 O que é o Síndico Online?

O **Síndico Online** é um sistema de computador (software) que ajuda a gerenciar condomínios. Pense nele como um "caderno digital" onde você pode:

- 📝 **Registrar problemas** (como elevador quebrado)
- 👀 **Acompanhar soluções** (ver se o problema foi resolvido)
- 📊 **Ter relatórios** (quantos problemas aconteceram no mês)

## 🛠️ O que você vai precisar no seu computador

Antes de começar, você precisa instalar alguns programas no seu computador:

### 1. **Node.js** - O "motor" do sistema
- 🌐 **Site**: https://nodejs.org
- 💡 **O que faz**: Permite executar programas JavaScript no seu computador
- 📥 **Como instalar**: Baixe a versão "LTS" (recomendada) e execute o instalador

### 2. **PostgreSQL** - O "banco de dados"
- 🌐 **Site**: https://postgresql.org
- 💡 **O que faz**: Guarda todas as informações (ocorrências, usuários, etc.)
- 📥 **Como instalar**: Baixe e instale. **Lembre-se da senha** que você criar!

### 3. **Git** - Para baixar o código
- 🌐 **Site**: https://git-scm.com
- 💡 **O que faz**: Permite baixar e gerenciar o código do projeto
- 📥 **Como instalar**: Baixe e instale (use as configurações padrão)

### 4. **Editor de Código** (recomendado)
- 🌐 **VS Code**: https://code.visualstudio.com
- 💡 **O que faz**: Editor para visualizar e modificar código
- 📥 **Como instalar**: Baixe e instale normalmente

## 📥 Como baixar e instalar o sistema

### Passo 1: Abrir o Terminal
- **Windows**: Pressione `Win + R`, digite `cmd` e pressione Enter
- **Mac**: Pressione `Cmd + Espaço`, digite `terminal` e pressione Enter

### Passo 2: Baixar o projeto
Digite o comando abaixo no terminal e pressione Enter:
```bash
git clone https://github.com/sindico-online/sindico-online.git
```

### Passo 3: Entrar na pasta do projeto
```bash
cd sindico-online
```

### Passo 4: Instalar as dependências
Este comando vai baixar todas as bibliotecas necessárias:
```bash
npm install
```

> ⏰ **Atenção**: Este processo pode demorar alguns minutos, é normal!

## 🔧 Configuração inicial

### Passo 1: Configurar o banco de dados

#### 1.1 Criar o banco de dados
Abra o terminal e digite:
```bash
createdb sindico_online
```

> ❓ **Dica**: Se der erro, o PostgreSQL pode não estar configurado no PATH. Procure no menu iniciar por "SQL Shell (psql)" e use: `CREATE DATABASE sindico_online;`

#### 1.2 Configurar as variáveis de ambiente
1. Navegue até a pasta `apps/backend`
2. Copie o arquivo `.env.example` e renomeie para `.env`
3. Abra o arquivo `.env` no seu editor de código
4. Modifique a linha do `DATABASE_URL` colocando sua senha do PostgreSQL:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA_AQUI@localhost:5432/sindico_online?schema=public"
```

### Passo 2: Criar as tabelas do banco
```bash
cd apps/backend
npx prisma migrate dev --name init
```

## 🚀 Como executar o sistema

### Executar tudo de uma vez (mais fácil)
Na pasta raiz do projeto, digite:
```bash
npm run dev
```

### OU executar separadamente

#### Terminal 1 - Backend (servidor):
```bash
cd apps/backend
npm run start:dev
```

#### Terminal 2 - Frontend (interface):
```bash
cd apps/frontend
npm run dev
```

## 🌐 Como acessar o sistema

Após executar os comandos acima, abra seu navegador e acesse:

- 🖥️ **Sistema principal**: http://localhost:3000
- 📚 **Documentação da API**: http://localhost:3001/api/docs

## 🧭 Navegando pelo sistema

### Dashboard (Página Inicial)
- Aqui você vê um resumo geral
- Estatísticas de ocorrências
- Ações rápidas para criar nova ocorrência

### Página de Ocorrências
- Lista todas as ocorrências do condomínio
- Você pode filtrar por status (Aberta, Em Andamento, etc.)
- Buscar por palavras-chave
- Criar nova ocorrência

### Como criar uma ocorrência:
1. Clique no botão **"Nova Ocorrência"**
2. Preencha:
   - **Título**: Ex: "Elevador fazendo barulho"
   - **Descrição**: Explique o problema em detalhes
   - **Tipo**: Selecione a categoria (Elevador, Manutenção, etc.)
   - **Prioridade**: Baixa, Média, Alta ou Urgente
   - **Local**: Onde está o problema
3. Clique em **"Criar Ocorrência"**
4. O sistema vai gerar um protocolo automático (ex: OC-20231201-0001)

## 🎨 Entendendo as cores do sistema

O sistema usa as **cores oficiais da Paraíba**:
- 🔴 **Vermelho (#FF0000)**: Cor principal, botões importantes
- ⚫ **Preto (#000000)**: Textos e detalhes
- 🔘 **Cinza**: Backgrounds e elementos secundários

### Códigos de cores dos status:
- 🔴 **Vermelho**: Ocorrência Aberta (precisa atenção)
- 🟡 **Amarelo**: Em Andamento (sendo resolvida)
- 🟢 **Verde**: Resolvida (problema solucionado)
- 🔵 **Azul**: Cancelada

## 📱 O sistema é responsivo?

**Sim!** O sistema funciona perfeitamente em:
- 📱 **Celular** (Android/iPhone)
- 📟 **Tablet** (iPad, tablets Android)
- 💻 **Computador** (Windows, Mac, Linux)

A interface se adapta automaticamente ao tamanho da tela.

## ❌ Problemas comuns e soluções

### "Comando não encontrado"
**Problema**: Quando digita `npm` aparece erro
**Solução**: O Node.js não foi instalado corretamente. Reinstale e reinicie o computador.

### "Porta 3000 já está em uso"
**Problema**: Outra aplicação está usando a porta
**Solução**: Feche outros programas ou mude a porta:
```bash
PORT=3002 npm run dev
```

### "Não consegue conectar ao banco"
**Problema**: PostgreSQL não está rodando
**Solução**: 
1. Windows: Procure "Services" e inicie o serviço PostgreSQL
2. Mac: `brew services start postgresql`

### Páginas não carregam ou aparecem em branco
**Problema**: JavaScript pode estar desabilitado ou erro no código
**Solução**: 
1. Verifique se JavaScript está habilitado no navegador
2. Olhe o console do navegador (F12) para ver erros

## 📚 Conceitos importantes para entender

### O que é API?
- **API** = Interface de Programação de Aplicações
- É como o "garçom" entre o frontend (que você vê) e o banco de dados
- Exemplo: Quando você clica "criar ocorrência", a API recebe os dados e salva no banco

### Frontend vs Backend
- **Frontend**: A parte visual que você vê no navegador (HTML, CSS, JavaScript)
- **Backend**: A parte invisível que processa dados e regras de negócio (servidor)

### O que é um banco de dados?
- É como um "armário digital" super organizado
- Cada "gaveta" é uma tabela (usuários, ocorrências, etc.)
- Cada "pasta" é um registro (uma ocorrência específica)

### O que são "rotas"?
- São endereços dentro do sistema
- `/` = página inicial
- `/ocorrencias` = página de ocorrências
- `/api/occurrences` = endpoint da API para ocorrências

## 🎯 Próximos passos para aprender

### Nível Básico (você está aqui!)
- ✅ Usar o sistema
- ✅ Criar ocorrências
- ✅ Entender conceitos básicos

### Nível Intermediário
- 📖 Aprender HTML/CSS básico
- 📖 Entender estrutura de pastas
- 📖 Modificar cores e textos simples

### Nível Avançado
- 📖 Aprender JavaScript/TypeScript
- 📖 Entender React e Next.js
- 📖 Modificar funcionalidades

## 📖 Recursos para continuar aprendendo

### Cursos gratuitos recomendados:
- **freeCodeCamp**: https://freecodecamp.org
- **MDN Web Docs**: https://developer.mozilla.org
- **Codecademy**: https://codecademy.com

### Documentação oficial:
- **React**: https://react.dev
- **Next.js**: https://nextjs.org/docs
- **NestJS**: https://nestjs.com

### Canais do YouTube (em português):
- **Filipe Deschamps**
- **Rocketseat**
- **Cod3r Cursos**

## 🆘 Precisa de ajuda?

### Perguntas frequentes:
1. **"Não sei programar, posso usar mesmo assim?"**
   - Sim! Este guia foi feito para iniciantes totais.

2. **"Posso modificar o sistema?"**
   - Sim! O código é aberto. Comece com mudanças pequenas.

3. **"E se eu "quebrar" alguma coisa?"**
   - Sem problemas! Você pode sempre baixar o código novamente.

4. **"Preciso pagar alguma coisa?"**
   - Não! Tudo é gratuito e open-source.

### Como pedir ajuda:
1. 📧 **Email**: ajuda@sindicoonline.com
2. 🐛 **GitHub Issues**: Para reportar problemas
3. 💬 **Discord**: Para chat em tempo real

### Ao pedir ajuda, sempre inclua:
- Sistema operacional (Windows 10, macOS, etc.)
- Versão do Node.js (`node --version`)
- Mensagem de erro completa
- O que você estava tentando fazer

## ✨ Dica final

**Programação é como aprender um novo idioma**: no início parece difícil, mas com prática fica natural. Não desista nos primeiros obstáculos!

**Comece pequeno**: Tente primeiro usar o sistema, depois entender como funciona, depois fazer pequenas modificações.

**Seja paciente consigo mesmo**: Todo programador já foi iniciante um dia! 😊

---

**💙 Boa sorte na sua jornada de aprendizado!**

*Este guia foi criado com carinho para ajudar iniciantes a entrarem no mundo da programação através de um projeto real e útil.*