import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
}

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    email: '', 
    username: '',
    password: '',
    role: 'user' as 'user' | 'admin', 
    isActive: true 
  });
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching users with token:', token ? 'Present' : 'Missing');
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('https://damihvi.onrender.com/api/users', {
        method: 'GET',
        headers
      });
      
      console.log('Users response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Users response:', data); // Debug log
        
        // Validar que sea un array
        if (Array.isArray(data)) {
          setUsers(data);
        } else if (data && Array.isArray(data.data)) {
          setUsers(data.data);
        } else {
          console.error('Invalid users format:', data);
          setUsers([]);
        }
      } else {
        const errorText = await response.text();
        console.error('Users API error:', response.status, errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Error de conexión: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('UsersList useEffect triggered, currentUser:', currentUser);
    if (currentUser?.role === 'admin') {
      console.log('User is admin, fetching users...');
      fetchUsers();
    } else {
      console.log('User is not admin or not logged in');
    }
  }, [currentUser?.role]); // Solo depender del rol, no de todo el objeto currentUser

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const url = editingUser 
        ? `https://damihvi.onrender.com/api/users/${editingUser.id}`
        : 'https://damihvi.onrender.com/api/users';
      
      const method = editingUser ? 'PUT' : 'POST';

      // Preparar el body según si es creación o actualización
      let bodyData: any;
      if (editingUser) {
        // Para actualización, solo enviar campos que pueden cambiar
        bodyData = {
          isActive: formData.isActive
        };
        // Solo incluir password si se proporcionó uno nuevo
        if (formData.password.trim()) {
          bodyData.password = formData.password;
        }
      } else {
        // Para creación, enviar todos los campos obligatorios
        bodyData = {
          email: formData.email,
          username: formData.username,
          password: formData.password,
          role: formData.role,
          isActive: formData.isActive
        };
      }

      console.log('Sending user data:', method, bodyData);

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(bodyData),
      });

      console.log('User submit response status:', response.status);

      if (response.ok) {
        fetchUsers();
        setShowModal(false);
        setEditingUser(null);
        setShowPassword(false);
        setFormData({ email: '', username: '', password: '', role: 'user', isActive: true });
      } else {
        const errorText = await response.text();
        console.error('User submit error:', response.status, errorText);
        setError(`Error al guardar usuario: ${response.status} - ${errorText}`);
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowPassword(false);
    setFormData({
      email: user.email,
      username: user.email.split('@')[0], // Generar username del email como fallback
      password: '', // No mostrar password existente
      role: user.role,
      isActive: user.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`https://damihvi.onrender.com/api/users/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (response.ok) {
        fetchUsers();
      } else {
        setError('Error al eliminar usuario');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`https://damihvi.onrender.com/api/users/${userId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          isActive: !currentStatus
        }),
      });

      if (response.ok) {
        fetchUsers();
      } else {
        setError('Error al cambiar estado del usuario');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setShowPassword(false);
    setFormData({ email: '', username: '', password: '', role: 'user', isActive: true });
    setShowModal(true);
  };

  // Solo mostrar para administradores
  if (currentUser?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600">No tienes permisos para ver esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <button
        onClick={openCreateModal}
        className="mb-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Crear Nuevo Usuario
      </button>

      {loading ? (
        <div className="text-center">Cargando...</div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => toggleUserStatus(user.id, user.isActive)}
                      className={`mr-2 p-2 rounded-full transition-colors ${
                        user.isActive 
                          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                      }`}
                      title={user.isActive ? 'Desactivar usuario' : 'Activar usuario'}
                    >
                      {user.isActive ? (
                        // Icono simple de "X" para desactivar
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636L5.636 18.364m0-12.728L18.364 18.364" />
                        </svg>
                      ) : (
                        // Icono simple de "check" para activar
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4 p-2 rounded-full hover:bg-indigo-100 transition-colors"
                      title="Editar usuario"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition-colors"
                      title="Eliminar usuario"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0016.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  {editingUser ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required={!editingUser}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m-3.122-3.122l-3-3m3 3l3 3m0 0l3-3m-3 3v3" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Rol
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'admin' })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Usuario activo</span>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {loading ? 'Guardando...' : (editingUser ? 'Actualizar' : 'Crear')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setShowPassword(false);
                  }}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
