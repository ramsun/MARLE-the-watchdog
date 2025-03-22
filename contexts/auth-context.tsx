"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { type User, getCurrentUser, loginUser, logoutUser, registerUser } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const result = await loginUser(email, password)
    if (result) {
      localStorage.setItem("auth_token", result.token)
      const user = getCurrentUser()
      setUser(user)
      return true
    }
    return false
  }

  const register = async (email: string, password: string, name: string) => {
    const result = await registerUser(email, password, name)
    if (result) {
      localStorage.setItem("auth_token", result.token)
      const user = getCurrentUser()
      setUser(user)
      return true
    }
    return false
  }

  const logout = () => {
    logoutUser()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

