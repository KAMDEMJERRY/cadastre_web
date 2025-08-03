// app/proprietaire/layout.tsx ou components/layout/ProprietaireLayout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProprietaireProfile } from '@/types/proprietaire';

interface ProprietaireLayoutProps {
  children: React.ReactNode;
}

export default function ProprietaireLayout({ children }: ProprietaireLayoutProps) {
//   const router = useRouter();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Vérification de l'authentification
//     const checkAuth = async () => {
//       try {
//         // Vérifier le token JWT ou la session
//         const token = localStorage.getItem('proprietaire_token');
        
//         if (!token) {
//           router.push('/login');
//           return;
//         }

//         // Validation du token côté serveur
//         // const response = await fetch('/api/auth/verify', {
//         //   headers: { Authorization: `Bearer ${token}` }
//         // });
        
//         // if (!response.ok) {
//         //   localStorage.removeItem('proprietaire_token');
//         //   router.push('/login');
//         //   return;
//         // }

//         setIsAuthenticated(true);
//       } catch (error) {
//         console.error('Erreur d\'authentification:', error);
//         router.push('/login');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkAuth();
//   }, [router]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-slate-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-slate-600">Chargement...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return null; // Redirection en cours
//   }

  return (
    <div className="min-h-screen bg-slate-50">
      {children}
    </div>
  );
}

// Hook personnalisé pour la gestion de l'authentification
export function useProprietaireAuth() {
  const [profile, setProfile] = useState<ProprietaireProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('proprietaire_token');
        
        if (!token) {
          router.push('/login');
          return;
        }

        // Charger le profil utilisateur
        // const response = await fetch('/api/proprietaire/profile', {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        
        // if (response.ok) {
        //   const profileData = await response.json();
        //   setProfile(profileData);
        // } else {
        //   throw new Error('Profil non trouvé');
        // }

        // Pour la démonstration, utiliser les données mock
        const mockProfile: ProprietaireProfile = {
          id: "usr_001",
          idCadastrale: "CAD2024001234",
          cni: "123456789",
          nom: "Jean-Pierre KAMGANG",
          email: "jp.kamgang@email.cm",
          type: "privé",
          role: "proprietaire",
          status: "actif"
        };
        setProfile(mockProfile);

      } catch (error) {
        console.error('Erreur de chargement du profil:', error);
        localStorage.removeItem('proprietaire_token');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const logout = () => {
    localStorage.removeItem('proprietaire_token');
    setProfile(null);
    router.push('/login');
  };

  return { profile, isLoading, logout };
}