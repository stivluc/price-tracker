"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

interface AuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithMicrosoft: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated on mount
    const auth = Cookies.get("isAuthenticated")
    if (auth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (email: string, password: string) => {
    // Dummy authentication - any credentials will work
    Cookies.set("isAuthenticated", "true", { expires: 7 }) // Expires in 7 days
    setIsAuthenticated(true)
    router.push("/") // Redirect to home after login
  }

  const loginWithMicrosoft = async () => {
    // Dummy Microsoft authentication
    Cookies.set("isAuthenticated", "true", { expires: 7 }) // Expires in 7 days
    setIsAuthenticated(true)
    router.push("/") // Redirect to home after login
  }

  const logout = () => {
    Cookies.remove("isAuthenticated")
    setIsAuthenticated(false)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, loginWithMicrosoft, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 