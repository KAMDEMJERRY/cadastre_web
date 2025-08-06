import { API_BASE_URL } from '@/utils/constants/end_points';
import { accountAPI } from './api/auth';

interface ApiClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  timeout?: number;
}

interface RequestOptions extends RequestInit {
  timeout?: number;
  skipAuth?: boolean; // Option pour désactiver l'auth header
}

class ApiClient {
  private readonly baseURL: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly defaultTimeout: number;

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.defaultHeaders,
    };
    this.defaultTimeout = config.timeout || 10000;
  }

  // Méthode principale pour les requêtes
  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    try {
      const response = await this.fetchWithRetry(endpoint, options);
      return response.json() as Promise<T>;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Gestion des requêtes avec retry sur 401
  private async fetchWithRetry(endpoint: string, options: RequestOptions): Promise<Response> {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || this.defaultTimeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: this.prepareHeaders(options),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Gestion du refresh token sur 401
      if (response.status === 401 && !options.skipAuth) {
        await accountAPI.refreshToken();
        const retryResponse = await fetch(url, {
          ...options,
          headers: this.prepareHeaders(options, true),
          signal: controller.signal,
        });
        
        if (!retryResponse.ok) {
          throw new ApiError(retryResponse.status, 'Unauthorized after refresh');
        }
        return retryResponse;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(response.status, errorData.message || response.statusText);
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // Préparation des headers avec gestion d'authentification
  private prepareHeaders(options: RequestOptions, isRetry: boolean = false): HeadersInit {
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...(options.headers as Record<string, string>),
    };

    if (!options.skipAuth) {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Gestion centralisée des erreurs
  private handleError(error: unknown): void {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(408, 'Request timeout');
    }

    if (error instanceof ApiError && error.status === 401) {
      accountAPI.logout();
      window.location.href = '/login';
    }
  }

  // Méthodes HTTP publiques
  public get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  public post<T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<T> {
    return this.request(endpoint, { 
      ...options, 
      method: 'POST', 
      body: JSON.stringify(body) 
    });
  }

  public put<T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<T> {
    return this.request(endpoint, { 
      ...options, 
      method: 'PUT', 
      body: JSON.stringify(body) 
    });
  }

  public delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Instance API configurée
export const apiClient = new ApiClient({
  baseUrl: API_BASE_URL,
  timeout: 30000,
});