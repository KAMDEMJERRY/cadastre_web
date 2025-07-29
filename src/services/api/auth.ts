import { LoginResponse } from './../../types/auth.d';
// lib/api/auth.ts

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await fetch('http://localhost:8000/api/accounts/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Échec de la connexion');
  }

  return await response.json();
};