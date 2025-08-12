import { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  user?: {
    name: string;
    email: string;
    apartment?: string;
    role: string;
  };
}

export default function Layout({ children, title, user }: LayoutProps) {
  // Dados demo do usuário (em produção viria do contexto de autenticação)
  const demoUser = user || {
    name: 'João Silva',
    email: 'joao@email.com',
    apartment: '101',
    role: 'MORADOR',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={demoUser} />
      
      <main className="container-custom py-6">
        {title && (
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-shadow">
              {title}
            </h1>
          </div>
        )}
        
        <div className="fade-in">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container-custom py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="text-sm text-gray-500 mb-4 sm:mb-0">
              © 2023 Síndico Online. Todos os direitos reservados.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-primary-600 transition-colors duration-200">
                Suporte
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors duration-200">
                Documentação
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors duration-200">
                Política de Privacidade
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}