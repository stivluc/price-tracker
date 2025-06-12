import Image from "next/image"
import { LoginForm } from "@/components/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Price Tracker account.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginPage() {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center">
            <Image
              src="/images/castorama_logo.png"
              alt="Castorama Logo"
              width={128}
              height={32}
              className="h-8 w-auto"
            />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/images/castorama_auth_illustration.jpg"
          alt="Authentication illustration"
          fill
          className="object-cover brightness-[0.8] dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
