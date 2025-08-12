import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  FiBell, 
  FiMenu, 
  FiX, 
  FiHome, 
  FiClipboard, 
  FiUser,
  FiSettings,
  FiLogOut
} from 'react-icons/fi';

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    apartment?: string;
    role: string;
  };
}

export default function Header({ user }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/',
      icon: FiHome,
      active: router.pathname === '/',
    },
    {
      label: 'Ocorrências',
      href: '/ocorrencias',
      icon: FiClipboard,
      active: router.pathname.startsWith('/ocorrencias'),
    },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Nome do Sistema */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">SO</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">Síndico Online</h1>
                <p className="text-xs text-gray-500">Gestão de Condomínios</p>
              </div>
            </Link>
          </div>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    item.active
                      ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-500'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Ações do Usuário */}
          <div className="flex items-center space-x-4">
            {/* Notificações */}
            <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <FiBell className="w-5 h-5" />
              {/* Badge de notificação */}
              <span className="absolute top-0 right-0 w-2 h-2 bg-primary-500 rounded-full"></span>
            </button>

            {/* Informações do Usuário - Desktop */}
            {user && (
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">
                    {user.apartment ? `Apto ${user.apartment}` : user.role}
                  </p>
                </div>
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
              </div>
            )}

            {/* Menu Mobile Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4 slide-up">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 text-base font-medium transition-colors duration-200 ${
                      item.active
                        ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-500'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Informações do Usuário - Mobile */}
            {user && (
              <div className="mt-6 pt-6 border-t border-gray-200 px-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-base font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    {user.apartment && (
                      <p className="text-xs text-gray-400">Apartamento {user.apartment}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <button className="flex items-center space-x-3 w-full px-3 py-2 text-left text-gray-600 hover:bg-gray-50 rounded-md transition-colors duration-200">
                    <FiUser className="w-4 h-4" />
                    <span className="text-sm">Meu Perfil</span>
                  </button>
                  <button className="flex items-center space-x-3 w-full px-3 py-2 text-left text-gray-600 hover:bg-gray-50 rounded-md transition-colors duration-200">
                    <FiSettings className="w-4 h-4" />
                    <span className="text-sm">Configurações</span>
                  </button>
                  <button className="flex items-center space-x-3 w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200">
                    <FiLogOut className="w-4 h-4" />
                    <span className="text-sm">Sair</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}