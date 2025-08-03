"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Schéma de validation avec Zod
const formSchema = z.object({
  email: z.string().email("Veuillez entrer une adresse email valide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: unknown) => {
    console.log(data);
    // Ici vous ajouterez la logique de connexion
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-slate-50 dark:bg-slate-950">
      {/* Overlay (fond flouté) pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-white/5 dark:bg-slate-950/20 backdrop-blur-[1px]"></div>
      
      <main className="flex flex-col gap-8 row-start-2 items-center relative z-10 max-w-2xl mx-auto">
        <Card className="w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-200 dark:border-slate-800 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="text-6xl mb-4 mx-auto">
              🔐
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              Connexion
            </CardTitle>
            <CardDescription className="text-lg font-medium text-slate-700 dark:text-slate-300">
              Accédez à votre espace personnel
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                {/* Champ Email */}
                <div>
                  <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    className="mt-1 bg-white/80 dark:bg-slate-800/80"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message as string}</p>
                  )}
                </div>

                {/* Champ Mot de passe */}
                <div>
                  <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">
                    Mot de passe
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="mt-1 bg-white/80 dark:bg-slate-800/80"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password.message as string}</p>
                  )}
                </div>
              </div>

              {/* Bouton de soumission */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Se connecter
              </Button>

              {/* Lien vers la page d'accueil */}
              <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                <Link href="/" className="hover:underline">
                  Retour à l&apos;accueil
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <footer className="row-start-3 text-sm text-slate-600 dark:text-slate-400 relative z-10 text-center">
        <p>© {new Date().getFullYear()} Mon Application. Tous droits réservés.</p>
      </footer>
    </div>
  );
}