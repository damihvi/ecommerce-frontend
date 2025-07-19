import { useEffect, useState, useCallback, useRef } from 'react';
import { API_CONFIG, API_HEADERS, ADMIN_ROUTES } from '../routes';

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  active?: boolean;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchCategories = useCallback(async (page: number = 1, limit: number = 10) => {
    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const url = `${API_CONFIG.BASE_URL}${ADMIN_ROUTES.CATEGORIES.BASE}?page=${page}&limit=${limit}`;
      console.log('Fetching categories from:', url);

      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
        headers: {
          ...API_HEADERS.PRIVATE,
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('Categories API response:', data);

      if (!response.ok) {
        if (response.status === 403) {
          localStorage.removeItem('token');
          throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
        }
        throw new Error(data.message || 'Error al cargar las categorías');
      }

      if (data?.success) {
        const categoriesData = Array.isArray(data.data) ? data.data : (data.data?.items || []);
        console.log('Categories data to set:', categoriesData);
        
        if (!Array.isArray(categoriesData)) {
          console.error('Categories data is not an array:', categoriesData);
          throw new Error('Formato de datos inválido');
        }
        
        setCategories(categoriesData);
        
        if (data.meta) {
          setPagination({
            currentPage: data.meta.currentPage,
            totalPages: data.meta.totalPages,
            totalItems: data.meta.totalItems,
            itemsPerPage: data.meta.itemsPerPage
          });
        }
      } else {
        setCategories([]);
        setError('No se pudieron cargar las categorías');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar las categorías');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (categoryData: { name: string; description: string }) => {
    try {
      setIsCreating(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${ADMIN_ROUTES.CATEGORIES.CREATE}`, {
        method: 'POST',
        headers: {
          ...API_HEADERS.PRIVATE,
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error response:', response.status, response.statusText);
        throw new Error(data.message || 'Error al crear la categoría');
      }

      await fetchCategories(pagination.currentPage);
      return true;
    } catch (err) {
      console.error('Error creating category:', err);
      setError(err instanceof Error ? err.message : 'Error al crear la categoría');
      return false;
    } finally {
      setIsCreating(false);
    }
  }, [fetchCategories, pagination.currentPage]);

  const updateCategory = useCallback(async (id: number, categoryData: { name: string; description: string }) => {
    try {
      setIsUpdating(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${ADMIN_ROUTES.CATEGORIES.UPDATE(id.toString())}`, {
        method: 'PUT',
        headers: {
          ...API_HEADERS.PRIVATE,
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error response:', response.status, response.statusText);
        throw new Error(data.message || 'Error al actualizar la categoría');
      }

      await fetchCategories(pagination.currentPage);
      return true;
    } catch (err) {
      console.error('Error updating category:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar la categoría');
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [fetchCategories, pagination.currentPage]);

  const deleteCategory = useCallback(async (id: number) => {
    try {
      setIsDeleting(true);
      setError(null);
      
      // Mostrar confirmación antes de eliminar
      if (!window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
        setIsDeleting(false);
        return false;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${ADMIN_ROUTES.CATEGORIES.DELETE(id.toString())}`, {
        method: 'DELETE',
        headers: {
          ...API_HEADERS.PRIVATE,
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error response:', response.status, response.statusText);
        throw new Error(data.message || 'Error al eliminar la categoría');
      }

      await fetchCategories(pagination.currentPage);
      return true;
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar la categoría');
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [fetchCategories, pagination.currentPage]);

  const handlePageChange = useCallback((page: number) => {
    fetchCategories(page);
  }, [fetchCategories]);

  useEffect(() => {
    fetchCategories(1);
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    pagination,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    handlePageChange
  };
}

export default useCategories;
