import { useEffect, useState, useCallback } from 'react';
import { API_CONFIG, API_HEADERS } from '../routes';

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

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    fetchCategories
  };
}

export default useCategories;
