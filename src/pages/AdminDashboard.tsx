import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UsersList from '../components/UsersList';
import ProductsList from '../components/ProductsList';
import CategoriesList from '../components/CategoriesList';
import useProducts from '../hooks/useProducts';
import useCategories from '../hooks/useCategories';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsAPI, categoriesAPI } from '../services/api';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  imageUrl?: string;
  category?: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface CategoryFormData {
  name: string;
  description: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'users'>('products');
  
  // Estados para modales
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  
  // Estados para edición
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Estados para formularios
  const [categoryFormData, setCategoryFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
  });
  
  // Query hooks
  const queryClient = useQueryClient();
  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  
  // Mutations
  const createCategoryMutation = useMutation({
    mutationFn: (data: CategoryFormData) => categoriesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsCategoryModalOpen(false);
      toast.success('Categoría creada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create category');
    }
  });
  
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryFormData }) => 
      categoriesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      toast.success('Categoría actualizada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update category');
    }
  });
  // Manejadores de formularios
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        await updateCategoryMutation.mutateAsync({ 
          id: editingCategory.id, 
          data: categoryFormData 
        });
      } else {
        await createCategoryMutation.mutateAsync(categoryFormData);
      }
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      toast.error('Error al guardar la categoría');
    }
  };

  // Redirigir si no está autenticado
  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Modals y lógica de formularios pueden quedarse igual

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Bienvenido, {user?.firstName || 'Usuario'}
              </div>
              <div className="text-xs text-gray-500">
                Rol: {user?.role || 'No definido'} | Estado: {isAuthenticated ? 'Autenticado' : 'No autenticado'}
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Productos
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'categories'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Categorías
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Usuarios
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Productos almacenados</h2>
            <ProductsList />
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Categorías almacenadas</h2>
            <CategoriesList />
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Usuarios almacenados</h2>
            <UsersList />
          </div>
        )}
      </div>

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsCategoryModalOpen(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                  </h3>
                  
                  <form onSubmit={handleCategorySubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nombre de la Categoría *
                      </label>
                      <input
                        type="text"
                        value={categoryFormData.name}
                        onChange={(e) => setCategoryFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Descripción
                      </label>
                      <textarea
                        value={categoryFormData.description}
                        onChange={(e) => setCategoryFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setIsCategoryModalOpen(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                      >
                        {editingCategory ? 'Actualizar' : 'Crear'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} 

    </div>
  );
};

export default AdminDashboard;
