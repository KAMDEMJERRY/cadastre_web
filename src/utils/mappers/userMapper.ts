import { ProfileAdministrateur } from "./../../types/ui/dashboard";
import { ProprietaireProfile } from "@/types/ui/proprietaire";
import { User, UserCreatePayload, UserUpdatePayload } from "@/types/user";

export const mapUserToProprietaire = (
  user: User | null
): ProprietaireProfile => {
  // Retourne toujours un ProprietaireProfile (même pour user null)
  return {
    idCadastrale: user?.id_cadastrale ?? "N/A",
    cni: user?.num_cni ?? "N/A",
    nom: user?.full_name ?? user?.nom_organization ?? "Invité",
    email: user?.email ?? "non.authentifie@example.com",
    type: user?.account_type ?? "IND",
    role: user?.role ?? "proprietaire",
    status: user?.is_active ?? false,
  };
};

export const mapUserToAdminProfile = (user: User): ProfileAdministrateur => {
  return {
    idCadastrale: user.id_cadastrale ?? "ADMIN",
    nom: user.full_name,
    email: user.email,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const buildUserData = (data: any): UserCreatePayload => {
  // Valider les champs obligatoires
  if (!data.email || !data.account_type) {
    throw new Error("Données manquantes");
  }
  console.log("UserData", data);
  return {
    email: data.email,
    username: data.username || data.email.split("@")[0],
    password: data.password, // À implémenter
    id_cadastrale: data.id_cadastrale, // À implémenter
    genre: ["M", "F"].includes(data.genre) ? data.genre : "",
    date_naissance: data.date_naissance || null,
    num_cni: data.num_cni || null,
    addresse: data.addresse || null,
    num_telephone: data.num_telephone ? data.num_telephone.slice(0, 9) : null,
    account_type: data.account_type === "ORG" ? "ORG" : "IND",
    domaine: data.domaine || "",
    nom_organization: data.account_type === "ORG" ? data.nom_organization : "",
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const buildUpdatedData = (data: any) => {
  // Valider les champs obligatoires
  if (!data.email || !data.account_type) {
    throw new Error("Données manquantes");
  }
  console.log("Updated", data);
  const updatedData = {
    email: data.email,
    username: data.full_name ,
    password: data.password, // À implémenter
    id_cadastrale: data.id_cadastrale, // À implémenter
    genre: ["M", "F"].includes(data.genre) ? data.genre : "",
    date_naissance: data.date_naissance || null,
    num_cni: data.num_cni || null,
    addresse: data.addresse || null,
    num_telephone: data.num_telephone ? data.num_telephone.slice(0, 9) : null,
    account_type: data.account_type === "ORG" ? "ORG" : "IND",
    domaine: data.domaine || "",
    nom_organization: data.full_name,
  };
  return updatedData;
};
