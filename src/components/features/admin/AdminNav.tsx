'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/services/utils';

const navItems = [
  { name: 'Dashboard', href: '/dashboard/admin', icon: '📊', exact:true },
  { name: 'Lotissements', href: '/dashboard/admin/lotissements', icon: '🏡' , exact:false},
  { name: 'Blocs', href: '/dashboard/admin/blocs', icon: '🗺️', exact:false },
  { name: 'Parcelles', href: '/dashboard/admin/parcelles', icon: '📍', exact:false },
  { name: 'Propriétaires', href: '/dashboard/admin/proprietaires', icon: '👤' , exact:false},
];

export function AdminNav() {
  const pathname = usePathname();

  // Ne pas afficher la nav sur la page d'accueil admin
  if (pathname === '/dashboard/admin') {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard/admin" className="text-xl font-bold text-gray-900">
              CadastreWeb
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = item.exact 
                ? pathname === item.href
                : pathname.startsWith(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative flex items-center px-4 py-2 text-sm font-medium rounded-full transition-all',
                    'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60',
                    isActive 
                      ? 'text-blue-600 hover:text-blue-700 bg-blue-50/50'
                      : ''
                  )}
                >
                  <span className="mr-2 text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center">
            <div className="ml-4 flex items-center md:ml-6">
              <button 
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Menu utilisateur"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
                  AU
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}