export type UserRole = 'agent' | 'proprietaire' | 'admin';
export interface User{
    id: string;
    email: string;
    username: string;
    firstname: string;
    lastname: string;
    role: UserRole;
}

