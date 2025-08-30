'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationAlertProps {
  open: boolean;
  mode: 'create' | 'edit';
  resourceName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationAlert = ({
  open,
  mode,
  resourceName,
  onConfirm,
  onCancel
}: ConfirmationAlertProps) => {
  const messages = {
    create: {
      title: 'Confirmation de création',
      description: `Êtes-vous sûr de vouloir créer ${resourceName} ? Cette action est irréversible.`
    },
    edit: {
      title: 'Confirmation de modification',
      description: `Êtes-vous sûr de vouloir appliquer vos changements sur ${resourceName}?`
    }
  };

  const currentMessage = messages[mode];

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <AlertDialogTitle>{currentMessage.title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            {currentMessage.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {mode === 'create' ? 'Créer' : 'Modifier'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationAlert;