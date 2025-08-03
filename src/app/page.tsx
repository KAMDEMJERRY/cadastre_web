import Link from "next/link";
import { metadata } from "@/app/layout";
import { Button } from "@/components/ui/button";
import {  Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Admin =  "dashboard/admin";
const Login = "login";

export default function Home(){
  return (
    <div
      className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-slate-50 dark:bg-slate-950"
      style={{
        // backgroundImage = `url('/background.svg')`,
      }}
    >   
        {/* Overlay (fond floute) pour ameliorer la lisibilite avec le theme slate */}
        <div className="absolute inset-0 bg-white/5 dark:bg-slate-950/20 backdrop-blur-[1px]"></div>
        
        <main className="flex flex-col gap-8 row-start-2 items-center relative z-10 max-w-2xl mx-auto">
              {/* Card principale avec component shadcn */}
              <Card className="w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-200 dark:border-slate-800 shadow-2xl">
                <CardHeader className="text-center pb-6">
                  {/* Logo emoji */}
                  <div className="text-6xl mb-4 mx-auto">
                    🏘️
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                    Bienvenue
                  </CardTitle>
                  <CardDescription className="text-lg font-medium text-slate-700 dark:text-slate-300">
                        sur {String(metadata.title ?? "CadastreWeb")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-center">
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Administrez et consultez vos donnees cadastrales de manieres simple et efficace
                  </p>
                  <div className="pt-4">
                      <Button
                        asChild
                        size="lg"
                        className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Link 
                        
                        href={Login}
                        >
                        Se Connecter
                        </Link>
                      </Button>
                  </div>
                </CardContent>
              </Card>
        </main>
        <footer className="row-start-3 text-sm text-slate-600 dark:text-slate-400 relative z-10 text-center">
            <p>© {new Date().getFullYear()} Mon Appplication. Tous droits reserves.</p>
        </footer>
    </div>
  );
}