import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { usersAPI } from '../services/api';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'customer';
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
}

export const useUsers = () => {
  const queryClient = useQueryClient();

  // Fetch users
  const {
    data: users = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        console.log('Fetching users...');
        const response = await usersAPI.getAll({ page: 1, limit: 100 });
        console.log('Users API response:', response.data);
        
        // Handle paginated response
        if (response.data?.users && Array.isArray(response.data.users)) {
          console.log('Found users (paginated):', response.data.users.length);
          return response.data.users;
        }
        
        // Handle direct array response (backward compatibility)
        const usersArray = Array.isArray(response.data) ? response.data : [];
        console.log('Found users (direct):', usersArray.length);
        return usersArray;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: UserFormData) => {
      console.log('Creating user with data:', userData);
      const response = await usersAPI.create(userData);
      console.log('User created response:', response.data);
      return response.data;
    },
    onSuccess: (newUser) => {
      console.log('User created successfully:', newUser);
      toast.success('Usuario creado exitosamente');
      
      // Invalidate and refetch users
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.refetchQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      console.error('Error creating user:', error);
      const errorMessage = error.response?.data?.message || 'Error al crear el usuario';
      toast.error(errorMessage);
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, userData }: { id: string; userData: UserFormData }) => {
      console.log('Updating user:', id, 'with data:', userData);
      const response = await usersAPI.update(id, userData);
      console.log('User updated response:', response.data);
      return response.data;
    },
    onSuccess: (updatedUser) => {
      console.log('User updated successfully:', updatedUser);
      toast.success('Usuario actualizado exitosamente');
      
      // Invalidate and refetch users
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.refetchQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      console.error('Error updating user:', error);
      const errorMessage = error.response?.data?.message || 'Error al actualizar el usuario';
      toast.error(errorMessage);
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting user:', id);
      await usersAPI.delete(id);
      return id;
    },
    onSuccess: (deletedId) => {
      console.log('User deleted successfully:', deletedId);
      toast.success('Usuario eliminado exitosamente');
      
      // Invalidate and refetch users
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.refetchQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      console.error('Error deleting user:', error);
      const errorMessage = error.response?.data?.message || 'Error al eliminar el usuario';
      toast.error(errorMessage);
    },
  });

  // Update user role mutation
  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      console.log('Updating user role:', id, 'to role:', role);
      const response = await usersAPI.updateRole(id, role);
      console.log('User role updated response:', response.data);
      return response.data;
    },
    onSuccess: (updatedUser) => {
      console.log('User role updated successfully:', updatedUser);
      toast.success('Rol actualizado exitosamente');
      
      // Invalidate and refetch users
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.refetchQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      console.error('Error updating user role:', error);
      const errorMessage = error.response?.data?.message || 'Error al actualizar el rol';
      toast.error(errorMessage);
    },
  });

  // Helper functions
  const createUser = (userData: UserFormData) => {
    createUserMutation.mutate(userData);
  };

  const updateUser = (id: string, userData: UserFormData) => {
    updateUserMutation.mutate({ id, userData });
  };

  const deleteUser = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      deleteUserMutation.mutate(id);
    }
  };

  const updateUserRole = (id: string, role: string) => {
    updateUserRoleMutation.mutate({ id, role });
  };

  return {
    // Data
    users,
    isLoading,
    error,
    
    // Actions
    createUser,
    updateUser,
    deleteUser,
    updateUserRole,
    refetch,
    
    // Mutation states
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
    isUpdatingRole: updateUserRoleMutation.isPending,
  };
};
