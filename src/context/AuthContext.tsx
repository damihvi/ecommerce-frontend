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
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Verify token and get user info
          const response = await apiClient.get('/auth/profile');
          console.log('Profile response:', response.data); // Debug log
          
          // Manejar diferentes estructuras de respuesta
          let userData;
          if (response.data.success) {
            userData = response.data.data || response.data.user;
          } else {
            userData = response.data.user || response.data;
          }
          
          if (userData) {
            setUser(userData);
            console.log('User profile loaded:', userData); // Debug log
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
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
      }
      
      if (userData) {
        setUser(userData);
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
