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
        const responseData = response.data;
        // Ensure we always return an array
        return Array.isArray(responseData) ? responseData : [];
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Bienvenido a nuestro
              <span className="block text-accent-400">E-commerce</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Descubre productos increíbles con ofertas exclusivas. Tu tienda online de confianza.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="btn-primary text-lg px-8 py-4"
              >
                Ver Productos
              </Link>
              <Link
                to="/about"
                className="btn-secondary text-lg px-8 py-4"
              >
                Conoce Más
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Productos Destacados
            </h2>
            <p className="text-xl text-gray-600">
              Nuestros productos más populares y mejor valorados
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="card-modern p-6 animate-pulse">
                  <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts && featuredProducts.length > 0 ? (
                featuredProducts.map((product: any) => (
                  <div key={product.id} className="card-modern p-6 hover:scale-105 transition-transform">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-gray-500">Sin imagen</span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {product.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary-600">
                        ${product.price}
                      </span>
                      <button className="btn-primary">
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No hay productos destacados disponibles</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
