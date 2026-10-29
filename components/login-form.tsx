"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { FormEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { Info } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { login, loginWithMicrosoft } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (Cookies.get("isAuthenticated") === "true") router.replace("/")
  }, [router])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    await login(email, password)
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Connexion</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Saisissez votre e-mail pour accéder au tableau de bord
        </p>
      </div>
      <div className="flex gap-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          <span className="font-medium">Démo :</span> aucune authentification réelle.
          Saisissez n&apos;importe quel e-mail et mot de passe, ou utilisez le bouton Microsoft.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" placeholder="nom@exemple.com" required />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Mot de passe</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Mot de passe oublié ?
            </a>
          </div>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Se connecter
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Ou continuer avec
          </span>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          className="w-full"
          onClick={loginWithMicrosoft}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
            <path
              d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"
              fill="currentColor"
            />
          </svg>
          Se connecter avec Microsoft
        </Button>
      </div>
      <div className="text-center text-sm">
        Pas encore de compte ?{" "}
        <a href="#" className="underline underline-offset-4">
          Créer un compte
        </a>
      </div>
    </form>
  )
}
