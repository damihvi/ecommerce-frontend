import React from 'react';
import useCategories from '../hooks/useCategories';

export default function CategoriesList() {
  const { data, isLoading, error } = useCategories();

  if (isLoading) return <div>Cargando categorías...</div>;
  if (error) return <div>Error al cargar categorías</div>;
  if (!Array.isArray(data) || data.length === 0) return <div>No hay categorías registradas</div>;

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
        </tr>
      </thead>
      <tbody>
        {data.map((category) => (
          <tr key={category.id}>
            <td>{category.name}</td>
            <td>{category.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
