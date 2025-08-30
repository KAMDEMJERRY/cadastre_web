import { API_BASE_URL } from '@/utils/constants/end_points';
import { accountAPI } from './api/auth';

interface ApiClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  timeout?: number;
}

interface RequestOptions extends RequestInit {
  timeout?: number;
  skipAuth?: boolean;
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

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
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
        try {
          await accountAPI.refreshToken();
          // Nouvelle tentative avec le nouveau token
          const retryResponse = await fetch(url, {
            ...options,
            headers: this.prepareHeaders(options, true),
            signal: controller.signal,
          });
          
          if (!retryResponse.ok) {
            throw new ApiError(retryResponse.status, 'Unauthorized after refresh');
          }
          return this.parseResponse<T>(retryResponse, options.method);
        } catch (refreshError) {
          // Si le refresh échoue, déconnecter l'utilisateur
          accountAPI.logout();
          window.location.href = '/login';
          throw new ApiError(401, 'Authentication failed');
        }
      }

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = response.statusText;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new ApiError(response.status, errorMessage);
      }

      return this.parseResponse<T>(response, options.method);
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError(408, 'Request timeout');
      }
      
      if (error instanceof ApiError && error.status === 401) {
        accountAPI.logout();
        window.location.href = '/login';
      }
      
      throw error;
    }
  }

  private async parseResponse<T>(response: Response, method?: string): Promise<T> {
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    
    // Pour DELETE et responses vides
    if (method === 'DELETE' || contentLength === '0' || response.status === 204) {
      return undefined as unknown as T;
    }
    
    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      return text as unknown as T;
    }
    
    try {
      return await response.json() as T;
    } catch (error) {
      console.warn('Failed to parse JSON response:', error);
      throw new ApiError(500, 'Invalid JSON response');
    }
  }

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

  // Méthodes HTTP publiques
  public get<T>(endpoint: string, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T>(endpoint: string, body: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { 
      ...options, 
      method: 'POST', 
      body: JSON.stringify(body) 
    });
  }

  public put<T>(endpoint: string, body: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { 
      ...options, 
      method: 'PUT', 
      body: JSON.stringify(body) 
    });
  }

  public delete<T = void>(endpoint: string, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = new ApiClient({
  baseUrl: API_BASE_URL,
  timeout: 30000,
});