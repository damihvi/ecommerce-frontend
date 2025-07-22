import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrderDisplayNumber } from '../utils/orderUtils';

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    // Obtener el ID del pedido del localStorage
    const lastOrderId = localStorage.getItem('lastOrderId');
    if (lastOrderId) {
      setOrderId(lastOrderId);
      // Limpiar el localStorage después de obtener el ID
      localStorage.removeItem('lastOrderId');
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center">
        {/* Icono de éxito */}
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-6">
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          ¡Orden Confirmada!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Tu orden ha sido procesada exitosamente. Recibirás un email de confirmación en breve.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Detalles de la Orden
          </h2>
          <div className="space-y-2 text-left">
            <div className="flex justify-between">
              <span className="text-gray-600">Número de Orden:</span>
              <span className="font-medium">{getOrderDisplayNumber(orderId)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Fecha:</span>
              <span className="font-medium">{new Date().toLocaleDateString('es-ES')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estado:</span>
              <span className="font-medium text-green-600">Confirmada</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tiempo estimado de entrega:</span>
              <span className="font-medium">3-5 días hábiles</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/products')}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Continuar Comprando
          </button>
          
          <button
            onClick={() => navigate('/profile')}
            className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Ver Mis Órdenes
          </button>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>¿Necesitas ayuda?</strong> Contacta nuestro servicio al cliente en 
            <a href="mailto:support@ecommerce.com" className="underline ml-1">
              support@ecommerce.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
