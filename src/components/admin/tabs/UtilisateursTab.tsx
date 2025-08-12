// components/dashboard/tabs/UtilisateursTab.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UserForm from "../UserForm";
import { ViewUser, DeleteUser, ToggleUserStatus, AssignRole } from "../UserActions";
import { useUsers, useUser } from "@/hooks/useUser";
import { User } from "@/types/user";

interface UtilisateursTabProps {
  userType: 'admin' | 'proprietaire';
}

export default function UtilisateursTab({  userType }: UtilisateursTabProps) {

  // const {users:utilisateurs, deleteUser, toggleUserStatus, assignRole } = useUsers();
  const {users:utilisateurs, deleteUser } = useUsers();
  
  const { user: currentUser } = useUser();

  // Filtrer les utilisateurs selon le type d'onglet ET les données déjà filtrées
  const filteredUsers = utilisateurs?.filter(user => {
    if (userType === 'admin') {
      return user.role === 'admin' || user.role === 'agent';
    }
    return user.role === 'proprietaire';
  });

  // Fonction pour vérifier si l'utilisateur connecté peut modifier un autre utilisateur
  const canEditUser = (targetUser: User) => {
    if (!currentUser) return false;
    
    // Admin peut tout faire
    if (currentUser.role === 'admin') return true;
    
    // Agent peut seulement modifier les propriétaires
    if (currentUser.role === 'agent') {
      return targetUser.role === 'proprietaire';
    }
    
    return false;
  };

  // Fonction pour vérifier si l'utilisateur connecté peut supprimer un autre utilisateur
  const canDeleteUser = (targetUser: User) => {
    if (!currentUser) return false;
    
    // Admin peut supprimer tout le monde sauf lui-même
    if (currentUser.role === 'admin') {
      return targetUser.id !== currentUser.id;
    }
    
    // Agent peut seulement supprimer les propriétaires
    if (currentUser.role === 'agent') {
      return targetUser.role === 'proprietaire';
    }
    
    return false;
  };

  // Fonction pour vérifier si l'utilisateur connecté peut assigner des rôles
  const canAssignRole = (targetUser: User) => {
    if (!currentUser) return false;
    
    // Seuls les admins peuvent assigner des rôles
    // Et ils ne peuvent pas modifier leur propre rôle
    return currentUser.role === 'admin' && targetUser.id !== currentUser.id;
  };

  const handleDeleteUser = (userId: number) => {
    deleteUser(userId);
  };

  const handleToggleStatus = (userId: number, isActive: boolean) => {
    toggleUserStatus(userId, isActive);
  };

  const handleAssignRole = (userId: number, role: string) => {
    assignRole(userId, role);
  };

  const getTitle = () => {
    return userType === 'admin' ? 'Gestion des Administrateurs' : 'Gestion des Propriétaires';
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'agent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'proprietaire':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
        Actif
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
        Inactif
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
          {getTitle()}
        </h3>
        
        <UserForm mode="create" userType={userType} />
      </div>
      
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardContent className="p-0">
          <div className="rounded-md border overflow-x-auto max-h-96">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Type de compte
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredUsers?.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900 dark:text-slate-50">
                        {user.username}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {user.username}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900 dark:text-slate-50">
                        {user.email}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {user.num_telephone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role === 'admin' ? 'Administrateur' : 
                         user.role === 'agent' ? 'Agent' : 'Propriétaire'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.is_active)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                      {user.account_type === 'IND' ? 'Particulier' :
                       user.account_type === 'ORG' ? 'Organisation' : 'Entreprise'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <div className="flex items-center space-x-2">
                        <ViewUser user={user} />
                        
                        {canEditUser(user) && (
                          <UserForm mode="edit" user={user} userType={userType} />
                        )}
                        
                        {canEditUser(user) && (
                          <ToggleUserStatus 
                            user={user} 
                            onToggle={handleToggleStatus} 
                          />
                        )}
                        
                        {canAssignRole(user) && (
                          <AssignRole 
                            user={user} 
                            onAssignRole={handleAssignRole} 
                          />
                        )}
                        
                        {canDeleteUser(user) && (
                          <DeleteUser 
                            user={user} 
                            onDelete={handleDeleteUser}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Message si aucun utilisateur */}
          {filteredUsers?.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500 dark:text-slate-400">
                Aucun {userType === 'admin' ? 'administrateur' : 'propriétaire'} trouvé.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}