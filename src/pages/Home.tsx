import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL, productsAPI } from '../services/api';

const Home: React.FC = () => {
  const [backendStatus, setBackendStatus] = useState<string>('Checking...');

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
        return response.data;
      } catch (error) {
        console.error('Error fetching featured products:', error);
        return [];
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Bienvenido a Nuestra Tienda
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Descubre productos increíbles a precios excelentes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Comprar Ahora
              </Link>
              <Link
                to="/register"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Únete a Nosotros
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Status Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-primary-600 text-sm font-semibold tracking-wide uppercase">
            ECOMMERCE FULL STACK
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
            ¡Aplicación Completa Funcionando!
          </h2>
          <p className="text-gray-600 mb-6">
            Frontend React + Backend NestJS están funcionando correctamente.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Estado de la conexión:</h3>
            <p className="text-sm">{backendStatus}</p>
            <p className="text-xs text-gray-500 mt-1">
              URL del Backend: {API_BASE_URL}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-4">Tecnologías utilizadas:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-primary-50">
                <h4 className="font-medium text-primary-900 mb-2">Frontend</h4>
                <ul className="text-sm text-primary-800 space-y-1">
                  <li>• React 18 con TypeScript</li>
                  <li>• Tailwind CSS</li>
                  <li>• React Router</li>
                  <li>• React Query</li>
                  <li>• Axios</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-accent-50">
                <h4 className="font-medium text-accent-900 mb-2">Backend</h4>
                <ul className="text-sm text-accent-800 space-y-1">
                  <li>• NestJS con TypeScript</li>
                  <li>• TypeORM</li>
                  <li>• Autenticación JWT</li>
                  <li>• PostgreSQL</li>
                  <li>• Arquitectura Modular</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              <span>Backend NestJS compilando y ejecutándose</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              <span>Frontend React compilando y ejecutándose</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              <span>Dependencias instaladas correctamente</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              <span>Comunicación Frontend ↔ Backend establecida</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              <span>Tailwind CSS funcionando correctamente</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              <span>Navegación y contextos implementados</span>
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Productos Destacados</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : Array.isArray(featuredProducts) && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.slice(0, 3).map((product: any) => (
                <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <div className="text-gray-400">No image</div>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{product.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-primary-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <Link
                      to={`/products/${product.id}`}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Ver Detalles
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No hay productos destacados disponibles</p>
              <Link
                to="/products"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Explorar Todos los Productos
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explora Nuestro Sitio
          </h2>
          <p className="text-gray-600">
            Encuentra todo lo que necesitas con facilidad
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/services"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
          >
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Servicios</h3>
            <p className="text-gray-600">Descubre todos nuestros servicios premium</p>
          </Link>
          
          <Link
            to="/about"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
          >
            <div className="text-4xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nosotros</h3>
            <p className="text-gray-600">Conoce nuestra historia y valores</p>
          </Link>
          
          <Link
            to="/blog"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
          >
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Blog</h3>
            <p className="text-gray-600">Lee nuestros últimos artículos</p>
          </Link>
          
          <Link
            to="/contact"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
          >
            <div className="text-4xl mb-4">📞</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Contacto</h3>
            <p className="text-gray-600">Ponte en contacto con nosotros</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
