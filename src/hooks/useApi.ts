/* eslint-disable @typescript-eslint/no-explicit-any */
// ==========================================
// 1. HOOK useAPI GÉNÉRIQUE
// ==========================================

import { useState, useEffect, useCallback, useRef } from 'react'

interface UseAPIOptions<T> {
  immediate?: boolean // Exécuter immédiatement au mount
  dependencies?: any[] // Dépendances pour re-fetch automatique
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  transform?: (data: any) => T ; // Transformer les données reçues
}

interface UseAPIReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  execute: (...args: any[]) => Promise<T>
  refresh: () => Promise<T>
  reset: () => void
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
  } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Garder une référence aux derniers arguments utilisés
  const lastArgsRef = useRef<any[]>([])
  const mountedRef = useRef(true)

  const execute = useCallback(async (...args: any[]): Promise<T> => {
    try {
      setLoading(true)
      setError(null)
      lastArgsRef.current = args

      const result = await apiFunction(...args)
      const transformedData = transform ? transform(result) : result

      if (mountedRef.current) {
        setData(transformedData)
        onSuccess?.(transformedData)
      }

      return transformedData
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue'
      
      if (mountedRef.current) {
        setError(errorMessage)
        onError?.(err as Error)
      }
      
      throw err
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }, [apiFunction, transform, onSuccess, onError])

  const refresh = useCallback(() => {
    return execute(...lastArgsRef.current)
  }, [execute])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  // Exécution immédiate ou sur changement des dépendances
  useEffect(() => {
    if (immediate) {
      execute()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate, ...dependencies])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  return {
    data,
    loading,
    error,
    execute,
    refresh,
    reset
  }
}