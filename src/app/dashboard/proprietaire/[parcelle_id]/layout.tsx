import { ReactNode } from 'react';
// import { Breadcrumb } from '@/components/ui/breadcrumb';
// import { OwnerSidebar } from '@/components/proprietaire/OwnerSidebar';

type Props = {
  children: ReactNode;
  params: { id: string };
};

export default function OwnerLayout({ children, params }: Props) {
  return (
    <div className="space-y-6">
      {/* Fil d'Ariane */}
      {/* <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Propriétaires', href: '/dashboard/proprietaires' },
          { label: `Propriétaire #${params.id}`, href: '#' },
        ]}
      /> */}

      {/* En-tête avec titre */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Fiche Propriétaire
        </h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Éditer
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Imprimer
          </button>
        </div>
      </div>

      {/* Contenu principal avec sidebar */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar avec infos propriétaire */}
        {/* <OwnerSidebar ownerId={params.id} /> */}

        {/* Contenu dynamique */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          {children}
        </div>
      </div>
    </div>
  );
}