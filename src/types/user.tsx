// types/user.ts

export type Genre = 'M' | 'F';
export type AccountType = 'IND' | 'ORG';
export type UserRole = 'admin' | 'agent' | 'proprietaire';

export interface BaseUser {
  id: number;
  email: string;
  username?: string | null;
  genre: Genre;
  date_naissance?: string | null; // Date en format ISO (YYYY-MM-DD)
  id_cadastrale?: string;
  num_cni?: string | null;
  addresse?: string | null;
  num_telephone?: string | null;
  account_type: AccountType;
  domaine?: string | null;
  nom_organization?: string | null;
  is_active: boolean;
  date_joined: string; // DateTime en format ISO
  last_login?: string | null; // DateTime en format ISO
}

export interface User extends BaseUser {
  full_name: string;
  genre_display: string;
  account_type_display: string;
  role: UserRole;
}

export interface UserCreatePayload {
  username?: string;
  email: string;
  genre: Genre;
  date_naissance?: string;
  id_cadastrale?: string;
  num_cni?: string;
  addresse?: string;
  num_telephone?: string;
  account_type: AccountType;
  domaine?: string;
  nom_organization?: string;
  password: string;
}

export interface UserUpdatePayload {
  username?: string;
  email?: string;
  genre?: Genre;
  date_naissance?: string;
  addresse?: string;
  num_telephone?: string;
  domaine?: string;
  nom_organization?: string;
}

export interface UserListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}
export interface APIUsersResponse{
  count: number;
  next?: string;
  previous?: string;
  results: User[];
}

export interface APIUserFeature{
  id: number;
  properties: Omit<User, 'id'>;
  type: string;
}