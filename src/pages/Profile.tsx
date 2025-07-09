import React from 'react';

const Profile: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👤</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Usuario Demo</h2>
                <p className="text-gray-600">usuario@demo.com</p>
              </div>
              
              <nav className="space-y-2">
                <a href="#" className="flex items-center space-x-3 text-primary-600 bg-primary-50 rounded-lg px-4 py-2">
                  <span>📊</span>
                  <span>Dashboard</span>
                </a>
                <a href="#" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 rounded-lg px-4 py-2">
                  <span>📦</span>
                  <span>Mis Pedidos</span>
                </a>
                <a href="#" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 rounded-lg px-4 py-2">
                  <span>❤️</span>
                  <span>Lista de Deseos</span>
                </a>
                <a href="#" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 rounded-lg px-4 py-2">
                  <span>📍</span>
                  <span>Direcciones</span>
                </a>
                <a href="#" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 rounded-lg px-4 py-2">
                  <span>💳</span>
                  <span>Métodos de Pago</span>
                </a>
                <a href="#" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-50 rounded-lg px-4 py-2">
                  <span>⚙️</span>
                  <span>Configuración</span>
                </a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">📦</div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                    <p className="text-sm text-gray-600">Pedidos Totales</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">💰</div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">$1,234</p>
                    <p className="text-sm text-gray-600">Total Gastado</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">❤️</div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">8</p>
                    <p className="text-sm text-gray-600">Favoritos</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Pedidos Recientes</h3>
              <div className="space-y-4">
                {[
                  { id: '#12345', date: '2024-12-15', status: 'Entregado', total: '$89.99' },
                  { id: '#12344', date: '2024-12-10', status: 'En camino', total: '$156.50' },
                  { id: '#12343', date: '2024-12-05', status: 'Procesando', total: '$45.25' },
                ].map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">📦</div>
                      <div>
                        <p className="font-semibold text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{order.total}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        order.status === 'Entregado' ? 'bg-green-100 text-green-800' :
                        order.status === 'En camino' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-primary-600 hover:text-primary-700 font-medium">
                Ver todos los pedidos →
              </button>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Información Personal</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      defaultValue="Usuario"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido
                    </label>
                    <input
                      type="text"
                      defaultValue="Demo"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="usuario@demo.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    defaultValue="+1234567890"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Guardar Cambios
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
