import React from 'react';
import { useUsers } from '../hooks/useUsers-fixed';

const UsersList = () => {
  const { users, loading, error } = useUsers();

  if (loading) return <div>Cargando usuarios...</div>;
  if (error) return <div>Error al cargar usuarios: {error}</div>;
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
};

export default UsersList;
