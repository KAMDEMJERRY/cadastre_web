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

//VALIDATION AVEC ZOD
const formSchema = z.object({
  email: z.string().email("Email saisie est  invalide"),
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
      </form>
    </Form>
    </>
  )
}