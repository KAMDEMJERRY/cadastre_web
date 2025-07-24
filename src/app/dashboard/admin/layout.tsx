import { AppProviders } from '@/context/LotissementContext';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CadastreWeb - Administration',
  description: 'Interface d\'administration du système cadastral',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={`${inter.className} bg-gray-50`}>

          <div className="min-h-screen flex flex-col">
              <main className="flex-1 p-6 overflow-auto">
                {children}
              </main>
          </div>
          
      </body>
    </html>
  );
}