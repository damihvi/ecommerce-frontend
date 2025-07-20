import { useEffect, useState, useRef, useCallback } from 'react';
import { API_CONFIG, API_HEADERS } from '../routes';

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

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
  active?: boolean;
  featured?: boolean;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchProducts = useCallback(async (page: number = 1) => {
    try {
      // Cancelar petición anterior si existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Crear nuevo controller para esta petición
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);

      const response = await fetch(`${API_CONFIG.BASE_URL}/products`, {
        signal: abortControllerRef.current.signal,
        headers: {
          ...API_HEADERS.PUBLIC,
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Error al cargar productos');
      
      const data = await response.json();
      console.log('Products API response:', data);

      if (data?.success) {
        const productsData = data.data || [];
        setProducts(productsData);
        
        // Configurar paginación simple ya que el backend no devuelve meta
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: productsData.length,
          itemsPerPage: productsData.length
        });
      } else {
        throw new Error(data.message || 'Error desconocido');
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('Fetch aborted');
        return;
      }
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setProducts([]);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  const createProduct = useCallback(async (productData: Omit<Product, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/products`, {
        method: 'POST',
        headers: {
          ...API_HEADERS.PRIVATE,
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) throw new Error('Error al crear producto');
      
      const data = await response.json();
      if (data?.success) {
        // Refetch para actualizar lista
        await fetchProducts(pagination.currentPage);
      } else {
        throw new Error(data.message || 'Error al crear producto');
      }
    } catch (err) {
      console.error('Error creating product:', err);
      setError(err instanceof Error ? err.message : 'Error al crear producto');
    } finally {
      setLoading(false);
    }
  }, [fetchProducts, pagination.currentPage]);

  const updateProduct = useCallback(async (id: number, productData: Partial<Product>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          ...API_HEADERS.PRIVATE,
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) throw new Error('Error al actualizar producto');
      
      const data = await response.json();
      if (data?.success) {
        // Refetch para actualizar lista
        await fetchProducts(pagination.currentPage);
      } else {
        throw new Error(data.message || 'Error al actualizar producto');
      }
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar producto');
    } finally {
      setLoading(false);
    }
  }, [fetchProducts, pagination.currentPage]);

  const deleteProduct = useCallback(async (id: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          ...API_HEADERS.PRIVATE,
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Error al eliminar producto');
      
      const data = await response.json();
      if (data?.success) {
        // Refetch para actualizar lista
        await fetchProducts(pagination.currentPage);
      } else {
        throw new Error(data.message || 'Error al eliminar producto');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar producto');
    } finally {
      setLoading(false);
    }
  }, [fetchProducts, pagination.currentPage]);

  const toggleProductActive = useCallback(async (id: number, active: boolean) => {
    await updateProduct(id, { active });
  }, [updateProduct]);

  const toggleProductFeatured = useCallback(async (id: number, featured: boolean) => {
    await updateProduct(id, { featured });
  }, [updateProduct]);

  const goToPage = useCallback((page: number) => {
    fetchProducts(page);
  }, [fetchProducts]);

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts(1);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductActive,
    toggleProductFeatured,
    goToPage
  };
}

export default useProducts;
