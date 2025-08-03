// components/proprietaire/ProprietaireHeader.tsx
import { Button } from "@/components/ui/button";
import { LogOut, Home } from "lucide-react";
import { ProprietaireProfile } from "@/types/proprietaire";

interface ProprietaireHeaderProps {
  profile: ProprietaireProfile;
  onLogout: () => void;
}

export default function ProprietaireHeader({ profile, onLogout }: ProprietaireHeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
              <Home className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">CadastreWeb</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <h3 className="text-lg font-semibold">{profile.nom}</h3>
              <p className="text-sm text-blue-100">
                ID: {profile.idCadastrale}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLogout}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
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