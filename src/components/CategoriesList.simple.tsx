import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Category {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

const CategoriesList: React.FC = () => {
  const { isAuthenticated, hasRole } = useAuth();
  const [categories] = useState<Category[]>([]);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  // Verificar autenticación y rol
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!hasRole('admin')) {
    return (
      <div className="text-center p-4 bg-red-50 text-red-600">
        No tienes permisos para acceder a esta sección.
      </div>
    );
  }

  if (loading) {
    return <div className="p-4">Cargando categorías...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header con botón agregar */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestión de Categorías</h2>
        <button
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Agregar Categoría</span>
        </button>
      </div>

      {/* Lista de categorías */}
      {!Array.isArray(categories) || categories.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6">
          <p>No hay categorías registradas</p>
          <p className="text-sm text-gray-500 mt-2">
            Componente CategoriesList funcionando correctamente (versión básica sin hooks)
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      category.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {category.isActive ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-2">Editar</button>
                    <button className="text-red-600 hover:text-red-900">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CategoriesList;
