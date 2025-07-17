import { useEffect, useState, useRef, useCallback } from 'react';
import { API_CONFIG, API_HEADERS, ADMIN_ROUTES } from '../routes';
import { User, UserFormData, Pagination } from '../types';

const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchUsers = useCallback(async (page: number = 1) => {
    try {
      // Cancelar petición anterior si existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Crear nuevo controller para esta petición
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_CONFIG.BASE_URL}${ADMIN_ROUTES.USERS.LIST}?page=${page}`, {
        signal: abortControllerRef.current.signal,
        headers: {
          ...API_HEADERS.PRIVATE,
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Error al cargar usuarios');
      
      const data = await response.json();
      console.log('Users API response:', data);

      if (data?.success) {
        const usersData = data.data?.items || data.data || [];
        setUsers(usersData);
        
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
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setUsers([]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  const createUser = useCallback(async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsCreating(true);
    setError(null);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${ADMIN_ROUTES.USERS.CREATE}`, {
        method: 'POST',
        headers: {
          ...API_HEADERS.PRIVATE,
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) throw new Error('Error al crear usuario');
      
      const data = await response.json();
      if (data?.success) {
        // Refetch para actualizar lista
        await fetchUsers(pagination.currentPage);
      } else {
        throw new Error(data.message || 'Error al crear usuario');
      }
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err instanceof Error ? err.message : 'Error al crear usuario');
    } finally {
      setIsCreating(false);
    }
  }, [fetchUsers, pagination.currentPage]);

  const updateUser = useCallback(async (id: string, userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setIsUpdating(true);
    setError(null);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${ADMIN_ROUTES.USERS.UPDATE(id)}`, {
        method: 'PATCH',
        headers: {
          ...API_HEADERS.PRIVATE,
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) throw new Error('Error al actualizar usuario');
      
      const data = await response.json();
      if (data?.success) {
        // Refetch para actualizar lista
        await fetchUsers(pagination.currentPage);
      } else {
        throw new Error(data.message || 'Error al actualizar usuario');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar usuario');
    } finally {
      setIsUpdating(false);
    }
  }, [fetchUsers, pagination.currentPage]);

  const deleteUser = useCallback(async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return;
    }

    setIsDeleting(true);
    setError(null);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${ADMIN_ROUTES.USERS.DELETE(id)}`, {
        method: 'DELETE',
        headers: {
          ...API_HEADERS.PRIVATE,
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Error al eliminar usuario');
      
      const data = await response.json();
      if (data?.success) {
        // Refetch para actualizar lista
        await fetchUsers(pagination.currentPage);
      } else {
        throw new Error(data.message || 'Error al eliminar usuario');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar usuario');
    } finally {
      setIsDeleting(false);
    }
  }, [fetchUsers, pagination.currentPage]);

  const toggleUserActive = useCallback(async (id: string, active: boolean) => {
    await updateUser(id, { active });
  }, [updateUser]);

  const updateUserRole = useCallback(async (id: string, role: string) => {
    setIsUpdatingRole(true);
    try {
      await updateUser(id, { role });
    } finally {
      setIsUpdatingRole(false);
    }
  }, [updateUser]);

  const goToPage = useCallback((page: number) => {
    fetchUsers(page);
  }, [fetchUsers]);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers(1);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    pagination,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserActive,
    updateUserRole,
    goToPage,
    isCreating,
    isUpdating,
    isDeleting,
    isUpdatingRole
  };
};

export { useUsers };
