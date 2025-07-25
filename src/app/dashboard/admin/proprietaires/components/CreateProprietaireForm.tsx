'use client';

import { useState } from 'react';

export default function CreateProprietaireForm() {
  const [formData, setFormData] = useState({
    nom: '',
    cni: '',
    email: '',
    type: 'prive',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Soumission du formulaire
    console.log('Formulaire soumis:', formData);
  };

  return (
    <>
      <h3 className="text-lg font-semibold mb-4">Ajouter un Propriétaire</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700">Nom complet</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Ex: Jean-Pierre KAMGANG"
          />
        </div>
        <div>
          <label className="block text-gray-700">CNI</label>
          <input
            type="text"
            name="cni"
            value={formData.cni}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Numéro de carte nationale"
          />
        </div>
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Ex: email@example.com"
          />
        </div>
        <div>
          <label className="block text-gray-700">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="prive">Privé</option>
            <option value="public">Public</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Créer Propriétaire
          </button>
          <button
            type="button"
            className="ml-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Générer PDF
          </button>
        </div>
      </form>
    </>
  );
}