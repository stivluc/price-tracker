import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center">
            <img
              src="/castorama_logo.png"
              alt="Castorama Logo"
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
        <img
          src="/castorama_auth_illustration.jpg"
          alt="Authentication illustration"
          className="absolute inset-0 h-full w-full object-cover brightness-[0.8] dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
