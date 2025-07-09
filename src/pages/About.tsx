import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsAPI, statsAPI, promotionsAPI } from '../services/api';
import toast from 'react-hot-toast';

const About: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Fetch stats from backend
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      try {
        const response = await statsAPI.getDashboardStats();
        return response.data;
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return null;
      }
    },
    retry: 1,
    retryDelay: 1000,
  });

  // Fetch products as fallback
  const { data: products } = useQuery({
    queryKey: ['products-stats'],
    queryFn: async () => {
      try {
        const response = await productsAPI.getAll();
        return response.data;
      } catch (error) {
        console.error('Error fetching products for stats:', error);
        return [];
      }
    },
    retry: 1,
    retryDelay: 1000,
  });

  // Calculate stats
  const totalProducts = stats?.totalProducts || (Array.isArray(products) ? products.length : 15);
  const totalCustomers = stats?.totalCustomers || (totalProducts * 120);
  const totalOrders = stats?.totalOrders || (totalProducts * 85);
  const rating = stats?.averageRating || 4.8;

  // Fetch active promotions
  const { data: activePromotions } = useQuery({
    queryKey: ['active-promotions'],
    queryFn: async () => {
      try {
        const response = await promotionsAPI.getActive();
        return response.data;
      } catch (error) {
        console.error('Error fetching active promotions:', error);
        return [
          {
            id: 1,
            title: "¡Oferta especial!",
            description: "Descuento del 15% en todos los productos",
            code: "SAVE15",
            validUntil: "2024-12-31"
          }
        ];
      }
    },
    retry: 1,
    retryDelay: 1000,
  });

  const handleNewsletterSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Por favor ingresa tu email');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Por favor ingresa un email válido');
      return;
    }

    setIsSubscribing(true);
    try {
      // Simulate newsletter subscription
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('¡Te has suscrito exitosamente a nuestro newsletter!');
      setEmail('');
    } catch (error) {
      toast.error('Error al suscribirse. Intenta nuevamente.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Acerca de Nosotros</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Promotional Banner */}
        {activePromotions && activePromotions.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                <div>
                  <h3 className="font-bold text-lg">{activePromotions[0].title}</h3>
                  <p className="text-sm opacity-90">{activePromotions[0].description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-xl font-bold">{activePromotions[0].code}</p>
                <p className="text-sm opacity-90">Válido hasta: {activePromotions[0].validUntil}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Mi Historia</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Este es un proyecto de final de semestre desarrollado por <strong>Damián Herrera</strong> 
                como parte de la tecnologia de desarrollo de software.
              </p>
              <p>
                El proyecto consiste en una aplicación  de e-commerce construida con tecnologías 
                 como React, TypeScript, Tailwind CSS en el frontend y NestJS en el backend.
              </p>
              <p>
                se uso conceptos fundamentales como autenticación, gestión de estado, 
                APIs RESTful, bases de datos y diseño responsive.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Estadísticas placeholder</h3>
            {statsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="ml-2 text-gray-600">Cargando estadísticas...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">{totalProducts}+</div>
                  <div className="text-sm text-gray-500">Productos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">{totalCustomers.toLocaleString()}+</div>
                  <div className="text-sm text-gray-500">Clientes Simulados</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">{totalOrders.toLocaleString()}+</div>
                  <div className="text-sm text-gray-500">Pedidos Demo</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">{rating}</div>
                  <div className="text-sm text-gray-500">Calificación</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Objetivos del Proyecto */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Objetivo</h3>
            <p className="text-gray-600">Demostrar competencias en desarrollo full-stack</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tecnologías</h3>
            <p className="text-gray-600">React, TypeScript, NestJS, PostgreSQL</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Implementación</h3>
            <p className="text-gray-600">App proyecto con autenticación y carrito</p>
          </div>
        </div>

        {/* Desarrollador */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Desarrollador</h2>
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-3xl font-bold text-gray-900 mb-2">Damián Herrera</h4>
              <p className="text-xl text-primary-600 mb-4">Desarrollador en proceso</p>
              <p className="text-gray-600 mb-6">
                Estudiante apasionado por los videojuegos y musica. 
                aprendiendo en React, TypeScript, Node.js y bases de datos.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="text-sm font-semibold text-gray-700">Estudiante</div>
                  <div className="text-xs text-gray-500">desarrollo de software</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-sm font-semibold text-gray-700">yo hice el</div>
                  <div className="text-xs text-gray-500">Frontend & Backend</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-4l-1 1v6l1 1-1 1H5l-1-1 1-1V8l-1-1 1-1z" />
                    </svg>
                  </div>
                  <div className="text-sm font-semibold text-gray-700">Proyecto</div>
                  <div className="text-xs text-gray-500">de final de semestre</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tecnologías Utilizadas */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Tecnologías Utilizadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Frontend */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                Frontend
              </h3>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">• React 19 con TypeScript</div>
                <div className="text-sm text-gray-600">• Tailwind CSS</div>
                <div className="text-sm text-gray-600">• React Router DOM</div>
                <div className="text-sm text-gray-600">• TanStack Query</div>
                <div className="text-sm text-gray-600">• React Hot Toast</div>
              </div>
            </div>

            {/* Backend */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                Backend
              </h3>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">• NestJS Framework</div>
                <div className="text-sm text-gray-600">• TypeORM</div>
                <div className="text-sm text-gray-600">• JWT Authentication</div>
                <div className="text-sm text-gray-600">• REST API</div>
                <div className="text-sm text-gray-600">• Bcrypt</div>
              </div>
            </div>

            {/* Base de Datos y Herramientas */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </div>
                Database & Tools
              </h3>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">• PostgreSQL</div>
                <div className="text-sm text-gray-600">• Git & GitHub</div>
                <div className="text-sm text-gray-600">• VS Code</div>
                <div className="text-sm text-gray-600">• npm/yarn</div>
                <div className="text-sm text-gray-600">• Postman</div>
              </div>
            </div>
          </div>
        </div>

        {/* Características del Proyecto */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Características Implementadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Autenticación</h4>
                <p className="text-sm text-gray-600">Sistema completo de login y registro</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Carrito de Compras</h4>
                <p className="text-sm text-gray-600">Gestión completa del carrito</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Diseño Responsive</h4>
                <p className="text-sm text-gray-600">Adaptado para todos los dispositivos</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Búsqueda Avanzada</h4>
                <p className="text-sm text-gray-600">Filtros y búsqueda por categorías</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Optimización</h4>
                <p className="text-sm text-gray-600">Carga rápida y eficiente</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">UI/UX Moderno</h4>
                <p className="text-sm text-gray-600">Interfaz intuitiva y atractiva</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Mantente al día con nosotros</h2>
            <p className="text-lg mb-6 opacity-90">
              Suscríbete a nuestro newsletter y recibe ofertas exclusivas, noticias de productos y actualizaciones.
            </p>
            <form onSubmit={handleNewsletterSubscription} className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu email"
                  className="flex-1 px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                  disabled={isSubscribing}
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="bg-white text-primary-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {isSubscribing ? 'Enviando...' : 'Suscribirse'}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
