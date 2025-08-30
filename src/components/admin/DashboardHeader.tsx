// components/dashboard/DashboardHeader.tsx
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Download, Home, LogOut } from "lucide-react";
import { ProfileAdministrateur } from "@/types/ui/dashboard";
import { User } from "@/types/user";

interface AdministrateurHeaderProps{
  profile: User | null;
  onLogout: ()=> void;
}

export default function DashboardHeader({profile, onLogout}: AdministrateurHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 text-slate-50 shadow-lg backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Home className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">CadastreWeb - Dashboard</h1>
              <p className="text-slate-300 mt-1">Système de Gestion de Lotissements</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div >
                   <h3 className="text-lg font-semibold text-slate-50">{profile?.username ?? "Admin 1"}</h3>
                   <p className="text-sm text-slate-300">
                      ID: {profile?.id_cadastrale}
                   </p>
            </div>
            <Avatar>
              <AvatarImage src="/admin-avatar.jpg" />
              <AvatarFallback className="bg-slate-700 text-white">AD</AvatarFallback>
            </Avatar>
           <br />
            
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
    </div>
  );
}