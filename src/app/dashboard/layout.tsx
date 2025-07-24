// /dashboard/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tableau de bord',
  description: 'Espace administrateur',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <h1>Tableau de bord</h1>
        {/* Ajoutez ici une barre de navigation ou d'autres éléments communs */}
      </header>
      
      <main className="dashboard-main">
        {children}
      </main>
      
      <footer className="dashboard-footer">
        © {new Date().getFullYear()} - Votre application
      </footer>
    </div>
  )
}