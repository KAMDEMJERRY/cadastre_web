import { AccountType, APIUserFeature,APIUsersResponse, Genre, User, UserCreatePayload, UserUpdatePayload } from "@/types/user";
import { apiClient } from "../client"




export const UserService = {
    async getUsers(): Promise<User[]>{
        const response = await apiClient.get<APIUsersResponse>(`/accounts/users/`);
     
        console.log("Response from User fetch API:", response);
        const users = processUsers(response);
        console.log("Processed Users:", users);
        alert();
        return users;
    },

    async postUser(userData: Omit<UserCreatePayload, 'id'>): Promise<User>{
       console.log(userData);
        alert(userData);
       
        const response = await apiClient.post<User>(`/accounts/users/`, userData);
        return response;

    },

    async updateUser(id: number, userData: Omit<UserUpdatePayload, 'id'>): Promise<User>{
        const response = await apiClient.put<User>(`/accouts/users/${id}/`, userData);
        return response;
    },

    async deleteUser(id: number): Promise<void> {
     try {
          // Maintenant cela fonctionne correctement avec les réponses vides
          await apiClient.delete(`/accounts/users/${id}/`);
          console.log(`Utilisateurs ${id} supprimé avec succès`);
      } catch (error) {
          console.error("Erreur lors de la suppression:", error);
          throw error;
      }
    },

    

    async assignRole(id: number, roleData: {role: string}): Promise<void>{
        const response = await apiClient.post<User>(`accounts/users/${id}/assign_role/`, roleData)
    },
    
    async deactivate(id: number): Promise<void>{
        const response = await apiClient.post<User>(`accounts/users/${id}/deactivate/`, null);
    },

    async activate(id: number): Promise<void>{
        const response = await apiClient.post<User>(`accounts/users/${id}/activate/`, null);
    },

    // async usersStats(): Promise<Map<undefined, undefined>>{
    //     const response = await apiClient.post<undefined>(`accounts/users/${id}/deactivate/`, null);
    //     return processStats(response)
    // }
}



export function processUsers(apiResponse: APIUsersResponse):User[]{
        if((!apiResponse.results) || !Array.isArray(apiResponse.results)){
            console.warn('Aucun utilisateur trouve dans la reponse');
            return [];
        }
        return apiResponse.results
            .filter(user => isValidUser(user));
}
export function isValidUser(user: User): boolean {
  console.log("isValidLotissement called with user:", user);
  return !!(user); 
}


export function transformToUser(feature: APIUserFeature): User {
  const properties = feature.properties;
  
  // Fonction helper pour obtenir le display du genre
  const getGenreDisplay = (genre: Genre): string => {
    switch (genre) {
      case 'M': return 'Masculin';
      case 'F': return 'Féminin';
      default: return 'Non spécifié';
    }
  };
  
  // Fonction helper pour obtenir le display du type de compte

  
  return {
    // Propriétés de BaseUser
    id: feature.id,
    email: properties.email,
    username: properties.username,
    genre: properties.genre,
    date_naissance: properties.date_naissance,
    id_cadastrale: properties.id_cadastrale,
    num_cni: properties.num_cni,
    addresse: properties.addresse,
    num_telephone: properties.num_telephone,
    account_type: properties.account_type,
    domaine: properties.domaine,
    nom_organization: properties.nom_organization,
    is_active: properties.is_active,
    date_joined: properties.date_joined,
    last_login: properties.last_login,
    
    // Propriétés spécifiques à User
    full_name: properties.full_name,
    genre_display: getGenreDisplay(properties.genre),
    account_type_display: properties.account_type,
    role: properties.role
  };
}
// export type Genre = 'M' | 'F';
// export type AccountType = 'IND' | 'ORG';
// export type UserRole = 'admin' | 'agent' | 'proprietaire';

// export interface BaseUser {
//   id: number;
//   email: string;
//   username?: string | null;
//   genre: Genre;
//   date_naissance?: string | null; // Date en format ISO (YYYY-MM-DD)
//   id_cadastrale?: string;
//   num_cni?: string | null;
//   addresse?: string | null;
//   num_telephone?: string | null;
//   account_type: AccountType;
//   domaine?: string | null;
//   nom_organization?: string | null;
//   is_active: boolean;
//   date_joined: string; // DateTime en format ISO
//   last_login?: string | null; // DateTime en format ISO
// }

// export interface User extends BaseUser {
//   full_name: string;
//   genre_display: string;
//   account_type_display: string;
//   role: UserRole;
// }