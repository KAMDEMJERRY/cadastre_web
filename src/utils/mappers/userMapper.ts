import { ProfileAdministrateur } from './../../types/ui/dashboard';
import { ProprietaireProfile } from "@/types/ui/proprietaire";
import { User } from "@/types/user";

export const mapUserToProprietaire = (user: User | null): ProprietaireProfile => {
  // Retourne toujours un ProprietaireProfile (même pour user null)
  return {
    idCadastrale: user?.id_cadastrale ?? 'N/A',
    cni: user?.num_cni ?? 'N/A',
    nom: user?.full_name ?? user?.nom_organization ?? 'Invité',
    email: user?.email ?? 'non.authentifie@example.com',
    type: user?.account_type ?? 'IND',
    role: user?.role ?? 'proprietaire',
    status: user?.is_active ?? false
  };
};

export const mapUserToAdminProfile = (user: User):ProfileAdministrateur => {
  return {
    idCadastrale: user.id_cadastrale ?? "ADMIN",
    nom: user.full_name,
    email: user.email
  };

}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const buildUserData = (data:any) => {
  // Valider les champs obligatoires
  if (!data.email || !data.account_type) {
    throw new Error("Données manquantes");
  }

  return {
    email: data.email,
    username: data.username || data.email.split('@')[0],
    password: data.password || generateTempPassword(), // À implémenter
    id_cadastrale: data.id_cadastrale || generateCadastralId(data), // À implémenter
    genre: ['M', 'F'].includes(data.genre) ? data.genre : 'M',
    date_naissance: data.date_naissance || null,
    num_cni: data.num_cni || null,
    addresse: data.addresse || null,
    num_telephone: data.num_telephone ? data.num_telephone.slice(0, 9) : null,
    account_type: data.account_type === 'ORG' ? 'ORG' : 'IND',
    domaine: data.domaine || null,
    nom_organization: data.account_type === 'ORG' ? data.nom_organization : null
  };
};

function generateTempPassword() {
  // Générer un mot de passe temporaire aléatoire
  return Math.random().toString(36).slice(-8); // Exemple simple, à améliorer pour la sécurité
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateCadastralId(data:any){
  const a = data;
  return "CAD"+Math.random().toString(36).slice(-8); // Exemple simple, à améliorer pour la sécurité

}