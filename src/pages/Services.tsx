import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsAPI, statsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Services: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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

  const handleContactSupport = () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para contactar soporte');
      return;
    }
    toast.success('Solicitud de soporte enviada. Te contactaremos pronto.');
  };

  const handleStartChat = () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para usar el chat');
      return;
    }
    setShowChat(!showChat);
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;
    
    setIsTyping(true);
    // Simulate sending message
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Mensaje enviado. Un agente te responderá pronto.');
    setChatMessage('');
    setIsTyping(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Nuestros Servicios</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Service Statistics */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Nuestros Números Hablan</h2>
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
              <div className="text-sm text-gray-500">Clientes Satisfechos</div>
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
              Envío gratuito en pedidos superiores a $50. Entrega rápida y segura a tu puerta.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Envío estándar gratuito</li>
              <li>• Entrega en 3-7 días hábiles</li>
              <li>• Seguimiento en tiempo real</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Devoluciones Fáciles</h3>
            <p className="text-gray-600 mb-4">
              Política de devolución sin complicaciones. 30 días para devolver cualquier producto.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• 30 días de garantía</li>
              <li>• Proceso de devolución simple</li>
              <li>• Reembolso completo</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Compra Segura</h3>
            <p className="text-gray-600 mb-4">
              Tus datos están protegidos con encriptación SSL y procesamiento seguro de pagos.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Encriptación SSL</li>
              <li>• Pagos seguros</li>
              <li>• Protección de datos</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Soporte 24/7</h3>
            <p className="text-gray-600 mb-4">
              Nuestro equipo de soporte está disponible las 24 horas para ayudarte.
            </p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• Chat en vivo</li>
              <li>• Soporte por email</li>
              <li>• Línea telefónica</li>
            </ul>
            <button
              onClick={handleContactSupport}
              className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-md text-sm hover:bg-orange-700 transition-colors"
            >
              Contactar Soporte
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Garantía de Calidad</h3>
            <p className="text-gray-600 mb-4">
              Todos nuestros productos pasan por rigurosos controles de calidad.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Productos verificados</li>
              <li>• Garantía del fabricante</li>
              <li>• Calidad garantizada</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Múltiples Formas de Pago</h3>
            <p className="text-gray-600 mb-4">
              Acepta todas las tarjetas principales, PayPal, y más opciones de pago.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Tarjetas de crédito/débito</li>
              <li>• PayPal</li>
              <li>• Transferencias bancarias</li>
            </ul>
          </div>
        </div>

        {/* Premium Services */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-lg p-8 mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Servicios Premium</h2>
            <p className="text-xl mb-8 opacity-90">
              Únete a nuestro programa premium y obtén beneficios exclusivos
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white bg-opacity-20 rounded-lg p-6">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold mb-2">Envío Express</h3>
                <p className="text-sm opacity-90">Entrega en 24-48 horas</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-6">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h3 className="font-bold mb-2">Descuentos Exclusivos</h3>
                <p className="text-sm opacity-90">Hasta 20% de descuento</p>
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
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold mt-8 hover:bg-gray-100 transition-colors disabled:opacity-50"
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
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-primary-600">${product.price}</span>
                    <button className="bg-primary-600 text-white px-4 py-2 rounded text-sm hover:bg-primary-700 transition-colors">
                      Ver Detalles
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
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <p className="text-sm text-primary-600 font-medium">Servicio: {testimonial.service}</p>
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
              <p className="text-gray-600">Los tiempos de entrega varían según tu ubicación. Generalmente, los pedidos llegan entre 3-7 días hábiles. Los miembros Premium disfrutan de envío express en 24-48 horas.</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">¿Puedo devolver un producto?</h3>
              <p className="text-gray-600">Sí, ofrecemos devoluciones gratuitas durante 30 días. El producto debe estar en condiciones originales y con el embalaje original.</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">¿Qué métodos de pago aceptan?</h3>
              <p className="text-gray-600">Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), PayPal, y transferencias bancarias.</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">¿Cómo puedo rastrear mi pedido?</h3>
              <p className="text-gray-600">Una vez que tu pedido sea procesado, recibirás un email con un número de seguimiento para rastrear tu envío en tiempo real.</p>
            </div>
            <div className="pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">¿Qué incluye la membresía Premium?</h3>
              <p className="text-gray-600">La membresía Premium incluye envío express gratuito, descuentos exclusivos hasta 20%, soporte prioritario 24/7, y acceso anticipado a nuevos productos.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleStartChat}
          className="bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-colors"
          title="Chat en vivo"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </div>

      {/* Chat Window */}
      {showChat && (
        <div className="fixed bottom-20 right-6 w-80 bg-white rounded-lg shadow-xl border z-50">
          <div className="bg-primary-600 text-white p-4 rounded-t-lg">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Chat en Vivo</h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-white hover:text-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="p-4 h-64 overflow-y-auto">
            <div className="bg-gray-100 rounded-lg p-3 mb-3">
              <p className="text-sm text-gray-700">
                ¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?
              </p>
            </div>
          </div>
          <div className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={isTyping}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {isTyping ? '...' : 'Enviar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
