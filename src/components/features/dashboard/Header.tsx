'use client';
import {useUser} from '@/context/UserContext';
import Button from '@/components/ui/Button1';

export default function Header() {
  const { user, logout } = useUser();

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg">
      <div className="container mx-auto px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏘️</span>
          <h1 className="text-xl font-bold">CadastreWeb</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <h3 className="font-semibold">{user?.name}</h3>
            <p className="text-sm opacity-90">ID: {user?.id}</p>
          </div>
          <Button variant="ghost" onClick={logout}>
            Déconnexion
          </Button>
        </div>
      </div>
    </header>
  );
}