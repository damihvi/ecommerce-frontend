import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { usersAPI } from '../services/api';

export default function UsersList() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await usersAPI.getAll({ page: 1, limit: 100 });
      if (response.data?.users && Array.isArray(response.data.users)) {
        return response.data.users;
      }
      return Array.isArray(response.data) ? response.data : [];
    },
  });

  if (isLoading) return <div>Cargando usuarios...</div>;
  if (error) return <div>Error al cargar usuarios</div>;
  if (!users || users.length === 0) return <div>No hay usuarios registrados</div>;

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Usuario</th>
            <th>Email</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
