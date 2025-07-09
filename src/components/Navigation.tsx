import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsMenuOpen(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-3xl font-bold text-primary-600">
                ECommerce
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-gray-700 hover:text-primary-600 px-3 py-2 text-lg font-medium transition-colors ${
                isActive('/') ? 'text-primary-600' : ''
              }`}
            >
              Inicio
            </Link>
            <Link
              to="/products"
              className={`text-gray-700 hover:text-primary-600 px-3 py-2 text-lg font-medium transition-colors ${
                isActive('/products') ? 'text-primary-600' : ''
              }`}
            >
              Productos
            </Link>
            <Link
              to="/services"
              className={`text-gray-700 hover:text-primary-600 px-3 py-2 text-lg font-medium transition-colors ${
                isActive('/services') ? 'text-primary-600' : ''
              }`}
            >
              Servicios
            </Link>
            <Link
              to="/about"
              className={`text-gray-700 hover:text-primary-600 px-3 py-2 text-lg font-medium transition-colors ${
                isActive('/about') ? 'text-primary-600' : ''
              }`}
            >
              Nosotros
            </Link>
            <Link
              to="/blog"
              className={`text-gray-700 hover:text-primary-600 px-3 py-2 text-lg font-medium transition-colors ${
                isActive('/blog') ? 'text-primary-600' : ''
              }`}
            >
              Blog
            </Link>
            <Link
              to="/contact"
              className={`text-gray-700 hover:text-primary-600 px-3 py-2 text-lg font-medium transition-colors ${
                isActive('/contact') ? 'text-primary-600' : ''
              }`}
            >
              Contacto
            </Link>
            
            {isAuthenticated && (
              <Link
                to="/cart"
                className={`text-gray-700 hover:text-primary-600 px-3 py-2 text-lg font-medium transition-colors relative ${
                  isActive('/cart') ? 'text-primary-600' : ''
                }`}
              >
                Carrito
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
            
            {isAuthenticated && (
              <Link
                to="/admin/products"
                className={`text-gray-700 hover:text-primary-600 px-3 py-2 text-lg font-medium transition-colors ${
                  isActive('/admin/products') ? 'text-primary-600' : ''
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <span className="text-gray-400 hover:text-gray-600">✕</span>
                </button>
              )}
            </form>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 text-lg">
                  ¡Bienvenido, {user?.firstName}!
                </span>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 text-lg font-medium transition-colors"
                >
                  Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-lg font-medium transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 text-lg font-medium transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-lg font-medium transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {/* Mobile Search */}
            <div className="px-3 py-2">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <span className="text-gray-400 hover:text-gray-600">✕</span>
                  </button>
                )}
              </form>
            </div>
            <Link
              to="/"
              className={`block px-3 py-2 text-lg font-medium transition-colors ${
                isActive('/') ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              to="/products"
              className={`block px-3 py-2 text-lg font-medium transition-colors ${
                isActive('/products') ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Productos
            </Link>
            <Link
              to="/services"
              className={`block px-3 py-2 text-lg font-medium transition-colors ${
                isActive('/services') ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Servicios
            </Link>
            <Link
              to="/about"
              className={`block px-3 py-2 text-lg font-medium transition-colors ${
                isActive('/about') ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Nosotros
            </Link>
            <Link
              to="/blog"
              className={`block px-3 py-2 text-lg font-medium transition-colors ${
                isActive('/blog') ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/contact"
              className={`block px-3 py-2 text-lg font-medium transition-colors ${
                isActive('/contact') ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </Link>
            
            {isAuthenticated && (
              <Link
                to="/cart"
                className={`block px-3 py-2 text-lg font-medium transition-colors relative ${
                  isActive('/cart') ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Carrito
                {totalItems > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 inline-flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
            
            {isAuthenticated ? (
              <>
                <div className="px-3 py-2 text-base text-gray-500">
                  ¡Bienvenido, {user?.firstName}!
                </div>
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-lg font-medium text-gray-700 hover:text-primary-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-lg font-medium text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-lg font-medium text-gray-700 hover:text-primary-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-lg font-medium text-gray-700 hover:text-primary-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
