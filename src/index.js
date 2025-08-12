const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração das cores do Paraíba (vermelho e preto)
const colors = {
  primary: '#FF0000',    // Vermelho
  secondary: '#000000',  // Preto
  accent: '#CC0000'      // Vermelho escuro
};

// Tarefas em background
const backgroundTasks = {
  // Verificar processos pendentes
  checkPendingProcesses: () => {
    console.log('🔍 Verificando processos pendentes...');
    // Aqui você pode adicionar lógica para verificar processos
    const timestamp = new Date().toLocaleString('pt-BR');
    console.log(`✅ Processos verificados em: ${timestamp}`);
  },

  // Atualizar dados do sistema
  updateSystemData: () => {
    console.log('📊 Atualizando dados do sistema...');
    // Aqui você pode adicionar lógica para atualizar dados
    const timestamp = new Date().toLocaleString('pt-BR');
    console.log(`✅ Dados atualizados em: ${timestamp}`);
  },

  // Limpar logs antigos
  cleanOldLogs: () => {
    console.log('🧹 Limpando logs antigos...');
    // Aqui você pode adicionar lógica para limpar logs
    const timestamp = new Date().toLocaleString('pt-BR');
    console.log(`✅ Logs limpos em: ${timestamp}`);
  }
};

// Agendar tarefas em background
const scheduleBackgroundTasks = () => {
  // Verificar processos a cada 5 minutos
  cron.schedule('*/5 * * * *', () => {
    backgroundTasks.checkPendingProcesses();
  });

  // Atualizar dados a cada hora
  cron.schedule('0 * * * *', () => {
    backgroundTasks.updateSystemData();
  });

  // Limpar logs diariamente às 2h da manhã
  cron.schedule('0 2 * * *', () => {
    backgroundTasks.cleanOldLogs();
  });

  console.log('📅 Tarefas em background agendadas com sucesso!');
};

// Rotas da API
app.get('/', (req, res) => {
  res.json({
    message: 'SINDICO IA - Agente em Background',
    status: 'Ativo',
    timestamp: new Date().toISOString(),
    colors: colors
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/tasks', (req, res) => {
  res.json({
    tasks: Object.keys(backgroundTasks),
    scheduled: true,
    message: 'Tarefas em background configuradas'
  });
});

// Executar tarefa manualmente
app.post('/execute-task/:taskName', (req, res) => {
  const { taskName } = req.params;
  
  if (backgroundTasks[taskName]) {
    try {
      backgroundTasks[taskName]();
      res.json({
        success: true,
        message: `Tarefa ${taskName} executada com sucesso`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Erro ao executar tarefa ${taskName}`,
        error: error.message
      });
    }
  } else {
    res.status(404).json({
      success: false,
      message: `Tarefa ${taskName} não encontrada`
    });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`🚀 Agente SINDICO IA iniciado na porta ${PORT}`);
  console.log(`🎨 Cores do Paraíba configuradas: ${colors.primary}, ${colors.secondary}`);
  console.log(`📱 API disponível em: http://localhost:${PORT}`);
  
  // Agendar tarefas em background
  scheduleBackgroundTasks();
});

// Tratamento de erros
process.on('uncaughtException', (error) => {
  console.error('❌ Erro não capturado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise rejeitada não tratada:', reason);
});
