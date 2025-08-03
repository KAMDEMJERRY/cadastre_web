// app/login/page.tsx
'use client';

import { useEffect } from 'react';
import AuthForm from '@/components/login/AuthForm';

export default function LoginPage() {
  useEffect(() => {
    const container = document.querySelector('.login-container');
    if (container) {
      container.classList.add('opacity-0', 'translate-y-5');
      
      setTimeout(() => {
        container.classList.add('transition-all', 'duration-300', 'ease-out');
        container.classList.remove('opacity-0', 'translate-y-5');
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="login-container w-full max-w-md bg-slate-100/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 sm:p-12">
        <AuthForm />
        
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-slate-100/90 dark:bg-slate-900/90 px-4 text-sm text-slate-500 dark:text-slate-400">
              Besoin d&apos;aide ?
            </span>
          </div>
        </div>
        
      </div>
    </div>
  );
}