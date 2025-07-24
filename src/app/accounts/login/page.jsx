'use client';

import { useEffect } from 'react';
import AuthForm from '@/components/features/accounts/AuthForm';
import AuthHelpSection from '@/components/features/accounts/AuthHelpSection';

export default function LoginPage() {
 
useEffect(() => {
    // Animation d'entrée
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#667eea] to-[#764ba2]">
      <div className="login-container w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8 sm:p-12">
       
        <AuthForm />
        
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white/95 px-4 text-sm text-gray-500">
              Besoin d'aide ?
            </span>
          </div>
        </div>
        
        <AuthHelpSection />
      </div>
    </div>
  );
}