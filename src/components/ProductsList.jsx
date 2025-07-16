import React from 'react';
import useProducts from '../hooks/useProducts';

export default function ProductsList() {
  const { data, isLoading, error } = useProducts();

  if (isLoading) return <div>Cargando productos...</div>;
  if (error) return <div>Error al cargar productos</div>;
  if (!Array.isArray(data) || data.length === 0) return <div>No hay productos registrados</div>;

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Categoría</th>
        </tr>
      </thead>
      <tbody>
        {data.map((product) => (
          <tr key={product.id}>
            <td>{product.title}</td>
            <td>{product.description}</td>
            <td>${product.price}</td>
            <td>{product.stock}</td>
            <td>{product.category?.name || 'Sin categoría'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
