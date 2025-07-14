import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL, productsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const [backendStatus, setBackendStatus] = useState<string>('Checking...');
  const { isAuthenticated, user, loading } = useAuth();

  console.log('Home - Auth state:', { isAuthenticated, user, loading }); // Debug log

  useEffect(() => {
    // Test backend connection
    const testBackend = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/health`);
        if (response.ok) {
          setBackendStatus('✅ Backend conectado exitosamente');
        } else {
          setBackendStatus('❌ Falló la conexión al backend');
        }
      } catch (error) {
        setBackendStatus('❌ Backend no accesible');
      }
    };

    testBackend();
  }, []);

  // Fetch featured products
  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      try {
        const response = await productsAPI.getFeatured();
        const data = response.data;
        // Ensure we always return an array
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error fetching featured products:', error);
        return [];
      }
    },
  });

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-50 to-white">
      {/* Debug Info */}
      <div className="bg-blue-100 p-4 border-l-4 border-blue-500 text-blue-700">
        <h3 className="font-bold">Estado de Debug:</h3>
        <p>Autenticado: {isAuthenticated ? 'Sí' : 'No'}</p>
        <p>Usuario: {user ? `${user.firstName} ${user.lastName}` : 'No definido'}</p>
        <p>Backend: {backendStatus}</p>
      </div>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-800">
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-white/5 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]"></div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="text-center">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-white mb-4 sm:mb-6 animate-float px-2">
                Bienvenido a{' '}
                <span className="gradient-text bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Damihvi's Ecommerce
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
                Descubre productos increíbles con experiencias únicas en mi proyecto de final de semestre.
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link
                to="/products"
                className="btn-primary text-lg px-6 py-3 sm:px-8 sm:py-4 transform hover:scale-105 transition-all duration-200 shadow-2xl w-full sm:w-auto text-center"
              >
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>Explorar Productos</span>
                </span>
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 sm:px-8 sm:py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-semibold hover:bg-white/20 transition-all duration-200 border border-white/20 w-full sm:w-auto text-center"
              >
                Conoce Más
              </Link>
            </div>

            {/* Status Cards Container */}
            <div className="space-y-4 w-full max-w-2xl mx-auto">
              {/* Backend Status */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 w-full">
                <p className="text-white/90 font-medium text-center">{backendStatus}</p>
              </div>
              
              {/* Auth Debug Info */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 w-full">
                <div className="text-white/90 font-medium text-center">
                  <p className="mb-2">🔐 Auth Status: {isAuthenticated ? '✅ Logged In' : '❌ Not Logged In'}</p>
                  {user && (
                    <div className="text-sm space-y-1">
                      <p>👤 User: {user.firstName} {user.lastName}</p>
                      <p>📧 Email: {user.email}</p>
                      <p>🏷️ Role: {user.role}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20"></div>
        </div>
        <div className="absolute bottom-20 right-10 animate-float" style={{ animationDelay: '1s' }}>
          <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-dark-800 mb-4">
              ¿Por qué elegir Damihvi's Ecommerce?
            </h2>
            <p className="text-xl text-dark-600 max-w-2xl mx-auto">
              Un proyecto que tuve que cambiar todo en 3 dias :)
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-modern text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-dark-800 mb-4">Envío Rápido</h3>
              <p className="text-dark-600">
                Recibe tus productos en la puerta de tu hogar
              </p>
            </div>
            
            <div className="card-modern text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-secondary-400 to-accent-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-dark-800 mb-4">Calidad Garantizada</h3>
              <p className="text-dark-600">
                Alfin se termino el semestre 
              </p>
            </div>
            
            <div className="card-modern text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-accent-400 to-primary-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-dark-800 mb-4">Soporte 24/7</h3>
              <p className="text-dark-600">
                todo mi fin de semana se fue en cambiar todo :) 
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="py-20 bg-gradient-to-b from-light-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-dark-800 mb-4">
              Productos Destacados
            </h2>
            <p className="text-xl text-dark-600">
              Productos mas pedidos:
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card-modern animate-pulse">
                  <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.isArray(featuredProducts) && featuredProducts.slice(0, 4).map((product: any) => (
                <div key={product.id} className="card-modern group hover:shadow-2xl transition-all duration-300">
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <img
                      src={product.imageUrl || '/api/placeholder/300/200'}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-dark-800 mb-2 group-hover:text-primary-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-dark-600 mb-3 text-sm">
                    {product.description?.substring(0, 100)}...
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary-600">
                      ${product.price}
                    </span>
                    <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 font-medium">
                      Ver Más
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-dark-600 text-lg">No hay productos destacados disponibles en este momento.</p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>Ver Todos los Productos</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Cards Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-dark-800 mb-4">
              Explora El Proyecto
            </h2>
            <p className="text-xl text-dark-600">
              Diferentes enlaces para navegar
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/services"
              className="card-modern group hover:shadow-2xl transition-all duration-300 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-dark-800 mb-2 group-hover:text-primary-600 transition-colors">
                Servicios
              </h3>
              <p className="text-dark-600">
                Descubre todos nuestros servicios premium
              </p>
            </Link>
            
            <Link
              to="/about"
              className="card-modern group hover:shadow-2xl transition-all duration-300 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-secondary-400 to-accent-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-dark-800 mb-2 group-hover:text-primary-600 transition-colors">
                Yo
              </h3>
              <p className="text-dark-600">
                informacion sobre mi y mi proyecto
              </p>
            </Link>
            
            <Link
              to="/blog"
              className="card-modern group hover:shadow-2xl transition-all duration-300 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-accent-400 to-primary-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-dark-800 mb-2 group-hover:text-primary-600 transition-colors">
                Blog
              </h3>
              <p className="text-dark-600">
                Informacion de relleno
              </p>
            </Link>
            
            <Link
              to="/contact"
              className="card-modern group hover:shadow-2xl transition-all duration-300 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-dark-800 mb-2 group-hover:text-primary-600 transition-colors">
                Contacto
              </h3>
              <p className="text-dark-600">
                Mi contacto
              </p>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-display font-bold text-white mb-6">
            ¿Listo para comenzar tu experiencia?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Extraño mi tiempo libre
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-primary-600 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-colors shadow-lg text-lg"
            >
              Crear Cuenta
            </Link>
            <Link
              to="/products"
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-colors border border-white/20 text-lg"
            >
              Explorar Productos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
