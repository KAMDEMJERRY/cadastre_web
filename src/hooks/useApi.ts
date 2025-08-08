/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAPIOptions<T> {
  immediate?: boolean;
  dependencies?: any[];
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  transform?: (data: any) => T;
}

export interface UseAPIReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T | null>;
  refresh: () => Promise<T | null>;
  reset: () => void;
  abort: () => void;
}

export function useAPI<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
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
  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    // Check if component is still mounted before starting
    if (!mountedRef.current) {
      console.warn('Component unmounted, skipping API call');
      return null; // Return null instead of rejecting
    }

    try {
      // Cancel any previous ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new AbortController for this request
      abortControllerRef.current = new AbortController();

      if (mountedRef.current) {
        setLoading(true);
        setError(null);
      }

      lastArgsRef.current = args;
      const result = await apiFunction(...args);
      
      // Check if component is still mounted after async operation
      if (!mountedRef.current) {
        console.warn('Component unmounted during API call');
        return null;
      }

      const transformedData = transform ? transform(result) : result;
      console.log('API call successful:', transformedData);
      
      if (mountedRef.current) {
        setData(transformedData);
        onSuccess?.(transformedData);
      }

      return transformedData;
    } catch (err) {
      // Only handle error if component is still mounted
      if (!mountedRef.current) {
        console.warn('Component unmounted, ignoring API error');
        return null;
      }

      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      
      if (mountedRef.current) {
        setError(errorMessage);
        onError?.(err as Error);
      }
      
      throw err;
    } finally {
      // Clean up abort controller reference
      abortControllerRef.current = null;
      
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [apiFunction, transform, onSuccess, onError]);

  const refresh = useCallback((): Promise<T | null> => {
    return execute(...lastArgsRef.current);
  }, [execute]);

  const reset = useCallback(() => {
    if (mountedRef.current) {
      setData(null);
      setError(null);
      setLoading(false);
    }
  }, []);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (mountedRef.current) {
      setLoading(false);
    }
  }, []);

  // Single useEffect for mount/unmount handling
  useEffect(() => {
    mountedRef.current = true;
    console.log('Component mounted');
    
    return () => {
      console.log('Component will unmount');
      mountedRef.current = false;
      
      // Cancel any ongoing request when component unmounts
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  // Handle immediate execution
  useEffect(() => {
    if (immediate) {
      execute().catch((error) => {
        // Error is already handled in execute function
        console.error('Immediate API call failed:', error);
      });
    }
  }, [immediate, execute]);

  // Handle dependencies
  useEffect(() => {
    if (dependencies.length > 0 && !immediate) {
      execute().catch((error) => {
        console.error('Dependency-triggered API call failed:', error);
      });
    }
  }, dependencies);

  return {
    data,
    loading,
    error,
    execute,
    refresh,
    reset,
    abort
  };
}