'use client';

import { useState } from 'react';

export default function CreateLotissementForm() {
  const [formData, setFormData] = useState({
    nom: '',
    adresse: '',
    dateCreation: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulaire soumis:', formData);
    // Ici vous ajouterez la logique pour envoyer les données à votre API
  };

  return (
    <>
      <h3 className="text-lg font-semibold mb-4">Ajouter un Lotissement</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1">Nom</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nom du lotissement"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Adresse</label>
          <input
            type="text"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Localisation géographique"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Date de création</label>
          <input
            type="date"
            name="dateCreation"
            value={formData.dateCreation}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Détails supplémentaires"
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Créer Lotissement
          </button>
        </div>
      </form>
    </>
  );
}