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

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link
      to={to}
      className={`relative px-4 py-2 text-lg font-medium rounded-xl transition-all duration-200 hover:bg-gray-800/10 ${
        isActive(to) 
          ? 'text-orange-500 bg-gray-800/5' 
          : 'text-gray-800 hover:text-orange-500'
      }`}
    >
      {children}
      {isActive(to) && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-orange-500 rounded-full"></div>
      )}
    </Link>
  );

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50 w-full max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-20 w-full gap-4">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="relative">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-black">
                  Damihvi
                </span>
                <div className="absolute -bottom-1 left-0 w-full h-1 bg-orange-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 flex-shrink-0">
            <NavLink to="/">Inicio</NavLink>
            <NavLink to="/products">Productos</NavLink>
            <NavLink to="/services">Servicios</NavLink>
            <NavLink to="/about">yo</NavLink>
            <NavLink to="/contact">Contacto</NavLink>
            
            {isAuthenticated && (
              <Link
                to="/cart"
                className={`relative px-4 py-2 text-lg font-medium rounded-xl transition-all duration-200 hover:bg-gray-800/10 ${
                  isActive('/cart') 
                    ? 'text-orange-500 bg-gray-800/5' 
                    : 'text-gray-800 hover:text-orange-500'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a2 2 0 002 2h8a2 2 0 002-2v-6" />
                  </svg>
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                      {totalItems}
                    </span>
                  )}
                </div>
                {isActive('/cart') && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-orange-500 rounded-full"></div>
                )}
              </Link>
            )}
          </div>

          {/* Search Bar - Now with more space */}
          <div className="hidden md:flex items-center flex-1 max-w-2xl mx-6">
            <form onSubmit={handleSearch} className="relative w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm placeholder-dark-400 transition-all duration-200"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-dark-400 hover:text-dark-600"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Auth Buttons - Now moved to the right */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3 py-2 text-dark-600 hover:text-primary-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.firstName?.charAt(0).toUpperCase() || 
                       user?.name?.charAt(0).toUpperCase() || 
                       user?.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="hidden xl:block">
                    <span className="font-medium text-sm">
                      {user?.firstName || user?.name?.split(' ')[0] || 'Usuario'}
                    </span>
                    {user?.role === 'admin' && (
                      <div className="text-xs text-purple-600 font-medium">Admin</div>
                    )}
                  </div>
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="px-3 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-200 font-medium text-sm"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gradient-to-r from-dark-500 to-dark-600 text-white rounded-xl hover:from-dark-600 hover:to-dark-700 transition-all duration-200 font-medium text-sm"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-dark-600 hover:text-primary-600 font-medium transition-colors text-sm"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-800 hover:text-orange-500 hover:bg-gray-100 transition-all duration-200 mr-2"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Mobile Auth Status */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                {/* Cart Icon with Counter */}
                <Link
                  to="/cart"
                  className="relative p-2 text-gray-800 hover:text-orange-500 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a2 2 0 002 2h8a2 2 0 002-2v-6" />
                  </svg>
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {totalItems}
                    </span>
                  )}
                </Link>

                {/* User Avatar */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center p-1 rounded-xl text-gray-800 hover:bg-gray-100 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.firstName?.charAt(0).toUpperCase() || 
                       user?.name?.charAt(0).toUpperCase() || 
                       user?.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-xl text-gray-800 hover:text-orange-500 hover:bg-gray-100 transition-all duration-200"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="px-4 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm placeholder-gray-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </form>

            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              <Link to="/" className={`block px-3 py-2 rounded-xl text-lg font-medium ${isActive('/') ? 'text-primary-600 bg-primary-50' : 'text-dark-600'}`} onClick={() => setIsMenuOpen(false)}>
                Inicio
              </Link>
              <Link to="/products" className={`block px-3 py-2 rounded-xl text-lg font-medium ${isActive('/products') ? 'text-primary-600 bg-primary-50' : 'text-dark-600'}`} onClick={() => setIsMenuOpen(false)}>
                Productos
              </Link>
              <Link to="/services" className={`block px-3 py-2 rounded-xl text-lg font-medium ${isActive('/services') ? 'text-primary-600 bg-primary-50' : 'text-dark-600'}`} onClick={() => setIsMenuOpen(false)}>
                Servicios
              </Link>
              <Link to="/about" className={`block px-3 py-2 rounded-xl text-lg font-medium ${isActive('/about') ? 'text-primary-600 bg-primary-50' : 'text-dark-600'}`} onClick={() => setIsMenuOpen(false)}>
                yo
              </Link>
              <Link to="/contact" className={`block px-3 py-2 rounded-xl text-lg font-medium ${isActive('/contact') ? 'text-primary-600 bg-primary-50' : 'text-dark-600'}`} onClick={() => setIsMenuOpen(false)}>
                Contacto
              </Link>

              {isAuthenticated && (
                <>
                  <Link to="/cart" className={`block px-3 py-2 rounded-xl text-lg font-medium ${isActive('/cart') ? 'text-primary-600 bg-primary-50' : 'text-dark-600'}`} onClick={() => setIsMenuOpen(false)}>
                    Carrito {totalItems > 0 && `(${totalItems})`}
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className={`block px-3 py-2 rounded-xl text-lg font-medium ${isActive('/admin') ? 'text-primary-600 bg-primary-50' : 'text-dark-600'}`} onClick={() => setIsMenuOpen(false)}>
                      Admin
                    </Link>
                  )}
                  <Link to="/profile" className={`block px-3 py-2 rounded-xl text-lg font-medium ${isActive('/profile') ? 'text-primary-600 bg-primary-50' : 'text-dark-600'}`} onClick={() => setIsMenuOpen(false)}>
                    Perfil
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-xl text-lg font-medium text-red-600 hover:bg-red-50"
                  >
                    Cerrar Sesión
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <>
                  <Link to="/login" className={`block px-3 py-2 rounded-xl text-lg font-medium ${isActive('/login') ? 'text-primary-600 bg-primary-50' : 'text-dark-600'}`} onClick={() => setIsMenuOpen(false)}>
                    Iniciar Sesión
                  </Link>
                  <Link to="/register" className={`block px-3 py-2 rounded-xl text-lg font-medium ${isActive('/register') ? 'text-primary-600 bg-primary-50' : 'text-dark-600'}`} onClick={() => setIsMenuOpen(false)}>
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
