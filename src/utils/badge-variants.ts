// utils/badge-variants.ts
export const getStatutBadge = (statut: string) => {
  const variants = {
    'actif': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'en_cours': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'suspendu': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'libre': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    'vendue': 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
    'reservee': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'inactif': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    'proprietaire': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'administrateur': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
  };
  return variants[statut as keyof typeof variants] || variants.actif;
};