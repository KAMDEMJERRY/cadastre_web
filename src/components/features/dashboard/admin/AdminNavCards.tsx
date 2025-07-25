'use client'
import Link from 'next/link';
import Card from '@/components/layout/Card1';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    id: 'lotissements',
    icon: '🏡',
    title: 'Gestion des Lotissements',
    description: 'Créer, modifier, supprimer des lotissements',
  },
  {
    id: 'blocs',
    icon: '🗺️',
    title: 'Gestion des Blocs',
    description: 'Configurer les blocs et leurs rues',
  },
  {
    id: 'parcelles',
    icon: '📍',
    title: 'Gestion des Parcelles',
    description: 'Assigner et configurer les parcelles',
  },
  {
    id: 'proprietaires',
    icon: '👤',
    title: 'Gestion des Propriétaires',
    description: 'Enregistrer et associer les propriétaires',
  },
];
export default function AdminNavCards() {
  const pathname = usePathname();

  return (
    <section className="mb-8">
      <nav className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={`${pathname.replace(/\/$/, '')}/${item.id}`}
          >
            <Card className="hover:bg-blue-50 text-center h-full">
              <span className="text-2xl">{item.icon}</span>
              <h3 className="text-lg font-semibold mt-2">{item.title}</h3>
              <p className="text-gray-600 mt-1">{item.description}</p>
            </Card>
          </Link>
        ))}
      </nav>
    </section>
  );
} 