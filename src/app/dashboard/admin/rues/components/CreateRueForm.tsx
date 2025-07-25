'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateRueForm() {
  const [formData, setFormData] = useState({
    nom: '',
    type: 'rue',
    longueur: '',
    quartier: '',
    revetement: 'asphalte'
  });

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Ici vous intégrerez l'appel API
    console.log('Nouvelle rue créée:', formData);
    router.refresh();
  };

  return (
    <>
      <h3 className="text-lg font-semibold mb-4">Enregistrer une nouvelle rue</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1">Nom de la rue</label>
          <input
            type="text"
            value={formData.nom}
            onChange={(e) => setFormData({...formData, nom: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Type de voie</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="w-full p-2 border rounded"
          >
            <option value="rue">Rue</option>
            <option value="avenue">Avenue</option>
            <option value="boulevard">Boulevard</option>
            <option value="impasse">Impasse</option>
          </select>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Longueur (m)</label>
          <input
            type="number"
            value={formData.longueur}
            onChange={(e) => setFormData({...formData, longueur: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Revêtement</label>
          <select
            value={formData.revetement}
            onChange={(e) => setFormData({...formData, revetement: e.target.value})}
            className="w-full p-2 border rounded"
          >
            <option value="asphalte">Asphalte</option>
            <option value="beton">Béton</option>
            <option value="terre">Terre</option>
            <option value="pave">Pavé</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Enregistrer la rue
          </button>
        </div>
      </form>
    </>
  );
}