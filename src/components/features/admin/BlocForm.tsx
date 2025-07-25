'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button3';
import { Input } from '@/components/ui/Input1';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

export function BlocForm() {
  const [formData, setFormData] = useState({
    name: '',
    lotissement: '',
    rues: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Soumission du formulaire
    console.log('Formulaire soumis:', formData);
  };

  return (
    <section className="mb-8 bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Ajouter un Bloc</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom</Label>
          <Input
            id="name"
            placeholder="Nom du bloc"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lotissement">Lotissement</Label>
          <Select
            value={formData.lotissement}
            onValueChange={(value) => setFormData({...formData, lotissement: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un lotissement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cite-verte">Cité Verte</SelectItem>
              <SelectItem value="mvog-ada">Mvog-Ada</SelectItem>
              <SelectItem value="odza">Odza</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rues">Rues associées</Label>
          <Input
            id="rues"
            placeholder="Ex: Rue 1, Rue 2"
            value={formData.rues}
            onChange={(e) => setFormData({...formData, rues: e.target.value})}
          />
        </div>

        <div className="md:col-span-2">
          <Button type="submit">Créer Bloc</Button>
        </div>
      </form>
    </section>
  );
}