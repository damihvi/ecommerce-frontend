import { useEffect, useState, useRef, useCallback } from 'react';
import { API_CONFIG, API_HEADERS, ADMIN_ROUTES } from '../routes';

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface Category {
  id: number;
  name: string;
  description?: string;
  active?: boolean;
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
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchCategories = useCallback(async (page: number = 1) => {
    try {
      // Cancelar petición anterior si existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Crear nuevo controller para esta petición
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);

      const response = await fetch(`${API_CONFIG.BASE_URL}${ADMIN_ROUTES.CATEGORIES.BASE}?page=${page}`, {
        signal: abortControllerRef.current.signal,
        headers: {
          ...API_HEADERS.PRIVATE,
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Error al cargar categorías');
      
      const data = await response.json();
      console.log('Categories API response:', data);

      if (data?.success) {
        const categoriesData = data.data?.items || data.data || [];
        setCategories(categoriesData);
        
        // Actualizar paginación si viene del backend
        if (data.data?.meta) {
          setPagination({
            currentPage: data.data.meta.currentPage,
            totalPages: data.data.meta.totalPages,
            totalItems: data.data.meta.totalItems,
            itemsPerPage: data.data.meta.itemsPerPage
          });
        }
      } else {
        throw new Error(data.message || 'Error desconocido');
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('Fetch aborted');
        return;
      }
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setCategories([]);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  const createCategory = useCallback(async (categoryData: Omit<Category, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${ADMIN_ROUTES.CATEGORIES.CREATE}`, {
        method: 'POST',
        headers: {
          ...API_HEADERS.PRIVATE,
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(categoryData)
      });
      
      if (!response.ok) throw new Error('Error al crear categoría');
      
      const data = await response.json();
      if (data?.success) {
        // Refetch para actualizar lista
        await fetchCategories(pagination.currentPage);
      } else {
        throw new Error(data.message || 'Error al crear categoría');
      }
    } catch (err) {
      console.error('Error creating category:', err);
      setError(err instanceof Error ? err.message : 'Error al crear categoría');
    } finally {
      setLoading(false);
    }
  }, [fetchCategories, pagination.currentPage]);

  const updateCategory = useCallback(async (id: number, categoryData: Partial<Category>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${ADMIN_ROUTES.CATEGORIES.UPDATE(id.toString())}`, {
        method: 'PATCH',
        headers: {
          ...API_HEADERS.PRIVATE,
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(categoryData)
      });
      
      if (!response.ok) throw new Error('Error al actualizar categoría');
      
      const data = await response.json();
      if (data?.success) {
        // Refetch para actualizar lista
        await fetchCategories(pagination.currentPage);
      } else {
        throw new Error(data.message || 'Error al actualizar categoría');
      }
    } catch (err) {
      console.error('Error updating category:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar categoría');
    } finally {
      setLoading(false);
    }
  }, [fetchCategories, pagination.currentPage]);

  const deleteCategory = useCallback(async (id: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${ADMIN_ROUTES.CATEGORIES.DELETE(id.toString())}`, {
        method: 'DELETE',
        headers: {
          ...API_HEADERS.PRIVATE,
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Error al eliminar categoría');
      
      const data = await response.json();
      if (data?.success) {
        // Refetch para actualizar lista
        await fetchCategories(pagination.currentPage);
      } else {
        throw new Error(data.message || 'Error al eliminar categoría');
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar categoría');
    } finally {
      setLoading(false);
    }
  }, [fetchCategories, pagination.currentPage]);

  const toggleCategoryActive = useCallback(async (id: number, active: boolean) => {
    await updateCategory(id, { active });
  }, [updateCategory]);

  const goToPage = useCallback((page: number) => {
    fetchCategories(page);
  }, [fetchCategories]);

  // Cargar categorías al montar el componente
  useEffect(() => {
    fetchCategories(1);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    pagination,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryActive,
    goToPage
  };
}

export default useCategories;
