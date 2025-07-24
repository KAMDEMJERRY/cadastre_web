import Button from '@/components/ui/Button2';

const actions = [
  { label: 'Ajouter un Lotissement', color: 'primary', onClick: () => {} },
  { label: 'Importer Données Cadastrales', color: 'primary', onClick: () => {} },
  { label: 'Générer Rapport PDF', color: 'success', onClick: () => {} },
];

export default function QuickActions() {
  return (
    <section className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Actions Rapides</h3>
      <div className="flex flex-wrap gap-4">
        {actions.map((action, index) => (
          <Button
            key={index}
            
            variant={action.color as 'primary' | 'success'}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </section>
  );
}