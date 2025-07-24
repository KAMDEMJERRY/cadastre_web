import Image from "next/image";
import Link from "next/link";




export default function Home() {

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        
        <h1 className="text-2xl font-bold text-center">
          Bienvenue sur notre application
        </h1>
        
        <p className="text-center max-w-md">
          Connectez-vous pour accéder à toutes les fonctionnalités de notre plateforme.
        </p>

        <div className="flex gap-4">
          <Link
            // href="/accounts/login"
            href="/dashboard/admin/"
            className="rounded-full bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 transition-colors font-medium"
          >
            Se connecter
          </Link>
        </div>
      </main>

      <footer className="row-start-3 text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Mon Application. Tous droits réservés.
      </footer>
    </div>
  );
}