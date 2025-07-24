'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Lotissement, Bloc, Parcelle } from '@/types/lotissement';

// Contexte pour les Lotissements
type LotissementContextType = {
  lotissements: Lotissement[];
  selectedLotissement: string | null;
  setSelectedLotissement: (id: string | null) => void;
  addLotissement: (lotissement: Omit<Lotissement, 'id'>) => void;
  updateLotissement: (id: string, updates: Partial<Lotissement>) => void;
  deleteLotissement: (id: string) => void;
  getLotissementById: (id: string) => Lotissement | undefined;
};

const LotissementContext = createContext<LotissementContextType | undefined>(undefined);

export function LotissementProvider({ children }: { children: ReactNode }) {
  const [lotissements, setLotissements] = useState<Lotissement[]>([]);
  const [selectedLotissement, setSelectedLotissement] = useState<string | null>(null);

  // Fonctions de gestion
  const addLotissement = (lotissement: Omit<Lotissement, 'id'>) => {
    const newLotissement: Lotissement = {
      ...lotissement,
      id: `lot-${Date.now()}`,
    };
    setLotissements(prev => [...prev, newLotissement]);
  };

  const updateLotissement = (id: string, updates: Partial<Lotissement>) => {
    setLotissements(prev =>
      prev.map(lot =>
        lot.id === id ? { ...lot, ...updates } : lot
      )
    );
  };

  const deleteLotissement = (id: string) => {
    setLotissements(prev => prev.filter(lot => lot.id !== id));
    if (selectedLotissement === id) {
      setSelectedLotissement(null);
    }
  };

  const getLotissementById = (id: string) => {
    return lotissements.find(lot => lot.id === id);
  };

  // Chargement initial (simulation)
  useEffect(() => {
    // Remplacer par un vrai appel API
    const initialData: Lotissement[] = [
      {
        id: 'lot-1',
        nom: 'Cité Verte',
        adresse: 'Yaoundé',
        dateCreation: '2023-01-15',
      },
      {
        id: 'lot-2',
        nom: 'Mvog-Ada',
        adresse: 'Yaoundé',
        dateCreation: '2023-02-20',
      },
    ];
    setLotissements(initialData);
  }, []);

  return (
    <LotissementContext.Provider
      value={{
        lotissements,
        selectedLotissement,
        setSelectedLotissement,
        addLotissement,
        updateLotissement,
        deleteLotissement,
        getLotissementById,
      }}
    >
      {children}
    </LotissementContext.Provider>
  );
}

export const useLotissements = () => {
  const context = useContext(LotissementContext);
  if (context === undefined) {
    throw new Error('useLotissements must be used within a LotissementProvider');
  }
  return context;
};

// Contexte pour les Blocs
type BlocContextType = {
  blocs: Bloc[];
  selectedBloc: string | null;
  setSelectedBloc: (id: string | null) => void;
  addBloc: (bloc: Omit<Bloc, 'id'>) => void;
  updateBloc: (id: string, updates: Partial<Bloc>) => void;
  deleteBloc: (id: string) => void;
  getBlocsByLotissement: (lotissementId: string) => Bloc[];
};

const BlocContext = createContext<BlocContextType | undefined>(undefined);

export function BlocProvider({ children }: { children: ReactNode }) {
  const [blocs, setBlocs] = useState<Bloc[]>([]);
  const [selectedBloc, setSelectedBloc] = useState<string | null>(null);

  // Fonctions de gestion
  const addBloc = (bloc: Omit<Bloc, 'id'>) => {
    const newBloc: Bloc = {
      ...bloc,
      id: `bloc-${Date.now()}`,
    };
    setBlocs(prev => [...prev, newBloc]);
  };

  const updateBloc = (id: string, updates: Partial<Bloc>) => {
    setBlocs(prev =>
      prev.map(bloc =>
        bloc.id === id ? { ...bloc, ...updates } : bloc
      )
    );
  };

  const deleteBloc = (id: string) => {
    setBlocs(prev => prev.filter(bloc => bloc.id !== id));
    if (selectedBloc === id) {
      setSelectedBloc(null);
    }
  };

  const getBlocsByLotissement = (lotissementId: string) => {
    return blocs.filter(bloc => bloc.lotissementId === lotissementId);
  };

  // Chargement initial (simulation)
  useEffect(() => {
    // Remplacer par un vrai appel API
    const initialData: Bloc[] = [
      {
        id: 'bloc-1',
        nom: 'Bloc A',
        lotissementId: 'lot-1',
        nombreParcelles: 10,
      },
      {
        id: 'bloc-2',
        nom: 'Bloc B',
        lotissementId: 'lot-1',
        nombreParcelles: 8,
      },
    ];
    setBlocs(initialData);
  }, []);

  return (
    <BlocContext.Provider
      value={{
        blocs,
        selectedBloc,
        setSelectedBloc,
        addBloc,
        updateBloc,
        deleteBloc,
        getBlocsByLotissement,
      }}
    >
      {children}
    </BlocContext.Provider>
  );
}

export const useBlocs = () => {
  const context = useContext(BlocContext);
  if (context === undefined) {
    throw new Error('useBlocs must be used within a BlocProvider');
  }
  return context;
};

// Contexte pour les Parcelles
type ParcelleContextType = {
  parcelles: Parcelle[];
  selectedParcelle: string | null;
  setSelectedParcelle: (id: string | null) => void;
  addParcelle: (parcelle: Omit<Parcelle, 'id'>) => void;
  updateParcelle: (id: string, updates: Partial<Parcelle>) => void;
  deleteParcelle: (id: string) => void;
  getParcellesByBloc: (blocId: string) => Parcelle[];
};

const ParcelleContext = createContext<ParcelleContextType | undefined>(undefined);

export function ParcelleProvider({ children }: { children: ReactNode }) {
  const [parcelles, setParcelles] = useState<Parcelle[]>([]);
  const [selectedParcelle, setSelectedParcelle] = useState<string | null>(null);

  // Fonctions de gestion
  const addParcelle = (parcelle: Omit<Parcelle, 'id'>) => {
    const newParcelle: Parcelle = {
      ...parcelle,
      id: `parcelle-${Date.now()}`,
    };
    setParcelles(prev => [...prev, newParcelle]);
  };

  const updateParcelle = (id: string, updates: Partial<Parcelle>) => {
    setParcelles(prev =>
      prev.map(parcelle =>
        parcelle.id === id ? { ...parcelle, ...updates } : parcelle
      )
    );
  };

  const deleteParcelle = (id: string) => {
    setParcelles(prev => prev.filter(parcelle => parcelle.id !== id));
    if (selectedParcelle === id) {
      setSelectedParcelle(null);
    }
  };

  const getParcellesByBloc = (blocId: string) => {
    return parcelles.filter(parcelle => parcelle.blocId === blocId);
  };

  // Chargement initial (simulation)
  useEffect(() => {
    // Remplacer par un vrai appel API
    const initialData: Parcelle[] = [
      {
        id: 'parcelle-1',
        numero: 'P001',
        blocId: 'bloc-1',
        superficie: 500,
        proprietaireId: 'prop-1',
      },
      {
        id: 'parcelle-2',
        numero: 'P002',
        blocId: 'bloc-1',
        superficie: 300,
        proprietaireId: null,
      },
    ];
    setParcelles(initialData);
  }, []);

  return (
    <ParcelleContext.Provider
      value={{
        parcelles,
        selectedParcelle,
        setSelectedParcelle,
        addParcelle,
        updateParcelle,
        deleteParcelle,
        getParcellesByBloc,
      }}
    >
      {children}
    </ParcelleContext.Provider>
  );
}

export const useParcelles = () => {
  const context = useContext(ParcelleContext);
  if (context === undefined) {
    throw new Error('useParcelles must be used within a ParcelleProvider');
  }
  return context;
};

// Provider principal qui englobe tous les contextes
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LotissementProvider>
      <BlocProvider>
        <ParcelleProvider>
          {children}
        </ParcelleProvider>
      </BlocProvider>
    </LotissementProvider>
  );
}