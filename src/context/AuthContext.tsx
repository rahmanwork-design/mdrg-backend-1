import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authAPI, storage } from '@/services/api';

interface User {
  client_id: string;
  email: string;
  first_name: string;
  last_name: string;
  company_name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  company_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postcode?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = storage.getToken();
      const savedUser = storage.getUser();
      
      if (token && savedUser) {
        try {
          // Verify token is still valid by fetching profile
          const response = await authAPI.getProfile();
          if (response.success) {
            setUser(savedUser);
          } else {
            // Token invalid, clear storage
            storage.clear();
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          storage.clear();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success && response.data) {
        const { token, ...userData } = response.data;
        storage.setToken(token);
        storage.setUser(userData);
        setUser(userData);
        return { success: true };
      }
      
      return { success: false, message: response.message };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Login failed. Please try again.' 
      };
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await authAPI.register(userData);
      
      if (response.success && response.data) {
        const { token, ...newUser } = response.data;
        storage.setToken(token);
        storage.setUser(newUser);
        setUser(newUser);
        return { success: true };
      }
      
      return { success: false, message: response.message };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    storage.clear();
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      storage.setUser(updatedUser);
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
