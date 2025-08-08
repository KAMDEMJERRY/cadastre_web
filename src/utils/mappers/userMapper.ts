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