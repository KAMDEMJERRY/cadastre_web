// data/mockData.ts
import { 
  Building2, 
  MapPin, 
  UserPlus, 
  FileText 
} from "lucide-react";
import { 
  LotissementData, 
  ParcelleData, 
  UtilisateurData, 
  ActivityData, 
  StatsData 
} from "@/types/dashboard";

export const mockStats: StatsData = {
  totalLotissements: 12,
  totalBlocs: 84,
  totalParcelles: 1842,
  totalUtilisateurs: 1203,
  parcellesVendues: 1145,
  parcellesLibres: 697,
  revenus: "2.4M FCFA",
  croissanceMensuelle: 15.2
};

export const mockLotissements: LotissementData[] = [
  { 
    id: 1, 
    nom: "Les Jardins de Yaoundé", 
    adresse: "Quartier Essos", 
    nombreBlocs: 8, 
    nombreParcelles: 240, 
    dateCreation: "2024-01-15", 
    statut: "actif" 
  },
  { 
    id: 2, 
    nom: "Résidence Mont Fébé", 
    adresse: "Mont Fébé", 
    nombreBlocs: 6, 
    nombreParcelles: 180, 
    dateCreation: "2024-02-20", 
    statut: "en_cours" 
  },
  { 
    id: 3, 
    nom: "Cité Verte Mvog-Ada", 
    adresse: "Mvog-Ada", 
    nombreBlocs: 10, 
    nombreParcelles: 320, 
    dateCreation: "2023-11-10", 
    statut: "actif" 
  },
];

export const mockParcelles: ParcelleData[] = [
  { 
    id: "P001", 
    numero: "001", 
    bloc: "Bloc A", 
    lotissement: "Les Jardins de Yaoundé", 
    proprietaire: "Jean Mballa", 
    superficie: 500, 
    statut: "vendue" 
  },
  { 
    id: "P002", 
    numero: "002", 
    bloc: "Bloc A", 
    lotissement: "Les Jardins de Yaoundé", 
    proprietaire: "Domaine Public", 
    superficie: 750, 
    statut: "libre" 
  },
  { 
    id: "P003", 
    numero: "003", 
    bloc: "Bloc B", 
    lotissement: "Résidence Mont Fébé", 
    proprietaire: "Marie Ngo", 
    superficie: 600, 
    statut: "reservee" 
  },
];

export const mockUtilisateurs: UtilisateurData[] = [
  { 
    id: 1, 
    nom: "Jean Mballa", 
    email: "j.mballa@email.cm", 
    cni: "123456789", 
    type: "proprietaire", 
    statut: "actif", 
    nombreParcelles: 2 
  },
  { 
    id: 2, 
    nom: "Marie Ngo", 
    email: "m.ngo@email.cm", 
    cni: "987654321", 
    type: "proprietaire", 
    statut: "actif", 
    nombreParcelles: 1 
  },
  { 
    id: 3, 
    nom: "Admin Système", 
    email: "admin@cadastre.cm", 
    cni: "111222333", 
    type: "administrateur", 
    statut: "actif", 
    nombreParcelles: 0 
  },
];

export const mockActivities: ActivityData[] = [
  { 
    id: 1, 
    action: "Nouveau lotissement créé", 
    details: "Les Jardins de Yaoundé", 
    user: "Admin", 
    time: "Il y a 2h", 
    type: "success", 
    icon: Building2 
  },
  { 
    id: 2, 
    action: "Parcelle vendue", 
    details: "P001 - Bloc A", 
    user: "Jean Mballa", 
    time: "Il y a 4h", 
    type: "info", 
    icon: MapPin 
  },
  { 
    id: 3, 
    action: "Utilisateur enregistré", 
    details: "Marie Ngo", 
    user: "Système", 
    time: "Il y a 6h", 
    type: "success", 
    icon: UserPlus 
  },
  { 
    id: 4, 
    action: "Document PDF généré", 
    details: "Attestation P002", 
    user: "Admin", 
    time: "Il y a 8h", 
    type: "warning", 
    icon: FileText 
  },
];