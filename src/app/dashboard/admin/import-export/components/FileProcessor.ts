import * as XLSX from 'xlsx';

export async function processExcelFile(file: File, dataType: string) {
  return new Promise<{ rows: number; data: any[] }>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Ici vous pourriez valider les données selon le dataType
        console.log(`Données ${dataType} importées:`, jsonData);

        resolve({
          rows: jsonData.length,
          data: jsonData
        });
      } catch (error) {
        reject(new Error('Format de fichier invalide'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Erreur de lecture du fichier'));
    };

    reader.readAsArrayBuffer(file);
  });
}