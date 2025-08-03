// data/proprietaireMockData.ts
import { ProprietaireProfile, ParcelleProprietaire, StatsProprietaire } from "@/types/proprietaire";

export const mockProprietaireProfile: ProprietaireProfile = {
  id: "usr_001",
  idCadastrale: "CAD2024001234",
  cni: "123456789",
  nom: "Jean-Pierre KAMGANG",
  email: "jp.kamgang@email.cm",
  type: "privé",
  role: "proprietaire",
  status: "actif"
};

export const mockParcelles: ParcelleProprietaire[] = [
  {
    id: "P001",
    numero: "P001",
    bloc: {
      nom: "Bloc A",
      lotissement: {
        nom: "Cité Verte",
        adresse: "Quartier Mvog-Ada, Yaoundé"
      }
    },
    superficie: 500,
    perimetre: 90,
    statut: "actif",
    planLocalisation: "/plans/P001.pdf",
    localisation: {
      pays: "Cameroun",
      region: "Centre",
      departement: "Mfoundi",
      arrondissement: "Yaoundé 3",
      quartier: "Mvog-Ada"
    }
  },
  {
    id: "P002",
    numero: "P002",
    bloc: {
      nom: "Bloc B",
      lotissement: {
        nom: "Mvog-Ada",
        adresse: "Quartier Mvog-Ada, Yaoundé"
      }
    },
    superficie: 300,
    perimetre: 70,
    statut: "actif",
    planLocalisation: "/plans/P002.pdf",
    localisation: {
      pays: "Cameroun",
      region: "Centre",
      departement: "Mfoundi",
      arrondissement: "Yaoundé 3",
      quartier: "Mvog-Ada"
    }
  },
  {
    id: "P003",
    numero: "P003",
    bloc: {
      nom: "Bloc C",
      lotissement: {
        nom: "Odza",
        adresse: "Quartier Odza, Yaoundé"
      }
    },
    superficie: 750,
    perimetre: 110,
    statut: "actif",
    planLocalisation: "/plans/P003.pdf",
    localisation: {
      pays: "Cameroun",
      region: "Centre",
      departement: "Mfoundi",
      arrondissement: "Yaoundé 6",
      quartier: "Odza"
    }
  },
  {
    id: "P004",
    numero: "P004",
    bloc: {
      nom: "Bloc D",
      lotissement: {
        nom: "Cité Verte",
        adresse: "Quartier Mvog-Ada, Yaoundé"
      }
    },
    superficie: 400,
    perimetre: 80,
    statut: "en_attente",
    planLocalisation: "/plans/P004.pdf",
    localisation: {
      pays: "Cameroun",
      region: "Centre",
      departement: "Mfoundi",
      arrondissement: "Yaoundé 3",
      quartier: "Mvog-Ada"
    }
  },
  {
    id: "P005",
    numero: "P005",
    bloc: {
      nom: "Bloc E",
      lotissement: {
        nom: "Mvog-Ada",
        adresse: "Quartier Mvog-Ada, Yaoundé"
      }
    },
    superficie: 500,
    perimetre: 90,
    statut: "actif",
    planLocalisation: "/plans/P005.pdf",
    localisation: {
      pays: "Cameroun",
      region: "Centre",
      departement: "Mfoundi",
      arrondissement: "Yaoundé 3",
      quartier: "Mvog-Ada"
    }
  }
];

export const mockStats: StatsProprietaire = {
  totalParcelles: mockParcelles.length,
  superficieTotale: mockParcelles.reduce((sum, p) => sum + p.superficie, 0),
  nombreLotissements: [...new Set(mockParcelles.map(p => p.bloc.lotissement.nom))].length,
  statutGeneral: "à_jour"
};

export const mockLotissements = [...new Set(mockParcelles.map(p => p.bloc.lotissement.nom))];