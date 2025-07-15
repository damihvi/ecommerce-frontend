import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsAPI, categoriesAPI, usersAPI } from '../services/api';
import toast from 'react-hot-toast';
import ImageUpload from '../components/ImageUpload';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  imageUrl?: string;
  category?: {
    id: number;
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
  description?: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  imageUrl?: string;
}

interface CategoryFormData {
  name: string;
  description: string;
}

interface UserFormData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'users' | 'stats'>('products');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [productFormData, setProductFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: 0,
    imageUrl: ''
  });

  const [categoryFormData, setCategoryFormData] = useState<CategoryFormData>({
    name: '',
    description: ''
  });

  const [userFormData, setUserFormData] = useState<UserFormData>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: 'customer'
  });

  // Redirect if not authenticated or not admin
  React.useEffect(() => {
    console.log('AdminDashboard - Auth check:', { isAuthenticated, user, authLoading });
    
    if (!authLoading && !isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      navigate('/login');
    }
  }, [isAuthenticated, user, authLoading, navigate]);

  // Fetch products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await productsAPI.getAll();
      console.log('Products API response:', response.data);
      // Ensure we return an array
      return Array.isArray(response.data) ? response.data : [];
    },
  });

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoriesAPI.getAll();
      console.log('Categories API response:', response.data);
      // Ensure we return an array
      return Array.isArray(response.data) ? response.data : [];
    },
  });

  // Fetch users
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const response = await usersAPI.getAll({ page: 1, limit: 100 });
        console.log('Users API response:', response.data);
        
        // Handle paginated response
        if (response.data?.users && Array.isArray(response.data.users)) {
          return response.data.users;
        }
        
        // Handle direct array response (backward compatibility)
        return Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error; // Let React Query handle the error
      }
    },
  });

  // Product mutations
  const createProductMutation = useMutation({
    mutationFn: async (productData: FormData) => {
      const response = await productsAPI.create(productData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Producto creado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsProductModalOpen(false);
      resetProductForm();
    },
    onError: (error) => {
      console.error('Error creating product:', error);
      toast.error('Error al crear el producto');
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, productData }: { id: number; productData: FormData }) => {
      const response = await productsAPI.update(id, productData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Producto actualizado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsProductModalOpen(false);
      setEditingProduct(null);
      resetProductForm();
    },
    onError: (error) => {
      console.error('Error updating product:', error);
      toast.error('Error al actualizar el producto');
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await productsAPI.delete(id);
      return id;
    },
    onSuccess: () => {
      toast.success('Producto eliminado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('Error deleting product:', error);
      toast.error('Error al eliminar el producto');
    },
  });

  // Category mutations
  const createCategoryMutation = useMutation({
    mutationFn: async (categoryData: CategoryFormData) => {
      const response = await categoriesAPI.create(categoryData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Categoría creada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsCategoryModalOpen(false);
      resetCategoryForm();
    },
    onError: (error) => {
      console.error('Error creating category:', error);
      toast.error('Error al crear la categoría');
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, categoryData }: { id: number; categoryData: CategoryFormData }) => {
      const response = await categoriesAPI.update(id, categoryData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Categoría actualizada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      resetCategoryForm();
    },
    onError: (error) => {
      console.error('Error updating category:', error);
      toast.error('Error al actualizar la categoría');
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      await categoriesAPI.delete(id);
      return id;
    },
    onSuccess: () => {
      toast.success('Categoría eliminada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      console.error('Error deleting category:', error);
      toast.error('Error al eliminar la categoría');
    },
  });

  // User mutations
  const createUserMutation = useMutation({
    mutationFn: async (userData: UserFormData) => {
      const response = await usersAPI.create(userData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Usuario creado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsUserModalOpen(false);
      resetUserForm();
    },
    onError: (error: any) => {
      console.error('Error creating user:', error);
      const errorMessage = error.response?.data?.message || 'Error al crear el usuario';
      toast.error(errorMessage);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, userData }: { id: string; userData: UserFormData }) => {
      const response = await usersAPI.update(id, userData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Usuario actualizado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsUserModalOpen(false);
      setEditingUser(null);
      resetUserForm();
    },
    onError: (error: any) => {
      console.error('Error updating user:', error);
      const errorMessage = error.response?.data?.message || 'Error al actualizar el usuario';
      toast.error(errorMessage);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      await usersAPI.delete(id);
      return id;
    },
    onSuccess: () => {
      toast.success('Usuario eliminado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      console.error('Error deleting user:', error);
      const errorMessage = error.response?.data?.message || 'Error al eliminar el usuario';
      toast.error(errorMessage);
    },
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const response = await usersAPI.updateRole(id, role);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Rol actualizado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      console.error('Error updating user role:', error);
      const errorMessage = error.response?.data?.message || 'Error al actualizar el rol';
      toast.error(errorMessage);
    },
  });

  // Form handlers
  const resetProductForm = () => {
    setProductFormData({
      title: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: 0,
      imageUrl: ''
    });
  };

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: '',
      description: ''
    });
  };

  const resetUserForm = () => {
    setUserFormData({
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      role: 'customer'
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl || ''
    });
    setIsProductModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description || ''
    });
    setIsCategoryModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserFormData({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: '', // Don't pre-fill password for security
      role: user.role
    });
    setIsUserModalOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productFormData.title || !productFormData.description || productFormData.price <= 0 || productFormData.categoryId === 0) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    const formData = new FormData();
    formData.append('title', productFormData.title);
    formData.append('description', productFormData.description);
    formData.append('price', productFormData.price.toString());
    formData.append('stock', productFormData.stock.toString());
    formData.append('categoryId', productFormData.categoryId.toString());
    
    if (productFormData.imageUrl) {
      formData.append('imageUrl', productFormData.imageUrl);
    }

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, productData: formData });
    } else {
      createProductMutation.mutate(formData);
    }
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryFormData.name) {
      toast.error('El nombre de la categoría es requerido');
      return;
    }

    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, categoryData: categoryFormData });
    } else {
      createCategoryMutation.mutate(categoryFormData);
    }
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userFormData.username || !userFormData.email || !userFormData.firstName || !userFormData.lastName) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    if (!editingUser && !userFormData.password) {
      toast.error('La contraseña es requerida para nuevos usuarios');
      return;
    }

    if (editingUser) {
      updateUserMutation.mutate({ id: editingUser.id, userData: userFormData });
    } else {
      createUserMutation.mutate(userFormData);
    }
  };

  const handleDeleteProduct = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      deleteProductMutation.mutate(id);
    }
  };

  const handleDeleteCategory = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      deleteCategoryMutation.mutate(id);
    }
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      deleteUserMutation.mutate(id);
    }
  };

  const handleUpdateUserRole = (id: string, role: string) => {
    updateUserRoleMutation.mutate({ id, role });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h2>
          <p className="text-gray-600">Por favor inicia sesión para acceder al dashboard</p>
        </div>
      </div>
    );
  }

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
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'stats'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Estadísticas
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Gestión de Productos</h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  resetProductForm();
                  setIsProductModalOpen(true);
                }}
                className="btn-primary"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nuevo Producto
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productsLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          Cargando productos...
                        </td>
                      </tr>
                    ) : !Array.isArray(products) || products.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          No hay productos registrados
                        </td>
                      </tr>
                    ) : (
                      products.map((product: Product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={product.imageUrl || '/placeholder.jpg'}
                                  alt={product.title}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {product.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {product.description.substring(0, 50)}...
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {product.category?.name || 'Sin categoría'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${product.price.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.stock}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Gestión de Categorías</h2>
              <button
                onClick={() => {
                  setEditingCategory(null);
                  resetCategoryForm();
                  setIsCategoryModalOpen(true);
                }}
                className="btn-primary"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nueva Categoría
              </button>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoriesLoading ? (
                <div className="col-span-full text-center text-gray-500">
                  Cargando categorías...
                </div>
              ) : !Array.isArray(categories) || categories.length === 0 ? (
                <div className="col-span-full text-center text-gray-500">
                  No hay categorías registradas
                </div>
              ) : (
                categories.map((category: Category) => (
                  <div key={category.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {category.name}
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {category.description || 'Sin descripción'}
                    </p>
                    <div className="mt-4">
                      <span className="text-sm text-gray-500">
                        Productos: {products?.filter((p: Product) => p.categoryId === category.id).length || 0}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Gestión de Usuarios</h2>
              <button
                onClick={() => {
                  setEditingUser(null);
                  resetUserForm();
                  setIsUserModalOpen(true);
                }}
                className="btn-primary"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nuevo Usuario
              </button>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha de Registro
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {usersLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
                        </td>
                      </tr>
                    ) : !Array.isArray(users) || users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          No hay usuarios registrados
                        </td>
                      </tr>
                    ) : (
                      users.map((user: User) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                                  <span className="text-white font-semibold text-sm">
                                    {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  @{user.username}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={user.role}
                              onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                              className="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="customer">Customer</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditUser(user)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Estadísticas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Productos
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {products?.length || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Categorías
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {categories?.length || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Valor Total Stock
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        ${products?.reduce((total: number, product: Product) => total + (product.price * product.stock), 0).toLocaleString() || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Stock Total
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {products?.reduce((total: number, product: Product) => total + product.stock, 0) || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsProductModalOpen(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                  </h3>
                  
                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nombre del Producto *
                      </label>
                      <input
                        type="text"
                        value={productFormData.title}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Descripción *
                      </label>
                      <textarea
                        value={productFormData.description}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, description: e.target.value }))}
                        required
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Precio *
                        </label>
                        <input
                          type="number"
                          value={productFormData.price}
                          onChange={(e) => setProductFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                          required
                          min="0"
                          step="0.01"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Stock
                        </label>
                        <input
                          type="number"
                          value={productFormData.stock}
                          onChange={(e) => setProductFormData(prev => ({ ...prev, stock: Number(e.target.value) }))}
                          min="0"
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Categoría *
                      </label>
                      <select
                        value={productFormData.categoryId}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, categoryId: Number(e.target.value) }))}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value={0}>Selecciona una categoría</option>
                        {Array.isArray(categories) && categories.map((category: Category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Imagen del Producto
                      </label>
                      <ImageUpload
                        onImageUploaded={(url) => setProductFormData(prev => ({ ...prev, imageUrl: url }))}
                        currentImageUrl={productFormData.imageUrl}
                        className="mt-1"
                      />
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setIsProductModalOpen(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={createProductMutation.isPending || updateProductMutation.isPending}
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                      >
                        {editingProduct ? 'Actualizar' : 'Crear'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsUserModalOpen(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                  </h3>
                  
                  <form onSubmit={handleUserSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nombre de Usuario *
                      </label>
                      <input
                        type="text"
                        value={userFormData.username}
                        onChange={(e) => setUserFormData(prev => ({ ...prev, username: e.target.value }))}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={userFormData.email}
                        onChange={(e) => setUserFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Nombre *
                        </label>
                        <input
                          type="text"
                          value={userFormData.firstName}
                          onChange={(e) => setUserFormData(prev => ({ ...prev, firstName: e.target.value }))}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Apellido *
                        </label>
                        <input
                          type="text"
                          value={userFormData.lastName}
                          onChange={(e) => setUserFormData(prev => ({ ...prev, lastName: e.target.value }))}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Contraseña {editingUser ? '(dejar en blanco para no cambiar)' : '*'}
                      </label>
                      <input
                        type="password"
                        value={userFormData.password}
                        onChange={(e) => setUserFormData(prev => ({ ...prev, password: e.target.value }))}
                        required={!editingUser}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Rol *
                      </label>
                      <select
                        value={userFormData.role}
                        onChange={(e) => setUserFormData(prev => ({ ...prev, role: e.target.value }))}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setIsUserModalOpen(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={createUserMutation.isPending || updateUserMutation.isPending}
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                      >
                        {editingUser ? 'Actualizar' : 'Crear'}
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
