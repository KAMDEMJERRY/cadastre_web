// export const API_BASE_URL = 'http://localhost:8000/api';
// export const LOGIN_URL = `${API_BASE_URL}/accounts/login`;
// export const USER_PROFILE_URL = `${API_BASE_URL}/users/me`;
// export const PARCELLEDOC_URL = `/docs/document`;
// // Ajoute d'autres URLs ici selon tes besoins
// Détermine l'URL de base dynamiquement selon l'environnement
const getApiBaseUrl = () => {
  // En production sur Vercel, utilise l'URL Render
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
    return 'https://cadastre-backend-3whj.onrender.com/api';
  }
  
  // En preview (branches, PR), utilise aussi l'URL Render
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
    return 'https://cadastre-backend-3whj.onrender.com/api';
  }
  
  // En développement local, utilise localhost
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
};

// URL de base de l'API
export const API_BASE_URL = getApiBaseUrl();

// URLs spécifiques
export const LOGIN_URL = `${API_BASE_URL}/accounts/login`;
export const USER_PROFILE_URL = `${API_BASE_URL}/users/me`;
export const PARCELLEDOC_URL = `/docs/document`;

// Ajoutez d'autres URLs ici selon vos besoins
export const LOTISSEMENTS_URL = `${API_BASE_URL}/lotissements`;
export const PARCELLES_URL = `${API_BASE_URL}/parcelles`;
export const BLOCS_URL = `${API_BASE_URL}/blocs`;
export const USERS_URL = `${API_BASE_URL}/users`;

// Fonction utilitaire pour construire des URLs avec paramètres
export const buildUrl = (base: string, params?: Record<string, string | number>) => {
  if (!params) return base;
  
  const url = new URL(base);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value.toString());
  });
  
  return url.toString();
};