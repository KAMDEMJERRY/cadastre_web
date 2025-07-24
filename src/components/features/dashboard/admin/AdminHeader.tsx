'use client';

import { useUser } from '@/context/UserContext';
import Link from 'next/link';

export default function AdminHeader() {
  const { user, logout } = useUser();

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <span className="text-2xl mr-2">🏘️</span>
        <h1 className="text-xl font-bold">CadastreWeb - Admin</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {user && (
          <div>
            <p className="font-semibold">{user.firstname} {user.lastname}</p>
            <p className="text-sm">ID: {user.id}</p>
          </div>
        )}
        <button 
          onClick={logout}
          className="text-sm hover:underline"
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
}