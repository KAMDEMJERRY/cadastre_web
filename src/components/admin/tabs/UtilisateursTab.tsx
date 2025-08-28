// components/dashboard/tabs/UtilisateursTab.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCallback } from "react";
import UserForm from "../UserForm";
import {
  ViewUser,
  DeleteUser,
  ToggleUserStatus,
  AssignRole,
} from "../UserActions";
import { useUsers, useUser } from "@/hooks/useUser";
import { User } from "@/types/user";


interface UtilisateursTabProps {
  userType: "admin" | "proprietaire" | "agent";
}

export default function UtilisateursTab({ userType }: UtilisateursTabProps) {
  const {
    filteredUsers,
    handleDeleteUser,
    handleToggleStatus,
    handleAssignRole,
    canEditUser,
    canDeleteUser,
    canAssignRole,
  } = useUserManagement(userType);

  // Fonctions d'affichage
  const getTitle = () =>
    userType === "admin" || "agent"
      ? "Gestion des Administrateurs"
      : "Gestion des Propriétaires";

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      admin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      agent: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      proprietaire:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      default: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    };
    return colors[role as keyof typeof colors] || colors.default;
  };

  const getStatusBadge = (isActive: boolean) => (
    <Badge
      className={
        isActive
          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      }
    >
      {isActive ? "Actif" : "Inactif"}
    </Badge>
  );

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
              {/* En-têtes de tableau inchangés */}
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
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
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
                        {user.role === "admin"
                          ? "Administrateur"
                          : user.role === "agent"
                          ? "Agent"
                          : "Propriétaire"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.is_active)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                      {user.account_type === "IND"
                        ? "Particulier"
                        : user.account_type === "ORG"
                        ? "Organisation"
                        : "Entreprise"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <div className="flex items-center space-x-2">
                        <ViewUser user={user} />

                        {canEditUser(user) && (
                          <UserForm
                            mode="edit"
                            user={user}
                            userType={userType}
                          />
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
                          <DeleteUser user={user} onDelete={handleDeleteUser} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Message si aucun utilisateur */}
          {/* {filteredUsers?.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500 dark:text-slate-400">
                Aucun {userType === 'admin' ? 'administrateur' : 'propriétair} trouvé.
              </p>
            </div>
          )} */}
        </CardContent>
      </Card>
    </div>
  );
}

// hooks/useUserManagement.ts

export function useUserManagement(userType: "admin" | "proprietaire" | "agent") {
  const {
    users: utilisateurs,
    deleteUser,
    toggleUserStatus,
    assignRole,
  } = useUsers();
  const { user: currentUser } = useUser();

  // Filtrer les utilisateurs selon le type
  const filteredUsers = utilisateurs?.filter((user) => {
    if (userType === "admin") {
      return user.role === "admin" || user.role === "agent";
    }
    return user.role === "proprietaire";
  });

  // Gestionnaires d'événements
  const handleDeleteUser = useCallback(
    (userId: number) => {
      deleteUser(userId);
    },
    [deleteUser]
  );

  const handleToggleStatus = useCallback(
    (userId: number, isActive: boolean) => {
      toggleUserStatus(userId, isActive);
    },
    [toggleUserStatus]
  );

  const handleAssignRole = useCallback(
    (userId: number, role: string) => {
      assignRole(userId, role);
    },
    [assignRole]
  );

  // Fonctions de permission
  const canEditUser = useCallback(
    (targetUser: User) => {
      if (!currentUser) return false;
      if (currentUser.role === "admin") return true;
      if (currentUser.role === "agent")
        return targetUser.role === "proprietaire";
      return false;
    },
    [currentUser]
  );

  const canDeleteUser = useCallback(
    (targetUser: User) => {
      if (!currentUser) return false;
      if (currentUser.role === "admin") return targetUser.id !== currentUser.id;
      if (currentUser.role === "agent")
        return targetUser.role === "proprietaire";
      return false;
    },
    [currentUser]
  );

  const canAssignRole = useCallback(
    (targetUser: User) => {
      if (!currentUser) return false;
      return currentUser.role === "admin" && targetUser.id !== currentUser.id;
    },
    [currentUser]
  );

  return {
    filteredUsers,
    currentUser,
    handleDeleteUser,
    handleToggleStatus,
    handleAssignRole,
    canEditUser,
    canDeleteUser,
    canAssignRole,
  };
}
