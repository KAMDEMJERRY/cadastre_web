// Type pour les erreurs API
export interface ApiError {
  message: string;
  field?: string;
  code?: string;
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
