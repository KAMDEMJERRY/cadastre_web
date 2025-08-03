"use client" // Si vous utilisez Next.js

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} 
from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
} from "@/components/ui/alert-dialog"

//VALIDATION AVEC ZOD
const formSchema = z.object({
  email: z.string().email("L'email saisie est invalide"),
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères"),
})

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  //TEST SOUMISSION
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <>
    <div>
     <h1>🏘️ CadastreWeb</h1>
     <p>Système de Gestion de Lotissements</p>
    </div>

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Champ Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="votre_adresse_mail@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Champ Mot de passe */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          Se connecter
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
           <p style={{textDecoration: 'underline', cursor: 'pointer'}}>Mot de passe oublié ? </p>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Entrez votre adresse mail</AlertDialogTitle>
              <AlertDialogDescription>
                <p>Un mot de passe sera envoyé  l'adresse mail mentionnée</p>
                 <Input type="email" placeholder="Email" />
                <p>En cas d'autres problèmes veillez contacter l'administration</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Fermer</AlertDialogCancel>
              <AlertDialogAction>Valider</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </form>
    </Form>
    </>
  )
}