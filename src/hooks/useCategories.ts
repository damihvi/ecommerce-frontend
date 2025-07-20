import { useEffect, useState, useCallback } from 'react';
import { API_CONFIG, API_HEADERS } from '../routes';

interface Category {
  id: string;
  name: string;
  description?: string;
  active?: boolean;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_CONFIG.BASE_URL}/categories`, {
        headers: {
          ...API_HEADERS.PUBLIC,
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar categorías');
      }

      const data = await response.json();
      console.log('Categories API response:', data);

      if (data?.success) {
        const categoriesData = data.data || [];
        setCategories(categoriesData);
        
        // Configurar paginación simple
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: categoriesData.length,
          itemsPerPage: categoriesData.length
        });
      } else {
        throw new Error(data.message || 'Error desconocido');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (categoryData: { name: string; description: string }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_CONFIG.BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          ...API_HEADERS.PRIVATE,
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(categoryData)
      });

      if (!response.ok) {
        throw new Error('Error al crear categoría');
      }

      const data = await response.json();
      if (data?.success) {
        await fetchCategories();
      } else {
        throw new Error(data.message || 'Error al crear categoría');
      }
    } catch (err) {
      console.error('Error creating category:', err);
      setError(err instanceof Error ? err.message : 'Error al crear categoría');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  const updateCategory = useCallback(async (id: string, categoryData: { name: string; description: string }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_CONFIG.BASE_URL}/categories/${id}`, {
        method: 'PUT',
        headers: {
          ...API_HEADERS.PRIVATE,
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(categoryData)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar categoría');
      }

      const data = await response.json();
      if (data?.success) {
        await fetchCategories();
      } else {
        throw new Error(data.message || 'Error al actualizar categoría');
      }
    } catch (err) {
      console.error('Error updating category:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar categoría');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_CONFIG.BASE_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: {
          ...API_HEADERS.PRIVATE,
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar categoría');
      }

      const data = await response.json();
      if (data?.success) {
        await fetchCategories();
      } else {
        throw new Error(data.message || 'Error al eliminar categoría');
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar categoría');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    pagination,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  };
}

export default useCategories;
