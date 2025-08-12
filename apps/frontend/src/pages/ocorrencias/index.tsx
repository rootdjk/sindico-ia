import { useState } from 'react';
import { NextPage } from 'next';
import Layout from '@/components/Layout/Layout';
import { FiPlus, FiSearch, FiFilter, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';

// Tipos para as ocorrências
interface Occurrence {
  id: string;
  protocol: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  status: string;
  location?: string;
  createdAt: string;
  createdBy: {
    name: string;
    apartment?: string;
  };
}

// Dados demo (em produção viria da API)
const demoOccurrences: Occurrence[] = [
  {
    id: '1',
    protocol: 'OC-20231201-0001',
    title: 'Problema no elevador',
    description: 'Elevador fazendo ruídos estranhos e parando entre andares',
    type: 'ELEVADOR',
    priority: 'ALTA',
    status: 'ABERTA',
    location: 'Bloco A',
    createdAt: '2023-12-01T10:30:00Z',
    createdBy: {
      name: 'Maria Santos',
      apartment: '301',
    },
  },
  {
    id: '2',
    protocol: 'OC-20231201-0002',
    title: 'Vazamento na garagem',
    description: 'Há um vazamento de água na garagem que está causando poças',
    type: 'MANUTENCAO',
    priority: 'MEDIA',
    status: 'EM_ANDAMENTO',
    location: 'Subsolo - Garagem',
    createdAt: '2023-12-01T14:15:00Z',
    createdBy: {
      name: 'Carlos Oliveira',
      apartment: '205',
    },
  },
  {
    id: '3',
    protocol: 'OC-20231130-0003',
    title: 'Ruído excessivo',
    description: 'Vizinho fazendo muito barulho durante a madrugada',
    type: 'RUIDO',
    priority: 'BAIXA',
    status: 'RESOLVIDA',
    location: 'Bloco B - 402',
    createdAt: '2023-11-30T22:45:00Z',
    createdBy: {
      name: 'Ana Costa',
      apartment: '401',
    },
  },
];

const statusConfig = {
  ABERTA: { label: 'Aberta', color: 'badge-danger' },
  EM_ANDAMENTO: { label: 'Em Andamento', color: 'badge-warning' },
  RESOLVIDA: { label: 'Resolvida', color: 'badge-success' },
  CANCELADA: { label: 'Cancelada', color: 'badge-info' },
};

const priorityConfig = {
  BAIXA: { label: 'Baixa', color: 'text-green-600' },
  MEDIA: { label: 'Média', color: 'text-yellow-600' },
  ALTA: { label: 'Alta', color: 'text-red-600' },
  URGENTE: { label: 'Urgente', color: 'text-red-800 font-bold' },
};

const typeConfig = {
  ELEVADOR: 'Elevador',
  MANUTENCAO: 'Manutenção',
  RUIDO: 'Ruído',
  SEGURANCA: 'Segurança',
  LIMPEZA: 'Limpeza',
  PORTARIA: 'Portaria',
  VAGA_GARAGEM: 'Vaga Garagem',
  OBRA_REFORMA: 'Obra/Reforma',
  ANIMAL: 'Animal',
  OUTROS: 'Outros',
};

const OccurrencesPage: NextPage = () => {
  const [occurrences] = useState<Occurrence[]>(demoOccurrences);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filtrar ocorrências
  const filteredOccurrences = occurrences.filter((occurrence) => {
    const matchesSearch = 
      occurrence.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      occurrence.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      occurrence.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || occurrence.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Layout title="Ocorrências">
      <div className="space-y-6">
        {/* Header com ações */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por protocolo, título ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10 w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Filtro por Status */}
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-input pl-10 pr-8 min-w-[150px]"
              >
                <option value="">Todos os Status</option>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Botão Nova Ocorrência */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              <FiPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Nova Ocorrência</span>
              <span className="sm:hidden">Nova</span>
            </button>
          </div>
        </div>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(statusConfig).map(([status, config]) => {
            const count = occurrences.filter(o => o.status === status).length;
            return (
              <div key={status} className="card text-center">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className={`text-sm ${config.color.replace('badge-', 'text-')}`}>
                  {config.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Lista de Ocorrências */}
        <div className="space-y-4">
          {filteredOccurrences.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-gray-400 mb-4">
                <FiSearch className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma ocorrência encontrada
              </h3>
              <p className="text-gray-500 mb-6">
                Tente ajustar os filtros ou criar uma nova ocorrência.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                Criar Primera Ocorrência
              </button>
            </div>
          ) : (
            filteredOccurrences.map((occurrence) => (
              <div key={occurrence.id} className="card hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Informações principais */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {occurrence.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-500 font-mono">
                          {occurrence.protocol}
                        </span>
                        <span className={`badge ${statusConfig[occurrence.status as keyof typeof statusConfig].color}`}>
                          {statusConfig[occurrence.status as keyof typeof statusConfig].label}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {occurrence.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-500">
                      <div>
                        <span className="font-medium">Tipo:</span>{' '}
                        {typeConfig[occurrence.type as keyof typeof typeConfig]}
                      </div>
                      <div>
                        <span className="font-medium">Prioridade:</span>{' '}
                        <span className={priorityConfig[occurrence.priority as keyof typeof priorityConfig].color}>
                          {priorityConfig[occurrence.priority as keyof typeof priorityConfig].label}
                        </span>
                      </div>
                      {occurrence.location && (
                        <div>
                          <span className="font-medium">Local:</span> {occurrence.location}
                        </div>
                      )}
                    </div>

                    <div className="mt-3 text-sm text-gray-500">
                      Criado por <span className="font-medium">{occurrence.createdBy.name}</span>
                      {occurrence.createdBy.apartment && (
                        <span> (Apto {occurrence.createdBy.apartment})</span>
                      )}
                      {' '} em {formatDate(occurrence.createdAt)}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2 lg:flex-col lg:items-stretch lg:w-32">
                    <button className="btn-secondary flex items-center justify-center gap-2 flex-1 lg:flex-none">
                      <FiEye className="w-4 h-4" />
                      <span className="lg:hidden">Ver</span>
                    </button>
                    <button className="btn-outline flex items-center justify-center gap-2 flex-1 lg:flex-none">
                      <FiEdit className="w-4 h-4" />
                      <span className="lg:hidden">Editar</span>
                    </button>
                    <button className="text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors duration-200 lg:self-center">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Paginação (simplificada para demo) */}
        {filteredOccurrences.length > 0 && (
          <div className="flex justify-center">
            <nav className="flex items-center gap-2">
              <button className="btn-secondary">Anterior</button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Página 1 de 1
              </span>
              <button className="btn-secondary">Próxima</button>
            </nav>
          </div>
        )}
      </div>

      {/* Modal para criar nova ocorrência - placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto slide-up">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Nova Ocorrência
              </h2>
              <p className="text-gray-600 mb-6">
                Modal para criar nova ocorrência será implementado na próxima etapa.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button className="btn-primary">
                  Criar Ocorrência
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default OccurrencesPage;