import Table from '@/components/ui/Table/Table';
import TableRow from '@/components/ui/Table/TableRow';
import TableCell from '@/components/ui/Table/TableCell';
import Button from '@/components/ui/Button2';

type Lotissement = {
  id: string;
  nom: string;
  adresse: string;
  dateCreation: string;
};

export default function LotissementsTable({ data }: { data: Lotissement[] }) {
  return (
    <section id="lotissements" className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Lotissements</h3>
      <Table>
        <thead>
          <TableRow header>
            <TableCell header>Nom</TableCell>
            <TableCell header>Adresse</TableCell>
            <TableCell header>Date de Création</TableCell>
            <TableCell header>Actions</TableCell>
          </TableRow>
        </thead>
        <tbody>
          {data.map((lotissement) => (
            <TableRow key={lotissement.id}>
              <TableCell>{lotissement.nom}</TableCell>
              <TableCell>{lotissement.adresse}</TableCell>
              <TableCell>{lotissement.dateCreation}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Modifier
                  </Button>
                  <Button variant="danger" size="sm">
                    Supprimer
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </section>
  );
}