// components/dashboard/UserActions.tsx
import { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Trash2, 
  UserCheck, 
  UserX, 
  Shield, 
  MapPin,
  Calendar,
  Mail,
  Phone,
  Building,
  User
} from "lucide-react";
import { User as UserType } from '@/types/user';

// Action pour voir les détails d'un utilisateur
interface ViewUserProps {
  user: UserType;
}

export function ViewUser({ user }: ViewUserProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'agent': return 'Agent';
      case 'proprietaire': return 'Propriétaire';
      default: return role;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'agent': return 'bg-blue-100 text-blue-800';
      case 'proprietaire': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Détails de l&apos;utilisateur
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <User className="h-4 w-4" />
                Informations personnelles
              </div>
              <div className="pl-6 space-y-1">
                <p><strong>Nom :</strong> {user.full_name}</p>
                <p><strong>Username :</strong> {user.username}</p>
                <p><strong>Genre :</strong> {user.genre === 'M' ? 'Masculin' : user.genre === 'F' ? 'Féminin' : 'Non spécifié'}</p>
                <p><strong>Date de naissance :</strong> {user.date_naissance ? formatDate(user.date_naissance) : 'Non renseignée'}</p>
                <p><strong>CNI :</strong> {user.num_cni || 'Non renseignée'}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Mail className="h-4 w-4" />
                Contact
              </div>
              <div className="pl-6 space-y-1">
                <p><strong>Email :</strong> {user.email}</p>
                <p><strong>Téléphone :</strong> {user.num_telephone || 'Non renseigné'}</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  <span className="text-sm">{user.addresse || 'Adresse non renseignée'}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Building className="h-4 w-4" />
              Informations de compte
            </div>
            <div className="pl-6 space-y-2">
              <div className="flex items-center gap-4">
                <Badge className={getRoleBadgeColor(user.role)}>
                  {getRoleLabel(user.role)}
                </Badge>
                <Badge className={user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {user.is_active ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
              <p><strong>Type de compte :</strong> {user.account_type}</p>
              {user.account_type.toString() === 'entreprise' && (
                <>
                  <p><strong>Organisation :</strong> {user.nom_organization || 'Non renseignée'}</p>
                  <p><strong>Domaine :</strong> {user.domaine || 'Non renseigné'}</p>
                </>
              )}
              {/* <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="h-3 w-3" />
                Créé le {formatDate(user.date_naissance)}
              </div>
              {user.updated_at && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="h-3 w-3" />
                  Modifié le {formatDate(user.updated_at)}
                </div>
              )} */}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Action pour supprimer un utilisateur
interface DeleteUserProps {
  user: UserType;
  onDelete: (userId: number) => void;
}

export function DeleteUser({ user, onDelete }: DeleteUserProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="hover:bg-red-50 hover:text-red-600">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer l&apos;utilisateur</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer <strong>{user.full_name}</strong> ?
            Cette action est irréversible et supprimera définitivement toutes les données associées.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete(user.id)}
            className="bg-red-600 hover:bg-red-700"
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Action pour activer/désactiver un utilisateur
interface ToggleUserStatusProps {
  user: UserType;
  onToggle: (userId: number, isActive: boolean) => void;
}

export function ToggleUserStatus({ user, onToggle }: ToggleUserStatusProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={user.is_active ? "hover:bg-red-50 hover:text-red-600" : "hover:bg-green-50 hover:text-green-600"}
        >
          {user.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {user.is_active ? 'Désactiver' : 'Activer'} le compte
          </AlertDialogTitle>
          <AlertDialogDescription>
            {user.is_active ? (
              <>
                Êtes-vous sûr de vouloir désactiver le compte de <strong>{user.full_name}</strong> ?
                L&apos;utilisateur ne pourra plus se connecter à son compte.
              </>
            ) : (
              <>
                Êtes-vous sûr de vouloir activer le compte de <strong>{user.full_name}</strong> ?
                L&apos;utilisateur pourra à nouveau se connecter à son compte.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onToggle(user.id, !user.is_active)}
            className={user.is_active ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
          >
            {user.is_active ? 'Désactiver' : 'Activer'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Action pour assigner un rôle (spécifique aux admins)
interface AssignRoleProps {
  user: UserType;
  onAssignRole: (userId: number, role: string) => void;
  currentUserRole?: string; // Pour vérifier les permissions
}

export function AssignRole({ user, onAssignRole, currentUserRole }: AssignRoleProps) {
  const [selectedRole, setSelectedRole] = useState<string>(user.role);
  const [open, setOpen] = useState(false);

  const handleAssignRole = () => {
    if (selectedRole !== user.role) {
      onAssignRole(user.id, selectedRole);
    }
    setOpen(false);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'agent': return 'Agent';
      case 'proprietaire': return 'Propriétaire';
      default: return role;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'agent': return 'bg-blue-100 text-blue-800';
      case 'proprietaire': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Vérifier si l'utilisateur actuel peut modifier les rôles
  const canEditRole = currentUserRole === 'admin';

  if (!canEditRole) {
    return null; // Ne pas afficher le bouton si pas de permissions
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="hover:bg-purple-50 hover:text-purple-600">
          <Shield className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assigner un rôle</DialogTitle>
          <DialogDescription>
            Modifier le rôle de <strong>{user.full_name}</strong>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Rôle actuel</label>
            <div className="mt-1">
              <Badge className={getRoleBadgeColor(user.role)}>
                {getRoleLabel(user.role)}
              </Badge>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Nouveau rôle</label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrateur</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="proprietaire">Propriétaire</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {selectedRole !== user.role && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Attention :</strong> Changer le rôle affectera les permissions de l&apos;utilisateur.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleAssignRole} disabled={selectedRole === user.role}>
            Assigner le rôle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Composant principal qui regroupe toutes les actions
interface UserActionsProps {
  user: UserType;
  onDelete: (userId: number) => void;
  onToggleStatus: (userId: number, isActive: boolean) => void;
  onAssignRole: (userId: number, role: string) => void;
  currentUserRole?: string;
  showActions?: {
    view?: boolean;
    delete?: boolean;
    toggleStatus?: boolean;
    assignRole?: boolean;
  };
}

export function UserActions({ 
  user, 
  onDelete, 
  onToggleStatus, 
  onAssignRole, 
  currentUserRole,
  showActions = {
    view: true,
    delete: true,
    toggleStatus: true,
    assignRole: true
  }
}: UserActionsProps) {
  return (
    <div className="flex items-center gap-1">
      {showActions.view && <ViewUser user={user} />}
      {showActions.toggleStatus && (
        <ToggleUserStatus user={user} onToggle={onToggleStatus} />
      )}
      {showActions.assignRole && (
        <AssignRole 
          user={user} 
          onAssignRole={onAssignRole} 
          currentUserRole={currentUserRole}
        />
      )}
      {showActions.delete && (
        <DeleteUser user={user} onDelete={onDelete} />
      )}
    </div>
  );
}