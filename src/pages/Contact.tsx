import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Contacto</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Envíanos un mensaje</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Tu nombre"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="tu@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="+1234567890"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Asunto
                </label>
                <select
                  id="subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option>Selecciona un asunto</option>
                  <option>Consulta sobre productos</option>
                  <option>Soporte técnico</option>
                  <option>Devoluciones</option>
                  <option>Facturación</option>
                  <option>Otros</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Escribe tu mensaje aquí..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Enviar mensaje
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Información de contacto</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="text-2xl mr-4">📍</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Dirección</h3>
                    <p className="text-gray-600">123 Main Street, Ciudad, País 12345</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="text-2xl mr-4">📞</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Teléfono</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="text-2xl mr-4">✉️</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">contact@tienda.com</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="text-2xl mr-4">🕒</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Horario de atención</h3>
                    <p className="text-gray-600">Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Sábados: 10:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Preguntas Frecuentes</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">¿Cuál es el tiempo de entrega?</h3>
                  <p className="text-gray-600">Normalmente entre 3-7 días hábiles.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">¿Ofrecen devoluciones?</h3>
                  <p className="text-gray-600">Sí, 30 días para devoluciones sin preguntas.</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">¿Qué métodos de pago aceptan?</h3>
                  <p className="text-gray-600">Tarjetas de crédito, PayPal, y transferencias bancarias.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
