import { useEffect, useState, useCallback } from 'react';
import { categoriesAPI } from '../services/api';

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

  const fetchCategories = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await categoriesAPI.getAll({
        page,
        limit: pagination.itemsPerPage
      });
      const { data } = response;

      if (data && (Array.isArray(data.items) || Array.isArray(data))) {
        const categoriesData = data.items || data;
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
      setLoading(true);
      setError(null);
      await categoriesAPI.create(categoryData);
      await fetchCategories(pagination.currentPage);
      return true;
    } catch (err) {
      console.error('Error creating category:', err);
      setError(err instanceof Error ? err.message : 'Error al crear la categoría');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories, pagination.currentPage]);

  const updateCategory = useCallback(async (id: number, categoryData: { name: string; description: string }) => {
    try {
      setLoading(true);
      setError(null);
      await categoriesAPI.update(id, categoryData);
      await fetchCategories(pagination.currentPage);
      return true;
    } catch (err) {
      console.error('Error updating category:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar la categoría');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories, pagination.currentPage]);

  const deleteCategory = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // Mostrar confirmación antes de eliminar
      if (!window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
        setLoading(false);
        return false;
      }

      await categoriesAPI.delete(id);
      await fetchCategories(pagination.currentPage);
      return true;
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar la categoría');
      return false;
    } finally {
      setLoading(false);
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
    pagination,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    handlePageChange
  };
}

export default useCategories;
