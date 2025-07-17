import React from 'react';
import { Navigate } from 'react-router-dom';
import useCategories from '../hooks/useCategories';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../constants/roles';

export default function CategoriesList() {
  const { isAuthenticated, hasRole } = useAuth();
  const {
    categories,
    loading,
    error,
    pagination,
    fetchCategories
  } = useCategories();

  // Verificar autenticación y rol
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!hasRole(UserRole.ADMIN)) {
    return <div className="text-center p-4 bg-red-50 text-red-600">
      No tienes permisos para acceder a esta sección.
    </div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Cargando categorías...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  if (!Array.isArray(categories) || categories.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No hay categorías registradas
      </div>
    );

  return (
    <div className="space-y-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>{category.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {Array.from({ length: pagination.totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => fetchCategories(i + 1)}
              className={`px-3 py-1 border rounded ${
                pagination.currentPage === i + 1
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
}
