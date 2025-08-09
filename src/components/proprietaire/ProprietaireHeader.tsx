// components/proprietaire/ProprietaireHeader.tsx
import { Button } from "@/components/ui/button";
import { LogOut, Home } from "lucide-react";
import { ProprietaireProfile } from "@/types/ui/proprietaire";

interface ProprietaireHeaderProps {
  profile: ProprietaireProfile;
  onLogout: () => void;
}

export default function ProprietaireHeader({ profile, onLogout }: ProprietaireHeaderProps) {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 text-slate-50 shadow-lg dark:shadow-slate-800/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-700/50 rounded-xl backdrop-blur-sm border border-slate-600/50">
              <Home className="h-6 w-6 text-slate-100" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-50">CadastreWeb</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <h3 className="text-lg font-semibold text-slate-50">{profile.nom}</h3>
              <p className="text-sm text-slate-300">
                ID: {profile.idCadastrale}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLogout}
              className="bg-slate-700/50 border-slate-600/50 text-slate-50 hover:bg-slate-600/70 hover:text-slate-50 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}