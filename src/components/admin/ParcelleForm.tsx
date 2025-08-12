/* eslint-disable @typescript-eslint/no-explicit-any */
// components/dashboard/ParcelleForm.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Upload, MapPin, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { useUsers } from "@/hooks/useUser";
import { useBloc } from "@/hooks/useBlocsAdmin";
import { useLotissement } from "@/hooks/useLotissementAdmin";
import { useParcelle } from "@/hooks/useParcellesAdmin";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Schema de validation basé sur les spécifications exactes de l'API
const parcelleSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(100, "Maximum 100 caractères").optional(),
  proprietaire: z.number().min(1, "Le propriétaire est requis"),
  longeur: z.number().min(0.1, "La longueur doit être positive").optional(), // Orthographe correcte selon l'API
  superficie_m2: z.number().min(1, "La superficie doit être positive"),
  perimetre_m: z.number().min(0.1, "Le périmètre doit être positif"),
  geom: z.string().optional(),
  parcelle_bloc: z.number().min(1, "Le bloc est requis"),
});

type ParcelleFormData = z.infer<typeof parcelleSchema>;

// Interface étendue pour le formulaire (avec des champs supplémentaires non envoyés à l'API)
interface ParcelleFormInputs extends ParcelleFormData {
  bloc_lotissement?: number; // Pour le formulaire uniquement
  coordonnees_gps?: string; // Pour le formulaire uniquement
  description?: string; // Pour le formulaire uniquement
  prix?: number; // Pour le formulaire uniquement
  statut?: string; // Pour le formulaire uniquement
}

// Interface pour les parcelles basée sur les spécifications
interface Parcelle {
  id?: number;
  name: string;
  proprietaire: number;
  longueur?: number;
  superficie_m2: number;
  perimetre_m: number;
  geom?: string;
  parcelle_bloc: number;
  bloc_lotissement?: number;
  coordonnees_gps?: string;
  description?: string;
  prix?: number;
  statut: string;
  date_creation?: string;
}

interface ParcelleFormProps {
  mode: 'create' | 'edit' | 'import';
  parcelle?: Parcelle;
  onSubmit?: (data: ParcelleFormData) => void;
  onClose?: () => void;
}

export default function ParcelleForm({ 
  mode, 
  parcelle, 
  onSubmit,
  onClose
}: ParcelleFormProps) {
  const [open, setOpen] = useState(false);
  const [selectedLotissement, setSelectedLotissement] = useState<string>(
    parcelle?.bloc_lotissement?.toString() || ''
  );
  const [geojsonFile, setGeojsonFile] = useState<File | null>(null);
  const [geojsonError, setGeojsonError] = useState<string>('');
  const [parsedGeometry, setParsedGeometry] = useState<string>('');
  
  const { createParcelle, updateParcelle } = useParcelle();
  const { users } = useUsers();
  const { lotissements } = useLotissement();
  const { blocs } = useBloc();

  // Filtrer les propriétaires
  const proprietaires = users?.filter(user => user.role === 'proprietaire') || [];

  // Filtrer les blocs selon le lotissement sélectionné
  const filteredBlocs = selectedLotissement 
    ? blocs?.filter(bloc => bloc.bloc_lotissement === parseInt(selectedLotissement))
    : [];

  const form = useForm<ParcelleFormInputs>({
    resolver: zodResolver(parcelleSchema),
    defaultValues: {
      name: parcelle?.name || '',
      proprietaire: parcelle?.proprietaire || 0,
      longeur: parcelle?.longueur || undefined, // Orthographe correcte
      superficie_m2: parcelle?.superficie_m2 || 0,
      perimetre_m: parcelle?.perimetre_m || 0,
      geom: parcelle?.geom || '',
      parcelle_bloc: parcelle?.parcelle_bloc || 0,
      bloc_lotissement: parcelle?.bloc_lotissement || 0,
      coordonnees_gps: parcelle?.coordonnees_gps || '',
      description: parcelle?.description || '',
      prix: parcelle?.prix || undefined,
      statut: (parcelle?.statut as any) || 'Disponible',
    },
  });

  // Calculer automatiquement le périmètre si longueur et superficie sont renseignées
  const longeur = form.watch('longeur'); // Orthographe correcte
  const superficie = form.watch('superficie_m2');

  useEffect(() => {
    if (longeur && superficie && longeur > 0 && superficie > 0) {
      const largeur = superficie / longeur;
      const perimetre = 2 * (longeur + largeur);
      form.setValue('perimetre_m', Math.round(perimetre * 100) / 100);
    }
  }, [longeur, superficie, form]);

  // Fonction pour lire et parser le fichier GeoJSON
  const handleGeojsonUpload = async (file: File) => {
    setGeojsonError('');
    setGeojsonFile(file);

    try {
      const fileContent = await file.text();
      const geojsonData = JSON.parse(fileContent);

      // Vérifier que c'est bien un GeoJSON valide
      if (!geojsonData.type) {
        throw new Error('Format GeoJSON invalide');
      }

      let geometry = null;
      let properties = null;

      // Gérer différents types de GeoJSON
      if (geojsonData.type === 'Feature') {
        geometry = geojsonData.geometry;
        properties = geojsonData.properties;
      } else if (geojsonData.type === 'FeatureCollection') {
        if (geojsonData.features && geojsonData.features.length > 0) {
          geometry = geojsonData.features[0].geometry;
          properties = geojsonData.features[0].properties;
        }
      } else if (geojsonData.type === 'Polygon' || geojsonData.type === 'MultiPolygon') {
        geometry = geojsonData;
      }

      if (!geometry) {
        throw new Error('Aucune géométrie trouvée dans le fichier');
      }

      // Convertir la géométrie en WKT
      const wktGeometry = convertGeojsonToWkt(geometry);
      setParsedGeometry(wktGeometry);
      form.setValue('geom', wktGeometry);

      // Extraire les propriétés utiles si disponibles
      if (properties) {
        if (properties.name && !form.getValues('name')) {
          form.setValue('name', properties.name);
        }
        if (properties.superficie && !form.getValues('superficie_m2')) {
          form.setValue('superficie_m2', parseFloat(properties.superficie));
        }
        if (properties.description && !form.getValues('description')) {
          form.setValue('description', properties.description);
        }
      }

      // Calculer la superficie si ce n'est pas fourni
      if (geometry.type === 'Polygon' && !form.getValues('superficie_m2')) {
        const area = calculatePolygonArea(geometry.coordinates[0]);
        if (area > 0) {
          form.setValue('superficie_m2', Math.round(area));
        }
      }

    } catch (error) {
      setGeojsonError(error instanceof Error ? error.message : 'Erreur lors du traitement du fichier');
      console.error('Erreur GeoJSON:', error);
    }
  };

  // Fonction pour convertir GeoJSON en WKT
  const convertGeojsonToWkt = (geometry: any): string => {
    switch (geometry.type) {
      case 'Polygon':
        const coords = geometry.coordinates[0].map((coord: number[]) => `${coord[0]} ${coord[1]}`).join(', ');
        return `POLYGON((${coords}))`;
      
      case 'MultiPolygon':
        const polygons = geometry.coordinates.map((polygon: number[][][]) => {
          const coords = polygon[0].map((coord: number[]) => `${coord[0]} ${coord[1]}`).join(', ');
          return `((${coords}))`;
        }).join(', ');
        return `MULTIPOLYGON(${polygons})`;
      
      case 'Point':
        return `POINT(${geometry.coordinates[0]} ${geometry.coordinates[1]})`;
      
      case 'LineString':
        const lineCoords = geometry.coordinates.map((coord: number[]) => `${coord[0]} ${coord[1]}`).join(', ');
        return `LINESTRING(${lineCoords})`;
      
      default:
        return JSON.stringify(geometry);
    }
  };

  // Fonction pour calculer la superficie d'un polygone (approximative)
  const calculatePolygonArea = (coordinates: number[][]): number => {
    let area = 0;
    const n = coordinates.length;
    
    for (let i = 0; i < n - 1; i++) {
      const j = (i + 1) % n;
      area += coordinates[i][0] * coordinates[j][1];
      area -= coordinates[j][0] * coordinates[i][1];
    }
    
    return Math.abs(area) / 2 * 111319.5 * 111319.5; // Conversion approximative en m²
  };

  const handleSubmit = async (data: ParcelleFormInputs) => {
    try {
      // Préparer les données selon les spécifications exactes de l'API
      const apiData: ParcelleFormData = {
        name: data.name,
        proprietaire: data.proprietaire,
        longeur: data.longeur, // Orthographe correcte selon l'API
        superficie_m2: data.superficie_m2,
        perimetre_m: data.perimetre_m,
        geom: data.geom,
        parcelle_bloc: data.parcelle_bloc,
      };

      // Nettoyer les valeurs undefined/null
      const cleanedData = Object.fromEntries(
        Object.entries(apiData).filter(([_, value]) => value !== undefined && value !== null && value !== '')
      );

      console.log('Données envoyées à l\'API:', cleanedData);

      if (mode === 'create') {
        await createParcelle(cleanedData as Omit<Parcelle, 'id'>);
      } else if (mode === 'edit' && parcelle?.id) {
        await updateParcelle(parcelle.id, cleanedData as Omit<Parcelle, 'id'>);
      }
      
      onSubmit?.(cleanedData as Omit<Parcelle, 'id'>);
      setOpen(false);
      form.reset();
      setSelectedLotissement('');
      onClose?.();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const getDialogTitle = () => {
    switch (mode) {
      case 'create': return 'Nouvelle Parcelle';
      case 'edit': return 'Modifier Parcelle';
      case 'import': return 'Importer Parcelles';
      default: return 'Parcelle';
    }
  };

  const getButtonText = () => {
    switch (mode) {
      case 'create': return 'Nouvelle Parcelle';
      case 'edit': return 'Modifier';
      case 'import': return 'Import';
      default: return 'Action';
    }
  };

  const getButtonIcon = () => {
    switch (mode) {
      case 'create': return <Plus className="h-4 w-4 mr-2" />;
      case 'edit': return <Edit className="h-4 w-4" />;
      case 'import': return <Upload className="h-4 w-4 mr-2" />;
      default: return null;
    }
  };

  // Mode Import
  if (mode === 'import') {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            {getButtonIcon()}
            {getButtonText()}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Importer des parcelles</DialogTitle>
            <DialogDescription>
              Sélectionnez un fichier CSV ou Excel pour importer plusieurs parcelles
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-slate-400" />
              <div className="mt-2">
                <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                  Choisir un fichier
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  onChange={(e) => {
                    console.log('Fichier sélectionné:', e.target.files?.[0]);
                    // Gérer l'import du fichier
                  }}
                />
              </div>
              <p className="text-sm text-slate-600 mt-2">
                Formats acceptés: CSV, Excel (.xlsx, .xls)
              </p>
            </div>
            <div className="text-sm text-slate-600">
              <p className="font-medium mb-2">Format attendu:</p>
              <ul className="text-xs space-y-1">
                <li>• name: Nom de la parcelle</li>
                <li>• proprietaire_id: ID du propriétaire</li>
                <li>• superficie_m2: Superficie en m²</li>
                <li>• bloc_lotissement: ID du lotissement</li>
                <li>• bloc_id: ID du bloc</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === 'create' ? (
          <Button className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900">
            {getButtonIcon()}
            {getButtonText()}
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="hover:bg-orange-50 hover:text-orange-600">
            {getButtonIcon()}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Créer une nouvelle parcelle' : 'Modifier les informations de la parcelle'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Informations de base */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-900">Informations générales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de la parcelle *</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: Parcelle A1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="statut"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statut *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Statut" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Disponible">Disponible</SelectItem>
                          <SelectItem value="Réservé">Réservé</SelectItem>
                          <SelectItem value="Vendu">Vendu</SelectItem>
                          <SelectItem value="En litige">En litige</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Localisation */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-900">Localisation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bloc_lotissement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lotissement *</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(parseInt(value));
                          setSelectedLotissement(value);
                          form.setValue('parcelle_bloc', 0); // Reset bloc selection
                        }} 
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un lotissement" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {lotissements?.map((lotissement) => (
                            <SelectItem key={lotissement.id} value={lotissement.id.toString()}>
                              {lotissement.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="parcelle_bloc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bloc *</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))} 
                        defaultValue={field.value?.toString()}
                        disabled={!selectedLotissement}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un bloc" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredBlocs?.map((bloc) => (
                            <SelectItem key={bloc.id} value={bloc.id.toString()}>
                              {bloc.name} - {lotissements?.find(l => l.id === bloc.bloc_lotissement)?.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Propriétaire et prix */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-900">Propriété</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="proprietaire"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Propriétaire *</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))} 
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un propriétaire" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {proprietaires.map((proprietaire) => (
                            <SelectItem key={proprietaire.id} value={proprietaire.id.toString()}>
                              {proprietaire.full_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="prix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix (FCFA)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="5000000" 
                          {...field} 
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Dimensions */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-900">Dimensions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="superficie_m2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Superficie (m²) *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="500.00" 
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="longeur"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longueur (m)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="25.00" 
                          {...field} 
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="perimetre_m"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Périmètre (m) *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="90.00" 
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {longeur && superficie && (
                <p className="text-sm text-slate-600">
                  Largeur calculée: {Math.round((superficie / longeur) * 100) / 100} m
                </p>
              )}
            </div>

            {/* Localisation GPS et géométrie */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-900 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Géolocalisation
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="coordonnees_gps"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coordonnées GPS</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="3.848,11.502 (latitude,longitude)" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Upload GeoJSON */}
                <div className="space-y-3">
                  <FormLabel>Géométrie de la parcelle</FormLabel>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">
                          Importer un fichier GeoJSON
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('geojson-upload')?.click()}
                      >
                        Parcourir
                      </Button>
                    </div>
                    
                    <input
                      id="geojson-upload"
                      type="file"
                      accept=".geojson,.json"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleGeojsonUpload(file);
                        }
                      }}
                    />
                    
                    {geojsonFile && (
                      <div className="text-sm text-green-600 mb-2">
                        ✓ Fichier chargé: {geojsonFile.name}
                      </div>
                    )}
                    
                    {geojsonError && (
                      <div className="text-sm text-red-600 mb-2">
                        ✗ Erreur: {geojsonError}
                      </div>
                    )}
                    
                    <p className="text-xs text-slate-500">
                      Formats acceptés: .geojson, .json (Feature, FeatureCollection, ou géométrie directe)
                    </p>
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="geom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Géométrie (WKT)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="POLYGON((x1 y1, x2 y2, x3 y3, x4 y4, x1 y1))"
                          className="resize-none h-24 font-mono text-xs"
                          {...field} 
                        />
                      </FormControl>
                      <div className="text-xs text-slate-500 mt-1">
                        La géométrie sera automatiquement remplie lors de l&apos;import GeoJSON
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {parsedGeometry && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm font-medium text-green-800">
                        Géométrie extraite du GeoJSON
                      </span>
                    </div>
                    <div className="text-xs text-green-700 font-mono bg-white p-2 rounded border max-h-20 overflow-y-auto">
                      {parsedGeometry.length > 200 ? `${parsedGeometry.substring(0, 200)}...` : parsedGeometry}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Description de la parcelle, particularités, équipements, etc."
                        className="resize-none h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">
                {mode === 'create' ? 'Créer la parcelle' : 'Modifier la parcelle'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}