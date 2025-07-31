import Link from "next/link";
import { metadata } from "@/app/layout";

export default function Home() {
  return (
    <div 
      className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20"
      style={{
        backgroundImage: `url('assets/connexion_bg.svg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay léger pour améliorer la lisibilité si nécessaire */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
      
      <main className="flex flex-col gap-8 row-start-2 items-center relative z-10">
        {/* Logo emoji remplaçant l'image */}
        <div className="text-8xl mb-4">
          🏘️
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Bienvenue sur {String(metadata.title ?? "CadastreWeb")}
        </h1>

        <p className="text-center max-w-md text-gray-700">
          Administrez et consultez vos donnees cadastrales.
        </p>
        
        <div className="flex gap-4">
          <Link
            href="/accounts/login"
            className="rounded-full bg-indigo-600 text-white px-6 py-3 hover:bg-indigo-700 transition-colors font-medium shadow-lg hover:shadow-xl"
          >
            Se connecter
          </Link>
        </div>
      </main>
      
      <footer className="row-start-3 text-sm text-gray-600 dark:text-gray-400 relative z-10">
        © {new Date().getFullYear()} Mon Application. Tous droits réservés.
      </footer>
    </div>
  );
}