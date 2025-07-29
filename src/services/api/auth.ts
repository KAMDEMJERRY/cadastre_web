import { User } from '@/types/user';
import { LoginCredentials, LoginResponse } from './../../types/auth.d';
import { apiClient } from './client';

export const accountAPI = {
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/accounts/login', credentials);
    // Stockage du token
    if (response.access) {
      localStorage.setItem('access_token', response.access);
      if (response.refresh) {
        localStorage.setItem('refresh_token', response.refresh);
      }
    }
    return response;
  },

  async register(userData: User): Promise<User> {
    const response = await apiClient.post<User>('/accounts/register', userData);
    return response;
  },

  async refreshToken(): Promise<LoginResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) throw new Error('No refresh token available');
    
    const response = await apiClient.post<LoginResponse>('/accounts/refresh', { 
      refreshToken 
    });
    
    if (response.access) {
      localStorage.setItem('access_token', response.access);
    }
    return response;
  },

  logout(): void {
    // Appel API optionnel pour invalider le token côté serveur
    const refreshToken = localStorage.getItem('refresh_token');

    apiClient.post('/accounts/logout', {refreshToken}).catch(console.error);
    
    // Nettoyage local
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  async getProfile(): Promise<User> {
    return apiClient.get<User>('/accounts/users/me');
  },

  // Méthode utilitaire pour vérifier l'état d'authentification
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
};


