import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, authAPI } from '../services/api';
import { UserRole, ROLES_KEY, TOKEN_KEY } from '../constants/roles';

// Types
interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LoginCredentials {
  identifier: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  userRoles: UserRole[];
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const storedRoles = localStorage.getItem(ROLES_KEY);
    console.log('AuthProvider - Token found:', !!token); // Debug log
    
    if (token) {
      try {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        if (storedRoles) {
          const roles = JSON.parse(storedRoles);
          setUserRoles(roles);
          apiClient.defaults.headers.common['X-User-Roles'] = storedRoles;
        }
        
        // Validar el token obteniendo el perfil del usuario
        authAPI.getProfile()
          .then(response => {
            const userData = response.data;
            setUser(userData);
            const roles = [userData.role];
            setUserRoles(roles);
            localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
            apiClient.defaults.headers.common['X-User-Roles'] = JSON.stringify(roles);
          })
          .catch(() => {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(ROLES_KEY);
            delete apiClient.defaults.headers.common['Authorization'];
            delete apiClient.defaults.headers.common['X-User-Roles'];
          });
      } catch (error) {
        console.error('AuthProvider - Error setting token:', error);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(ROLES_KEY);
      }
    }
    
    setLoading(false);
    console.log('AuthProvider - Loading complete'); // Debug log
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('AuthProvider - Login attempt started'); // Debug log
      const response = await authAPI.login({ 
        identifier: credentials.identifier, 
        password: credentials.password 
      });
      console.log('Login response:', response.data); // Debug log
      
      // Manejar diferentes estructuras de respuesta
      let token, userData;
      
      if (response.data.success) {
        // Estructura: { success: true, data: { token, user } }
        token = response.data.data?.token || response.data.data?.access_token;
        userData = response.data.data?.user || response.data.data;
      } else {
        // Estructura directa: { token, user } o { access_token, user }
        token = response.data.token || response.data.access_token;
        userData = response.data.user || response.data;
      }
      
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('AuthProvider - Token saved and set'); // Debug log
      }
      
      if (userData) {
        setUser(userData);
        const roles = [userData.role];
        setUserRoles(roles);
        localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
        apiClient.defaults.headers.common['X-User-Roles'] = JSON.stringify(roles);
        console.log('AuthProvider - User and roles set:', userData, roles); // Debug log
      }
      
      console.log('User set:', userData); // Debug log
      console.log('Token saved:', token); // Debug log
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const response = await authAPI.register({
        username: `${credentials.firstName} ${credentials.lastName}`,
        email: credentials.email,
        password: credentials.password
      });
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const hasRole = (role: UserRole): boolean => {
    return userRoles.includes(role);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    hasRole,
    userRoles
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
