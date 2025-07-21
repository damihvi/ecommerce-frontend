import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, authAPI } from '../services/api';

// Types
interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface LoginCredentials {
  email: string;
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
  hasRole: (role: string) => boolean;
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(parsedUser);
      } catch (error) {
        // Si hay error parseando, limpiar datos
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authAPI.login({
        email: credentials.email,
        password: credentials.password
      });

      const { token, user: userData } = response.data.data;

      if (token) {
        localStorage.setItem('token', token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
    } catch (error: any) {
      // Better error handling for timeout and connection issues
      if (error.code === 'ECONNABORTED') {
        throw new Error('El servidor está iniciando. Esto puede tomar unos minutos en el primer acceso. Por favor, intenta nuevamente.');
      } else if (error.response?.status === 401) {
        throw new Error('Credenciales incorrectas');
      } else if (error.response?.status >= 500) {
        throw new Error('Error del servidor. Por favor, intenta más tarde.');
      } else if (!error.response) {
        throw new Error('No se puede conectar al servidor. Verifica tu conexión a internet.');
      }
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

      const { token, user: userData } = response.data.data;

      if (token) {
        localStorage.setItem('token', token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete apiClient.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const hasRole = (role: string): boolean => {
    return user?.role === role || user?.role === 'admin';
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
