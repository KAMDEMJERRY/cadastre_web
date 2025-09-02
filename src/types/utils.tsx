// Type pour les erreurs API
export interface ApiError {
  status: string;
  message: string;
  errors?:{
    [key: string]:string[];
  };
}

// Type pour les réponses d'erreur
export interface ErrorResponse {
  errors: ApiError[];
  detail?: string;
}

// Types utilitaires pour les sélecteurs
export interface SelectOption {
  value: number;
  label: string;
}
