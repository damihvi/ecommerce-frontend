import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, authAPI } from '../services/api';

// Types
interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'USER';
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
    console.log('AuthProvider - Token found:', !!token); // Debug log
    
    if (token) {
      try {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // Aquí podrías hacer una validación del token si es necesario
        console.log('AuthProvider - Token set in headers'); // Debug log
      } catch (error) {
        console.error('AuthProvider - Error setting token:', error);
        localStorage.removeItem('token');
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
        localStorage.setItem('token', token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('AuthProvider - Token saved and set'); // Debug log
      }
      
      if (userData) {
        setUser(userData);
        console.log('AuthProvider - User set:', userData); // Debug log
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

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
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
