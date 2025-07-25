'use client';

import { useState } from 'react';

export default function CreateParcelleForm() {
  const [formData, setFormData] = useState({
    numero: '',
    bloc: '',
    proprietaire: '',
    superficie: '',
    perimetre: '',
    plan: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, plan: e.target.files[0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Soumission du formulaire
    console.log('Formulaire soumis:', formData);
  };

  return (
    <>
      <h3 className="text-lg font-semibold mb-4">Ajouter une Parcelle</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700">Numéro de parcelle</label>
          <input
            type="text"
            name="numero"
            value={formData.numero}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Ex: P001"
          />
        </div>
        <div>
          <label className="block text-gray-700">Bloc</label>
          <select
            name="bloc"
            value={formData.bloc}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Sélectionner un bloc</option>
            <option value="bloc-a">Bloc A</option>
            <option value="bloc-b">Bloc B</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Propriétaire</label>
          <select
            name="proprietaire"
            value={formData.proprietaire}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Sélectionner un propriétaire</option>
            <option value="public">Domaine Public</option>
            <option value="jean-pierre">Jean-Pierre KAMGANG</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Superficie (m²)</label>
          <input
            type="number"
            name="superficie"
            value={formData.superficie}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Ex: 500"
          />
        </div>
        <div>
          <label className="block text-gray-700">Périmètre (m)</label>
          <input
            type="number"
            name="perimetre"
            value={formData.perimetre}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Ex: 90"
          />
        </div>
        <div>
          <label className="block text-gray-700">Plan de localisation</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Créer Parcelle
          </button>
          <button
            type="button"
            className="ml-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Importer Données
          </button>
        </div>
      </form>
    </>
  );
}