// Utilisateur par défaut

import { User } from "@/types/user";

export const DEFAULT_USER: User = {
  id: 'default-123',
  email: 'invite@example.com',
  username: 'invite',
  firstname: 'Invité',
  lastname: 'Temporaire',
  role: 'proprietaire', // ou le rôle que vous voulez par défaut
};
