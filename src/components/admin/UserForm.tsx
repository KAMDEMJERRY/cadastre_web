// components/dashboard/UserForm.tsx
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { UserPlus, Edit, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useUsers } from "@/hooks/useUser";
import { User, UserCreatePayload, UserUpdatePayload } from "@/types/user";
import { buildUpdatedData, buildUserData } from "@/utils/mappers/userMapper";
import { AssignRole } from "./UserActions";
import { ApiError } from "@/types/api";
import { Alert, AlertDescription } from "../ui/alert";

interface UserFormProps {
  mode: "create" | "edit";
  user?: User;
  userType: "admin" | "proprietaire" | "agent";
}

interface UserFormData {
  full_name: string;
  email: string;
  username?: string;
  num_cni?: string;
  num_telephone?: string;
  addresse?: string;
  genre: "M" | "F";
  account_type: string;
  role: string;
  is_active: boolean;
  date_naissance?: string;
  id_cadastrale?: string;
  domaine?: string;
  nom_organization?: string;
  password: string;
}

export default function UserForm({ mode, user, userType }: UserFormProps) {
  const [open, setOpen] = useState(false);
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string>("");
  const { createUser, updateUser, assignRole, toggleUserStatus } = useUsers();

  const form = useForm<UserFormData>({
    defaultValues: {
      full_name: user?.username || "",
      email: user?.email || "",
      username: user?.username || "",
      num_cni: user?.num_cni || "",
      num_telephone: user?.num_telephone || "",
      addresse: user?.addresse || "",
      genre: user?.genre || "M",
      account_type: user?.account_type || "particulier",
      role:
        userType === "admin"
          ? "admin"
          : userType === "agent"
          ? "agent"
          : "proprietaire",
      date_naissance: user?.date_naissance || "",
      id_cadastrale: user?.id_cadastrale || "",
      domaine: user?.domaine || "",
      nom_organization: user?.nom_organization || "",
      password: "",
    },
  });

  const handleSubmit = async (data: UserFormData) => {
    setApiErrors({});
    setGlobalError("");

    try {
      const userData = buildUserData(data);
      console.log("===========hhhhh|");
      console.log(userData);
      console.log("===========|");
      if (mode === "create") {
        const newUser = await createUser(userData as UserCreatePayload);
        assignRole(newUser.id, data.role);

        setOpen(false);
        form.reset();
      } else if (user?.id) {

        const userData = buildUpdatedData(data);
        console.log("UI");
        console.log(userData);
        const updatedUser = await updateUser(
          user.id,
          data 
        );
        console.log("Updated User");
        console.log(updatedUser);
        console.log("Updated User1");

        assignRole(user.id, data.role);

        setOpen(false);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        // Gestion des erreurs de validation Django
        if (error.errors) {
          const fieldErrors: Record<string, string> = {};

          Object.entries(error.errors).forEach(([field, messages]) => {
            // Mapping des champs Django vers les champs du formulaire
            const fieldMap: Record<string, string> = {
              email: "email",
              username: "username",
              num_cni: "num_cni",
              num_telephone: "num_telephone",
              id_cadastrale: "id_cadastrale",
              addresse: "addresse",
              date_naissance: "date_naissance",
              domaine: "domaine",
              nom_organization: "nom_organization",
              password: "password",
              genre: "genre",
              account_type: "account_type",
            };

            const formField = fieldMap[field] || field;
            fieldErrors[formField] = messages.join(", ");
          });

          setApiErrors(fieldErrors);
        } else {
          setGlobalError(error.message);
        }
      } else {
        setGlobalError("Une erreur est survenue veuillez verifiez les champs");
        console.error("Erreur lors de la sauvegarde:", error);
      }
    }
  };

  const getDialogTitle = () => {
    if (mode === "create") {
      return userType === "admin"
        ? "Nouvel Administrateur"
        : "Nouveau Propriétaire";
    }
    return userType === "admin"
      ? "Modifier Administrateur"
      : "Modifier Propriétaire";
  };

  const getButtonText = () => {
    if (mode === "create") {
      return userType === "admin" ? "Nouvel Admin" : "Nouveau Propriétaire";
    }
    return "Modifier";
  };

  const getRoleOptions = () => {
    if (userType === "admin") {
      return [
        { value: "admin", label: "Administrateur" },
        { value: "agent", label: "Agent" },
      ];
    }
    return [{ value: "proprietaire", label: "Propriétaire" }];
  };

  // Fonction pour obtenir le message d'erreur d'un champ
  const getFieldError = (fieldName: string): string | undefined => {
    return apiErrors[fieldName];
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          setApiErrors({});
          setGlobalError("");
        }
      }}
    >
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900">
            <UserPlus className="h-4 w-4 mr-2" />
            {getButtonText()}
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-orange-50 hover:text-orange-600"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Créer un nouvel utilisateur"
              : "Modifier les informations de l'utilisateur"}
          </DialogDescription>
        </DialogHeader>

        {/* Affichage des erreurs globales */}
        {globalError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{globalError}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="full_name"
                rules={{ required: "Le nom complet est requis" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom complet" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: "L'email est requis",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Format d'email invalide",
                  },
                }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@exemple.com"
                        {...field}
                        className={
                          getFieldError("email") ? "border-red-500" : ""
                        }
                      />
                    </FormControl>

                    {/* Affichage des erreurs de validation React Hook Form */}
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}

                    {/* Affichage des erreurs API */}
                    {getFieldError("email") && (
                      <FormMessage>{getFieldError("email")}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
            </div>

            {/* Identifiants */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mode === "create" && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <Input placeholder="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {mode === "create" && (
                <FormField
                  control={form.control}
                  name="num_cni"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro CNI</FormLabel>
                      <FormControl>
                        <Input placeholder="Numéro CNI" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="num_telephone"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+237 XXX XXX XXX"
                        {...field}
                        className={
                          getFieldError("num_telephone") ? "border-red-500" : ""
                        }
                      />
                    </FormControl>
                    <div className="text-sm text-gray-500">
                      Doit commencer par 6 et contenir 9 chiffres
                    </div>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                    {getFieldError("num_telephone") && (
                      <FormMessage>
                        {getFieldError("num_telephone")}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date_naissance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de naissance/creation</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Adresse */}
            <FormField
              control={form.control}
              name="addresse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Adresse complète" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Informations de compte */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="M">Masculin</SelectItem>
                        <SelectItem value="F">Féminin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {mode == "create" && (
                <FormField
                  control={form.control}
                  name="account_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de compte</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="IND">Particulier</SelectItem>
                          <SelectItem value="ORG">Organisation</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {userType === "admin" && (
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rôle</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Rôle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getRoleOptions().map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Champs spécifiques aux entreprises */}
            {form.watch("account_type") === "ORG" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nom_organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l&apos;organisation</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom de l'organisation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="domaine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domaine d&apos;activité</FormLabel>
                      <FormControl>
                        <Input placeholder="Domaine" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Champs spécifiques aux propriétaires */}
            {mode == "create" && (
              <FormField
                control={form.control}
                name="id_cadastrale"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>ID Cadastrale</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Identifiant cadastral"
                        {...field}
                        className={
                          getFieldError("id_cadastrale") ? "border-red-500" : ""
                        }
                      />
                    </FormControl>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                    {getFieldError("id_cadastrale") && (
                      <FormMessage>
                        {getFieldError("id_cadastrale")}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />
            )}

            {/* Statut du compte */}
            {mode == "create" && (
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Compte actif</FormLabel>
                      <div className="text-sm text-slate-600">
                        L&apos;utilisateur peut se connecter à son compte
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit">
                {mode === "create" ? "Créer" : "Modifier"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
