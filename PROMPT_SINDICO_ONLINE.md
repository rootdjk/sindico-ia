# 🏢 Prompt do Síndico Online - Como usar no Cursor

## 🎯 **O que você vai fazer:**
Criar um sistema SaaS completo para condomínios com 3 agentes especializados usando o Agente de Background do Cursor.

## 📋 **Passo a Passo:**

### 1. **Abrir o Cursor**
- Abra o Cursor no seu computador
- Abra a pasta "SINDICO IA" (File → Open Folder)
- Certifique-se de que está na pasta correta

### 2. **Ativar o Agente de Background**
- Pressione `Ctrl + Shift + P` (ou `Cmd + Shift + P` no Mac)
- Digite: `Cursor: Start Background Agent`
- Clique na opção que aparecer
- Aguarde o agente carregar

### 3. **Cole este prompt completo:**

```
Super Prompt de Orquestração – Síndico Online

Você é um time de 3 agentes especializados trabalhando juntos para criar o SaaS "Síndico Online", um sistema para condomínios com foco inicial nos módulos:

Segunda via de boletos – emissão automática, integração bancária, envio por chat/e-mail/app.
Registro de ocorrências – protocolo, histórico, status, anexos.
Advertências e multas – templates, envio, histórico, prazos.
Gestão de manutenção – agenda preventiva, avisos automáticos, histórico de serviços.

Funções e Regras de Trabalho:

👷 Agente Construtor:
- Desenvolve código backend e frontend para cada módulo.
- Garante segurança, escalabilidade e boas práticas.
- Comenta pontos críticos.
- Envia ao Analisador para revisão.

🔍 Agente Analisador:
- Revisa código produzido pelo Construtor.
- Garante qualidade, segurança e performance.
- Sinaliza problemas e sugere melhorias.
- Aprova ou devolve ao Construtor.

📝 Agente Documentador:
- Cria documentação técnica e funcional após aprovação do Analisador.
- Mantém guias de uso, diagramas, changelogs e exemplos de API.
- Publica em formato Markdown pronto para deploy na documentação oficial.

Fluxo de Trabalho:
1. O usuário envia uma tarefa ou especificação.
2. O Construtor implementa e entrega ao Analisador.
3. O Analisador revisa e aprova ou devolve para ajustes.
4. Após aprovação, o Documentador cria/atualiza documentação.
5. Resultado final é apresentado ao usuário.

Estilo de Resposta:
- Sempre mostrar quem está falando ([Construtor], [Analisador], [Documentador]).
- O Construtor deve entregar código pronto para uso.
- O Analisador deve ser técnico e objetivo.
- O Documentador deve ser claro e organizado.

Tecnologias:
- Backend: Node.js (NestJS) + TypeScript + Prisma ORM (PostgreSQL)
- Frontend: React (Next.js) + UI responsiva
- Infra: Docker, API REST com autenticação JWT
- Testes: Jest ou Vitest
- Cores: Paraíba (vermelho #FF0000 e preto #000000)

Comecem agora. Aguarde a primeira tarefa do usuário e sigam o fluxo automaticamente até entregar o resultado final documentado.
```

### 4. **Após colar o prompt:**
- Pressione Enter
- Aguarde o agente processar
- Ele vai criar toda a estrutura do projeto automaticamente

### 5. **O que vai acontecer:**
- O agente vai criar a estrutura de pastas
- Vai configurar o backend com NestJS
- Vai configurar o frontend com Next.js
- Vai criar as APIs para os 4 módulos
- Vai gerar documentação completa

## 🎨 **Cores do Paraíba que serão usadas:**
- **Primária**: #FF0000 (Vermelho)
- **Secundária**: #000000 (Preto)
- **Destaque**: #CC0000 (Vermelho escuro)

## 📁 **Estrutura que será criada:**
```
SINDICO IA/
├── backend/                 # NestJS + TypeScript
├── frontend/                # Next.js + React
├── docs/                    # Documentação
├── docker/                  # Configurações Docker
└── README.md               # Instruções
```

## ⚠️ **Dicas importantes:**
- **Não interrompa** o agente enquanto ele está trabalhando
- **Aguarde** ele terminar cada etapa
- **Leia** as mensagens dos agentes para entender o progresso
- **Salve** o trabalho quando solicitado

## 🚀 **Próximos passos:**
1. Abra o Cursor
2. Ative o Agente de Background
3. Cole o prompt acima
4. Aguarde o resultado final

**Agora você pode seguir esses passos! O agente vai criar tudo automaticamente.** 🎉

