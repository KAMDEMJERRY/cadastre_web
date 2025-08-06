import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAPIOptions<T> {
  immediate?: boolean;
  dependencies?: unknown[];
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  transform?: (data: unknown) => T;
}

export interface UseAPIReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: unknown[]) => Promise<T>;
  refresh: () => Promise<T>;
  reset: () => void;
}

export function useAPI<T = unknown>(
  apiFunction: (...args: unknown[]) => Promise<T>,
  options: UseAPIOptions<T> = {}
): UseAPIReturn<T> {
 
  const {
    immediate = false,
    dependencies = [],
    onSuccess,
    onError,
    transform
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const lastArgsRef = useRef<unknown[]>([]);
  const mountedRef = useRef(true);

  const execute = useCallback(async (...args: unknown[]): Promise<T> => {

    if (!mountedRef.current){ 
      console.warn('Component unmounted, skipping API call');
      return Promise.reject(new Error('Component unmounted'));
    }

    try {
      
      if(mountedRef.current) {
        setLoading(true);
        setError(null);
      }
      lastArgsRef.current = args;

      const result = await apiFunction(...args);
      const transformedData = transform ? transform(result) : result;
      console.log('API call successful:', transformedData);
      if (mountedRef.current) {
        setData(transformedData);
        onSuccess?.(transformedData);
      }

      return transformedData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      
      if (mountedRef.current) {
        setError(errorMessage);
        onError?.(err as Error);
      }
      
      throw err;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [apiFunction, transform, onSuccess, onError]);

  const refresh = useCallback(() => {
    return execute(...lastArgsRef.current);
  }, [execute]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    console.log('Component mounted');
    
    return () => {
      console.log('Component will unmount');
    };
  }, []);


  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    refresh,
    reset
  };
}