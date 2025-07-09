import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsAPI, categoriesAPI } from '../services/api';
import { useCart } from '../context/CartContext';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  stock: number;
  category: {
    id: number;
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
}

const Products: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();
  const location = useLocation();

  // Extract search term from URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [location.search]);

  // Fetch products
  const { data: products, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['products', selectedCategory, searchTerm],
    queryFn: async () => {
      const params: any = {};
      if (selectedCategory) params.categoryId = selectedCategory;
      if (searchTerm) params.search = searchTerm;
      
      const response = await productsAPI.getAll(params);
      return response.data;
    },
    retry: 1,
    retryDelay: 1000,
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoriesAPI.getActive();
      return response.data;
    },
    retry: 1,
    retryDelay: 1000,
  });

  const handleAddToCart = async (productId: number) => {
    try {
      await addToCart(productId, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error al cargar productos</h2>
          <p className="text-gray-600">Por favor, inténtalo de nuevo más tarde</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8 space-y-6">
          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 text-xl">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <span className="text-gray-400 hover:text-gray-600 text-xl">✕</span>
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              All Categories
            </button>
            {Array.isArray(categories) && categories.map((category: Category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product: Product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Product Image */}
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400">No image</div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    <Link 
                      to={`/products/${product.id}`} 
                      className="hover:text-primary-600"
                    >
                      {product.title}
                    </Link>
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-primary-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Stock: {product.stock}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {product.category.name}
                    </span>
                    
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      disabled={product.stock === 0}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        product.stock === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-primary-600 text-white hover:bg-primary-700'
                      }`}
                    >
                      {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Sample products when no backend data is available
            [
              {
                id: 1,
                title: "Smartphone Premium",
                description: "Último modelo con características avanzadas",
                price: 699.99,
                stock: 15,
                category: { name: "Tecnología" }
              },
              {
                id: 2,
                title: "Laptop Gaming",
                description: "Perfecta para juegos y trabajo profesional",
                price: 1299.99,
                stock: 8,
                category: { name: "Computación" }
              },
              {
                id: 3,
                title: "Auriculares Inalámbricos",
                description: "Sonido de alta calidad con cancelación de ruido",
                price: 199.99,
                stock: 25,
                category: { name: "Audio" }
              },
              {
                id: 4,
                title: "Cámara Digital",
                description: "Captura momentos con calidad profesional",
                price: 549.99,
                stock: 12,
                category: { name: "Fotografía" }
              },
            ]
              .filter(product => 
                !searchTerm || 
                product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Product Image */}
                  <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <div className="text-6xl">📱</div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      <Link 
                        to={`/products/${product.id}`} 
                        className="hover:text-primary-600"
                      >
                        {product.title}
                      </Link>
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-primary-600">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">
                        Stock: {product.stock}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {product.category.name}
                      </span>
                      
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        disabled={product.stock === 0}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          product.stock === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-primary-600 text-white hover:bg-primary-700'
                        }`}
                      >
                        {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Empty State */}
        {searchTerm && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">�</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron productos para "{searchTerm}"
            </h3>
            <p className="text-gray-600">
              Intenta con otros términos de búsqueda o explora nuestras categorías
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Limpiar búsqueda
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
