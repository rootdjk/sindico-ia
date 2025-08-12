import { NextPage } from 'next';
import Link from 'next/link';
import Layout from '@/components/Layout/Layout';
import { 
  FiClipboard, 
  FiFileText, 
  FiAlertTriangle, 
  FiTool,
  FiTrendingUp,
  FiClock,
  FiUsers,
  FiCheckCircle
} from 'react-icons/fi';

const HomePage: NextPage = () => {
  // Dados demo para o dashboard
  const stats = {
    totalOccurrences: 45,
    openOccurrences: 12,
    inProgressOccurrences: 8,
    resolvedOccurrences: 25,
  };

  const quickActions = [
    {
      title: 'Registrar Ocorrência',
      description: 'Criar nova ocorrência no sistema',
      icon: FiClipboard,
      href: '/ocorrencias',
      color: 'bg-primary-500',
      urgent: true,
    },
    {
      title: 'Segunda Via de Boletos',
      description: 'Emitir segunda via de boletos',
      icon: FiFileText,
      href: '/boletos',
      color: 'bg-blue-500',
      urgent: false,
    },
    {
      title: 'Advertências e Multas',
      description: 'Gerenciar advertências e multas',
      icon: FiAlertTriangle,
      href: '/advertencias',
      color: 'bg-yellow-500',
      urgent: false,
    },
    {
      title: 'Gestão de Manutenção',
      description: 'Agendar e acompanhar manutenções',
      icon: FiTool,
      href: '/manutencao',
      color: 'bg-green-500',
      urgent: false,
    },
  ];

  const recentOccurrences = [
    {
      id: '1',
      protocol: 'OC-20231201-0001',
      title: 'Problema no elevador',
      status: 'ABERTA',
      createdAt: '2023-12-01T10:30:00Z',
      priority: 'ALTA',
    },
    {
      id: '2',
      protocol: 'OC-20231201-0002',
      title: 'Vazamento na garagem',
      status: 'EM_ANDAMENTO',
      createdAt: '2023-12-01T14:15:00Z',
      priority: 'MEDIA',
    },
    {
      id: '3',
      protocol: 'OC-20231130-0003',
      title: 'Ruído excessivo',
      status: 'RESOLVIDA',
      createdAt: '2023-11-30T22:45:00Z',
      priority: 'BAIXA',
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      ABERTA: 'badge-danger',
      EM_ANDAMENTO: 'badge-warning',
      RESOLVIDA: 'badge-success',
      CANCELADA: 'badge-info',
    };
    return configs[status as keyof typeof configs] || 'badge-info';
  };

  const getPriorityColor = (priority: string) => {
    const configs = {
      BAIXA: 'text-green-600',
      MEDIA: 'text-yellow-600',
      ALTA: 'text-red-600',
      URGENTE: 'text-red-800',
    };
    return configs[priority as keyof typeof configs] || 'text-gray-600';
  };

  return (
    <Layout title="Dashboard">
      <div className="space-y-8">
        {/* Saudação e informações principais */}
        <div className="card bg-gradient-primary text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Bem-vindo ao Síndico Online! 👋
              </h2>
              <p className="text-primary-100 mb-4 md:mb-0">
                Gerencie seu condomínio de forma eficiente e organizada.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalOccurrences}</div>
                <div className="text-sm text-primary-100">Total de Ocorrências</div>
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <FiClipboard className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.openOccurrences}
                </div>
                <div className="text-sm text-gray-500">Abertas</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiClock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.inProgressOccurrences}
                </div>
                <div className="text-sm text-gray-500">Em Andamento</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.resolvedOccurrences}
                </div>
                <div className="text-sm text-gray-500">Resolvidas</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiTrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round((stats.resolvedOccurrences / stats.totalOccurrences) * 100)}%
                </div>
                <div className="text-sm text-gray-500">Taxa Resolução</div>
              </div>
            </div>
          </div>
        </div>

        {/* Ações rápidas */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="card hover:shadow-lg transition-all duration-200 group relative overflow-hidden"
                >
                  {action.urgent && (
                    <div className="absolute top-2 right-2">
                      <span className="badge-danger text-xs">Prioritário</span>
                    </div>
                  )}
                  
                  <div className="flex flex-col items-center text-center p-2">
                    <div className={`p-4 rounded-lg ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mt-4 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                      {action.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {action.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Ocorrências recentes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Ocorrências Recentes</h3>
            <Link
              href="/ocorrencias"
              className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors duration-200"
            >
              Ver todas →
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentOccurrences.map((occurrence) => (
              <div key={occurrence.id} className="card hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {occurrence.title}
                      </h4>
                      <span className="text-sm text-gray-500 font-mono">
                        {occurrence.protocol}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        <span className="font-medium">Prioridade:</span>
                        <span className={`ml-1 ${getPriorityColor(occurrence.priority)}`}>
                          {occurrence.priority}
                        </span>
                      </span>
                      <span>
                        Criado em {formatDate(occurrence.createdAt)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`badge ${getStatusBadge(occurrence.status)}`}>
                      {occurrence.status.replace('_', ' ')}
                    </span>
                    <Link
                      href={`/ocorrencias/${occurrence.id}`}
                      className="btn-outline px-3 py-1 text-sm"
                    >
                      Ver
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dicas do sistema */}
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <FiUsers className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                💡 Dica do Sistema
              </h4>
              <p className="text-blue-800 text-sm">
                Para uma gestão mais eficiente, registre ocorrências assim que identificar problemas. 
                Isso permite um acompanhamento melhor e resolução mais rápida dos problemas do condomínio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;