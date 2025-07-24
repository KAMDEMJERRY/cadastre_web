// /dashboard/proprietaire/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Propriétaire Dashboard',
}

export default function ProprietaireLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="proprietaire-layout">
      <header>Propriétaire Header</header>
      <main>{children}</main>
      <footer>Propriétaire Footer</footer>
    </div>
  )
}