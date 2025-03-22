import { jwtDecode } from "jwt-decode"

export interface User {
  id: string
  email: string
  name: string
  role: "user" | "auditor" | "admin"
}

interface JwtPayload {
  sub: string
  email: string
  name: string
  role: "user" | "auditor" | "admin"
  exp: number
}

// Mock users for demonstration
const MOCK_USERS = [
  { email: "user@example.com", password: "password", name: "Regular User", role: "user" },
  { email: "auditor@example.com", password: "password", name: "System Auditor", role: "auditor" },
  { email: "admin@example.com", password: "password", name: "Admin User", role: "admin" },
]

export async function loginUser(email: string, password: string): Promise<{ token: string } | null> {
  // In a real app, this would be an API call to your authentication server
  const user = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

  if (!user) {
    // Log failed attempt (in a real app, this would be logged server-side)
    logAuthEvent({
      type: "failed_login",
      email,
      timestamp: new Date().toISOString(),
      ip: "192.168.1.1", // In a real app, this would be the actual IP
      userAgent: navigator.userAgent,
    })
    return null
  }

  // Log successful login
  logAuthEvent({
    type: "successful_login",
    email,
    timestamp: new Date().toISOString(),
    ip: "192.168.1.1",
    userAgent: navigator.userAgent,
  })

  // Create a JWT token (in a real app, this would be done server-side)
  const token = createMockJwt(user)
  return { token }
}

export function registerUser(email: string, password: string, name: string): Promise<{ token: string } | null> {
  // In a real app, this would be an API call to your authentication server
  // For this demo, we'll just pretend it worked
  const newUser = { email, password, name, role: "user" as const }

  // Log registration
  logAuthEvent({
    type: "registration",
    email,
    timestamp: new Date().toISOString(),
    ip: "192.168.1.1",
    userAgent: navigator.userAgent,
  })

  const token = createMockJwt(newUser)
  return Promise.resolve({ token })
}

export function logoutUser(): void {
  // In a real app, you might want to invalidate the token server-side
  localStorage.removeItem("auth_token")

  // Clear any user-specific data from localStorage
  localStorage.removeItem("user_tickets")
}

export function getCurrentUser(): User | null {
  const token = localStorage.getItem("auth_token")
  if (!token) return null

  try {
    const decoded = jwtDecode<JwtPayload>(token)

    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("auth_token")
      return null
    }

    return {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    }
  } catch (error) {
    console.error("Failed to decode JWT token", error)
    localStorage.removeItem("auth_token")
    return null
  }
}

// Helper function to create a mock JWT (in a real app, this would be done server-side)
function createMockJwt(user: { email: string; name: string; role: string }): string {
  const header = {
    alg: "HS256",
    typ: "JWT",
  }

  const payload = {
    sub: `user_${Math.random().toString(36).substring(2, 15)}`,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour from now
  }

  // In a real app, you would use a proper JWT library with a secret key
  // This is just for demonstration purposes
  const encodedHeader = btoa(JSON.stringify(header))
  const encodedPayload = btoa(JSON.stringify(payload))
  const signature = btoa(`${encodedHeader}.${encodedPayload}`)

  return `${encodedHeader}.${encodedPayload}.${signature}`
}

// Auth event logging (in a real app, this would be sent to your server)
export interface AuthEvent {
  type: "successful_login" | "failed_login" | "logout" | "registration" | "password_reset"
  email: string
  timestamp: string
  ip: string
  userAgent: string
  details?: string
}

// Store auth events in localStorage for demo purposes
export function logAuthEvent(event: AuthEvent): void {
  const events = getAuthEvents()
  events.push(event)
  localStorage.setItem("auth_events", JSON.stringify(events))
}

export function getAuthEvents(): AuthEvent[] {
  const events = localStorage.getItem("auth_events")
  return events ? JSON.parse(events) : []
}

