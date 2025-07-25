import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table/Table1';
import { Button } from '@/components/ui/Button3';
import Link from 'next/link';

type Bloc = {
  id: string;
  name: string;
  lotissement: string;
  rues: string[];
};

export function BlocTable({ blocs }: { blocs: Bloc[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Lotissement</TableHead>
          <TableHead>Rues</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {blocs.map((bloc) => (
          <TableRow key={bloc.id}>
            <TableCell>{bloc.name}</TableCell>
            <TableCell>{bloc.lotissement}</TableCell>
            <TableCell>{bloc.rues.join(', ')}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/blocs/${bloc.id}`}>Modifier</Link>
              </Button>
              <Button variant="destructive" size="sm">
                Supprimer
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}