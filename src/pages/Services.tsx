import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsAPI, statsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Services: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  // Fetch service statistics
  const { data: serviceStats } = useQuery({
    queryKey: ['service-stats'],
    queryFn: async () => {
      try {
        const response = await statsAPI.getDashboardStats();
        return response.data;
      } catch (error) {
        console.error('Error fetching service stats:', error);
        return {
          totalOrders: 1250,
          satisfactionRate: 98,
          averageDeliveryTime: 3.2,
          totalCustomers: 5000
        };
      }
    },
    retry: 1,
    retryDelay: 1000,
  });

  // Fetch featured products for service demo
  const { data: featuredProducts } = useQuery({
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
    retry: 1,
    retryDelay: 1000,
  });

  // Fetch testimonials/reviews
  const { data: testimonials } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      try {
        // This would come from reviews API in real implementation
        return [
          {
            id: 1,
            name: "María González",
            text: "Excelente servicio. Los productos llegaron en perfectas condiciones y el envío fue súper rápido.",
            rating: 5,
            service: "Envío Express"
          },
          {
            id: 2,
            name: "Carlos Rodríguez",
            text: "El soporte al cliente es increíble. Resolvieron mi problema en menos de 24 horas.",
            rating: 5,
            service: "Soporte 24/7"
          },
          {
            id: 3,
            name: "Ana Martínez",
            text: "La política de devoluciones es muy sencilla. Pude devolver un producto sin complicaciones.",
            rating: 5,
            service: "Devoluciones"
          }
        ];
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        return [];
      }
    },
    retry: 1,
    retryDelay: 1000,
  });

  const handlePremiumSubscription = async () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para suscribirte a Premium');
      return;
    }

    setIsLoading(true);
    try {
      // Simular suscripción premium
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('¡Te has suscrito exitosamente al servicio Premium!');
    } catch (error) {
      toast.error('Error al procesar la suscripción');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Servicios</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Service Statistics */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Mas informacion de relleno</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900">{serviceStats?.totalOrders?.toLocaleString() || '1,250'}</div>
              <div className="text-sm text-gray-500">Pedidos Entregados</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900">{serviceStats?.satisfactionRate || '98'}%</div>
              <div className="text-sm text-gray-500">Satisfacción del Cliente</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900">{serviceStats?.averageDeliveryTime || '3.2'}</div>
              <div className="text-sm text-gray-500">Días Promedio de Entrega</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900">{serviceStats?.totalCustomers?.toLocaleString() || '5,000'}+</div>
              <div className="text-sm text-gray-500">Clientes Felices</div>
            </div>
          </div>
        </div>
        {/* Main Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Envío Gratuito</h3>
            <p className="text-gray-600 mb-4">
              Envío gratuito en pedidos  grandes. Entrega rápida y segura.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Envío estándar gratuito</li>
              <li>• Entrega de 3 a 10 días</li>
              <li>• Seguimiento del pedido</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Devolucion</h3>
            <p className="text-gray-600 mb-4">
              Política de devolución si el producto no fue dañado o esta defectuoso. 30 días para devolver cualquier producto.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• 1 mes de garantía</li>
              <li>• Proceso de devolución rápido</li>
              <li>• Reembolso completo o cambio de producto</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Seguridad</h3>
            <p className="text-gray-600 mb-4">
              Datos encriptados 
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Encriptación SSL</li>
              <li>• Pagos seguros</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Garantía de Calidad</h3>
            <p className="text-gray-600 mb-4">
              Espero que todo sirva
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Productos certificados</li>
              <li>• Garantía</li>
              <li>• Calidad</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Formas de Pago</h3>
            <p className="text-gray-600 mb-4">
              Acepta todo tipo de tarjetas de credito/débito.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Tarjetas de crédito/débito</li>
              <li>• PayPal</li>
              <li>• Transferencias bancarias</li>
            </ul>
          </div>
        </div>

        {/* Premium Services */}
        <div className="bg-gradient-to-r from-black to-gray-900 text-white rounded-lg p-8 mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Servicios Premium</h2>
            <p className="text-xl mb-8 opacity-90">
              Todo ecommerce tiene una suscripción premium, se parte de ello 
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white bg-opacity-20 rounded-lg p-6">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold mb-2">Envío Prioritario</h3>
                <p className="text-sm opacity-90">Entregas prioritarias en la mitad de tiempo</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-6">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h3 className="font-bold mb-2">Ofertas Exclusivos</h3>
                <p className="text-sm opacity-90">Promociones mensuales</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-6">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="font-bold mb-2">Soporte Prioritario</h3>
                <p className="text-sm opacity-90">Atención personalizada</p>
              </div>
            </div>
            <button 
              onClick={handlePremiumSubscription}
              disabled={isLoading}
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold mt-8 hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Procesando...' : 'Únete Ahora'}
            </button>
          </div>
        </div>

        {/* Featured Products Section */}
        {featuredProducts && featuredProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Productos Destacados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.slice(0, 3).map((product: any) => (
                <div key={product.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={productsAPI.getImageUrl(product.imageUrl)}
                        alt={product.name || product.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`flex items-center justify-center w-full h-full ${product.imageUrl ? 'hidden' : ''}`}>
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name || product.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-primary-600">${product.price}</span>
                    <button className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors">
                      Detalles
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Testimonials Section */}
        {testimonials && testimonials.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Lo que dicen nuestros clientes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial: any) => (
                <div key={testimonial.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <div className="flex text-yellow-400">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2">"{testimonial.text}"</p>
                  <p className="text-sm text-orange-400 font-medium">Servicio: {testimonial.service}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Preguntas Frecuentes</h2>
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">¿Cuál es el tiempo de entrega?</h3>
              <p className="text-gray-600">Este semestre se sintió más largo de lo normal.</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">¿Se puede devolver un producto?</h3>
              <p className="text-gray-600">Siento que fue tiempo perdido tener que modificar todo todo el front.</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">¿Qué métodos de pago se aceptan?</h3>
              <p className="text-gray-600">Pude haber estudiado para ciberseguridad o disfrutar el poco tiempo libre que tengo.</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">¿Cómo puedo rastrear mi pedido?</h3>
              <p className="text-gray-600">Tailwind esta mejor que bootstrap.</p>
            </div>
            <div className="pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">¿Qué incluye la membresía Premium?</h3>
              <p className="text-gray-600">spider-man la cabra de todo marvel.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
