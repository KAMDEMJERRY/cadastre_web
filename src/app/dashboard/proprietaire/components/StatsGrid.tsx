import Card from '@/components/layout/Card';

const stats = [
  { title: 'Total Parcelles', value: 5, label: 'Propriétés possédées' },
  { title: 'Superficie Totale', value: '2,450', label: 'm² de terrain' },
  { title: 'Lotissements', value: 3, label: 'Différents lotissements' },
  { title: 'Statut', value: '✓', label: 'Toutes à jour' },
];

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            {stat.title}
          </h3>
          <div className="text-3xl font-bold text-indigo-600 my-2">
            {stat.value}
          </div>
          <p className="text-gray-600">{stat.label}</p>
        </Card>
      ))}
    </div>
  );
}