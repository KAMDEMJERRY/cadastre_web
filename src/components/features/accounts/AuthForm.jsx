'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {useUser} from '@/hooks/useUser'

export default function AuthForm() {
  const formRef = useRef(null);
  const buttonRef = useRef(null);
  const { user, login } = useUser();
  const router = useRouter();

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // 1. Récupération des données du formulaire
    const formData = new FormData(e.target);
    const credentials = {
      email: formData.get('email'),
      password: formData.get('password')
    };

    // 2. Validation
    if (!credentials.email || !credentials.password) {
      throw new Error('Identifiant et mot de passe sont requis');
    }

    // 3. UI Loading state
    buttonRef.current.innerHTML = 'Connexion en cours...';
    buttonRef.current.disabled = true;

    // 4. Requête POST vers l'endpoint JWT
    login(credentials);

    // 5. Redirection
    if (user?.role === 'admin') {
      router.push('/dashboard/admin');
    } else if (user?.role === 'proprietaire') {
      router.push('/dashboard/proprietaire');
    } else {
      throw new Error('Erreur de connexion: Role inconnu\nVeuillez contacter l\'administrateur.');
    }

  } catch (error) {
    console.error('Login error:', error);
    alert(error.message || 'Erreur de connexion');
  } finally {
    buttonRef.current.innerHTML = 'Se connecter';
    buttonRef.current.disabled = false;
  }
};

  const showForgotPassword = () => {
    const email = prompt('Entrez votre adresse email pour recevoir les instructions de récupération :');
    if (email) {
      alert(`Un email de récupération a été envoyé à ${email}`);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🏘️ CadastreWeb</h1>
        <p className="text-gray-500 text-sm">Système de Gestion de Lotissements</p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        

        <div className="space-y-1">
          <label htmlFor="cni" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            type="text"
            id="email"
            name="email"
            placeholder="Ex: 123456789"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-0  focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900"
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <Input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-0 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900"
              required
          />
        </div>

        <Button
          type="submit"
          ref={buttonRef}
          className="w-full py-4 px-6 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Se connecter
        </Button>

        <div className="text-center mt-4">
          <Button
            type="button"
            onClick={showForgotPassword}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
          >
            Mot de passe oublié ?
          </Button>
        </div>

      </form>
    </>
  );
}