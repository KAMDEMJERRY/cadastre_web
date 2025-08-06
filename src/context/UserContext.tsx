// context/UserContext.tsx
'use client';

import { createContext, ReactNode, useState, useEffect } from 'react';
import { User } from '@/types/user';
import { accountAPI } from '@/services/api/auth';
import { LoginCredentials } from '@/types/auth';

type UserContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: User) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  loading: boolean;
  error: string | null;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Initialisé à true pour le chargement initial
  const [error, setError] = useState<string | null>(null);

  // Calculé à partir de l'état user
  const isAuthenticated = !!user;

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (accountAPI.isAuthenticated()) {
          const profile = await accountAPI.getProfile();
          setUser(profile);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
        setError('Failed to load user profile');
        accountAPI.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

const handleLogin = async (credentials: LoginCredentials) => {
  console.log("UseProvider: Hello world");
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  setUser(null);
  
  setLoading(true);
  setError(null);
  
  try {
    console.log("UseProvider- handleLogin-try: Hello world");

    // 1. Authentification (obtention des tokens)
    const loginResponse = await accountAPI.login(credentials);
    console.log("Login successful:"+loginResponse);
    
    
    // 3. Petit délai pour s'assurer que le token est bien disponible
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // 4. Récupération du profil utilisateur avec le nouveau token
    const userProfile = await accountAPI.getProfile();
    

    // 5. Mise à jour de l'état avec les données utilisateur
    setUser(userProfile);
    
    window.location.href = userProfile.role === 'admin' 
      ? '/dashboard/admin' 
      : '/dashboard/proprietaire';

  } catch (err) {
    console.error("Login error:", err);
    
    // Nettoyer les tokens en cas d'erreur
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    const errorMessage = err instanceof Error ? err.message : 'Login failed';
    setError(errorMessage);
    

    
  } finally {
    setLoading(false);
  }
};

  const handleRegister = async (userData: User) => {
    setLoading(true);
    setError(null);
    try {
      const userProfile = await accountAPI.register(userData);
      setUser(userProfile);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    accountAPI.logout();
    setUser(null);
    setError(null);
  };

  const handleRefreshToken = async () => {
    setLoading(true);
    try {
      await accountAPI.refreshToken();
      const profile = await accountAPI.getProfile();
      setUser(profile);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Token refresh failed';
      setError(errorMessage);
      handleLogout();
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        refreshToken: handleRefreshToken,
        loading,
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

