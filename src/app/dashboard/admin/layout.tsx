// 'use client'
// import { AdminNav } from '@/components/features/admin/AdminNav';
// import { useUser } from '@/context/UserContext';

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const user = useUser();

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
//         <div className="flex items-center">
//           <span className="text-2xl mr-2">🏘️</span>
//           <h1 className="text-xl font-bold">CadastreWeb - Admin</h1>
//         </div>
//         <div className="flex items-center space-x-4">
//           <div>
//             <p className="font-semibold">{user?.user?.username}</p>
//             <p className="text-sm">ID: {user?.user?.id}</p>
//           </div>
//           <form action="/auth/signout" method="POST">
//             <button type="submit" className="text-sm hover:underline">
//               Déconnexion
//             </button>
//           </form>
//         </div>
//       </header>

//       {/* Navigation + Contenu */}
//       <div className="flex">
//         <AdminNav />
//         <main className="flex-1 p-6 max-w-7xl mx-auto">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }
import { ReactNode } from 'react';

import AdminHeader from '@/components/features/admin/AdminHeader';
import {AdminNav} from '@/components/features/admin/AdminNav';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-gray-100 font-sans">
        <AdminHeader />
        <AdminNav currentPage="parcelles" />
      <main className="max-w-7xl mx-auto p-6">{children}</main>
    </div>
  );
}