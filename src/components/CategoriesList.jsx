import React from 'react';
import useCategories from '../hooks/useCategories';

export default function CategoriesList() {
  const {
    categories,
    loading,
    error,
    pagination,
    fetchCategories
  } = useCategories();

  if (loading) return <div>Cargando categorías...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!Array.isArray(categories) || categories.length === 0) return <div>No hay categorías registradas</div>;

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
