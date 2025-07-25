'use client';

import { useState } from 'react';
import { processExcelFile } from './FileProcessor';

export default function ImportSection() {
  const [file, setFile] = useState<File | null>(null);
  const [dataType, setDataType] = useState('parcelles');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage('Veuillez sélectionner un fichier');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const result = await processExcelFile(file, dataType);
      setMessage(`Import réussi: ${result.rows} lignes traitées`);
      // Ici vous pourriez ajouter la logique pour envoyer les données à votre API
    } catch (error) {
      setMessage(`Erreur lors de l'import: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h3 className="text-lg font-semibold mb-4">Importer des Données</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Fichier de données (CSV, Excel, JSON)</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
            accept=".csv,.xlsx,.xls,.json"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Type de données</label>
          <select
            value={dataType}
            onChange={(e) => setDataType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="parcelles">Parcelles</option>
            <option value="lotissements">Lotissements</option>
            <option value="blocs">Blocs</option>
            <option value="proprietaires">Propriétaires</option>
          </select>
        </div>
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 rounded text-white ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isLoading ? 'Import en cours...' : 'Importer'}
          </button>
        </div>
        {message && (
          <div className={`p-3 rounded ${message.includes('Erreur') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
      </form>
    </>
  );
}