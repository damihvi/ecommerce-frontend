import { useEffect, useState } from 'react';

interface Category {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://ecommerce-backend-8djv.onrender.com/api/categories');
      
      if (!response.ok) {
        throw new Error('Error al cargar categorías');
      }
      
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: Omit<Category, 'id'>) => {
    try {
      setLoading(true);
      const response = await fetch('https://ecommerce-backend-8djv.onrender.com/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error('Error al crear categoría');
      }

      await fetchCategories();
    } catch (err) {
      console.error('Error creating category:', err);
      setError(err instanceof Error ? err.message : 'Error al crear categoría');
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    try {
      setLoading(true);
      const response = await fetch(`https://ecommerce-backend-8djv.onrender.com/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar categoría');
      }

      await fetchCategories();
    } catch (err) {
      console.error('Error updating category:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar categoría');
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`https://ecommerce-backend-8djv.onrender.com/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar categoría');
      }

      await fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar categoría');
    }
  };

  const toggleCategoryActive = async (id: string) => {
    const category = categories.find(cat => cat.id === id);
    if (category) {
      await updateCategory(id, { isActive: !category.isActive });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryActive
  };
}

export default useCategories;
