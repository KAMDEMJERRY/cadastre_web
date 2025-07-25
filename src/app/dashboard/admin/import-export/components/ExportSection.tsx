'use client';

import { useState } from 'react';

export default function ExportSection() {
  const [dataType, setDataType] = useState('parcelles');
  const [fileFormat, setFileFormat] = useState('csv');
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      // Simuler un export
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Créer un lien de téléchargement
      const blob = new Blob([`Exemple de données ${dataType} en ${fileFormat}`], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${dataType}_export.${fileFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h3 className="text-lg font-semibold mb-4">Exporter des Données</h3>
      <div className="space-y-4">
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
          <label className="block text-gray-700 mb-1">Format de fichier</label>
          <select
            value={fileFormat}
            onChange={(e) => setFileFormat(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
            <option value="excel">Excel</option>
          </select>
        </div>
        <div>
          <button
            onClick={handleExport}
            disabled={isLoading}
            className={`px-4 py-2 rounded text-white ${isLoading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {isLoading ? 'Génération en cours...' : 'Exporter'}
          </button>
        </div>
      </div>
    </>
  );
}