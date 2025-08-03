// components/features/accounts/AuthForm.tsx
'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/hooks/useUser';

export default function AuthForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { user, login } = useUser();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formRef.current || !buttonRef.current) return;

      const formData = new FormData(formRef.current);
      const credentials = {
        email: formData.get('email') as string,
        password: formData.get('password') as string
      };

      if (!credentials.email || !credentials.password) {
        throw new Error('Identifiant et mot de passe sont requis');
      }

      buttonRef.current.textContent = 'Connexion en cours...';
      buttonRef.current.disabled = true;

      await login(credentials);

      if (user?.role === 'admin') {
        router.push('/dashboard/admin');
      } else if (user?.role === 'proprietaire') {
        router.push('/dashboard/proprietaire');
      } else {
        throw new Error('Erreur de connexion: Role inconnu\nVeuillez contacter l\'administrateur.');
      }

    } catch (error) {
      console.error('Login error:', error);
      alert(error instanceof Error ? error.message : 'Erreur de connexion');
    } finally {
      if (buttonRef.current) {
        buttonRef.current.textContent = 'Se connecter';
        buttonRef.current.disabled = false;
      }
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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">🏘️ CadastreWeb</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">Système de Gestion de Lotissements</p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-slate-900 dark:text-slate-100">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="votre@email.com"
              className="mt-1 bg-white dark:bg-slate-800"
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-slate-900 dark:text-slate-100">
              Mot de passe
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              className="mt-1 bg-white dark:bg-slate-800"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          ref={buttonRef}
          className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900"
        >
          Se connecter
        </Button>

        <div className="text-center">
          <Button
            type="button"
            onClick={showForgotPassword}
            variant="link"
            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          >
            Mot de passe oublié ?
          </Button>
        </div>
      </form>
    </>
  );
}