// context/UserContext.tsx
'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User } from '@/types/user';
import { loginUser } from '@/lib/api/auth';
import { LoginCredentials } from '@/types/auth.d';
import { fetchUserProfile } from '@/lib/api/user';
import { DEFAULT_USER } from '@/data/user';

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (credentials:LoginCredentials) => Promise<void>;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(()=> setUser(DEFAULT_USER), [])

  const login = async (credentials:LoginCredentials) => {
    try{
        const token = await loginUser(credentials.email, credentials.password);
        localStorage.setItem('access', token.access);
        localStorage.setItem('refresh', token.refresh);
        const userData = await fetchUserProfile(token.access);
        setUser(userData);
    } catch (error){
        console.error('Login error :', error);
        throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.setItem('access', "");
    localStorage.setItem('refresh', "");
    // Supprimer le token du localStorage/sessionStorage
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};