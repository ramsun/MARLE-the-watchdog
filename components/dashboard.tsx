"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bus, LogOut, Settings, TicketIcon, User } from "lucide-react"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BusRouteApp from "@/components/bus-route-app"
import { TicketPurchase } from "@/components/tickets/ticket-purchase"
import { SystemLogs } from "@/components/admin/system-logs"

export function Dashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bus className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">MetroRoute</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {user.name} ({user.role})
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <Tabs defaultValue="routes">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-none">
          <TabsTrigger value="routes" className="flex items-center gap-1">
            <Bus className="h-4 w-4" />
            <span>Routes</span>
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center gap-1">
            <TicketIcon className="h-4 w-4" />
            <span>Tickets</span>
          </TabsTrigger>
          {user.role === "auditor" && (
            <TabsTrigger value="system" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span>System Logs</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="routes" className="mt-6">
          <BusRouteApp />
        </TabsContent>

        <TabsContent value="tickets" className="mt-6">
          <TicketPurchase />
        </TabsContent>

        {user.role === "auditor" && (
          <TabsContent value="system" className="mt-6">
            <SystemLogs />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

