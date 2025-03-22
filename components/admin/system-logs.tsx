"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Clock, Filter, RefreshCw, Search, User } from "lucide-react"

import { type AuthEvent, getAuthEvents } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Mock system logs for demonstration
const generateMockSystemLogs = () => {
  const logTypes = [
    "system_startup",
    "system_shutdown",
    "database_backup",
    "api_error",
    "rate_limit_exceeded",
    "memory_warning",
    "disk_space_low",
    "service_unavailable",
    "cache_cleared",
  ]

  const services = [
    "auth-service",
    "database-service",
    "map-service",
    "ticket-service",
    "notification-service",
    "payment-gateway",
  ]

  const logs = []

  // Generate 50 random logs
  for (let i = 0; i < 50; i++) {
    const timestamp = new Date()
    timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 7)) // Last 7 days
    timestamp.setHours(Math.floor(Math.random() * 24))
    timestamp.setMinutes(Math.floor(Math.random() * 60))

    const logType = logTypes[Math.floor(Math.random() * logTypes.length)]
    const service = services[Math.floor(Math.random() * services.length)]
    const severity = Math.random() > 0.7 ? "error" : Math.random() > 0.5 ? "warning" : "info"

    logs.push({
      id: `log_${i}`,
      timestamp: timestamp.toISOString(),
      type: logType,
      service,
      severity,
      message: `${logType.replace(/_/g, " ")} in ${service}`,
      details: `Details for ${logType} event in ${service}`,
    })
  }

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

// Mock AI anomaly detection logs
const generateMockAnomalyLogs = () => {
  const anomalyTypes = [
    "unusual_login_pattern",
    "multiple_failed_attempts",
    "unusual_ticket_purchase",
    "suspicious_ip_address",
    "unusual_device",
    "unusual_time_of_day",
    "rapid_account_switching",
  ]

  const logs = []

  // Generate 20 random anomaly logs
  for (let i = 0; i < 20; i++) {
    const timestamp = new Date()
    timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 14)) // Last 14 days
    timestamp.setHours(Math.floor(Math.random() * 24))
    timestamp.setMinutes(Math.floor(Math.random() * 60))

    const anomalyType = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)]
    const confidence = Math.floor(Math.random() * 50) + 50 // 50-99%
    const userId = `user_${Math.floor(Math.random() * 1000)}`
    const ipAddress = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`

    logs.push({
      id: `anomaly_${i}`,
      timestamp: timestamp.toISOString(),
      type: anomalyType,
      userId,
      ipAddress,
      confidence,
      status: Math.random() > 0.3 ? "resolved" : "open",
      details: `AI detected ${anomalyType.replace(/_/g, " ")} for user ${userId} from IP ${ipAddress}`,
    })
  }

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export function SystemLogs() {
  const [activeTab, setActiveTab] = useState("auth")
  const [authLogs, setAuthLogs] = useState<AuthEvent[]>([])
  const [systemLogs, setSystemLogs] = useState<any[]>([])
  const [anomalyLogs, setAnomalyLogs] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load logs
    const loadLogs = () => {
      setIsLoading(true)

      // Get auth logs from localStorage
      const authEvents = getAuthEvents()

      // Generate mock system and anomaly logs
      const sysLogs = generateMockSystemLogs()
      const anomalies = generateMockAnomalyLogs()

      setAuthLogs(authEvents)
      setSystemLogs(sysLogs)
      setAnomalyLogs(anomalies)
      setIsLoading(false)
    }

    loadLogs()
  }, [])

  const refreshLogs = () => {
    setIsLoading(true)

    // Simulate refresh
    setTimeout(() => {
      const authEvents = getAuthEvents()
      const sysLogs = generateMockSystemLogs()
      const anomalies = generateMockAnomalyLogs()

      setAuthLogs(authEvents)
      setSystemLogs(sysLogs)
      setAnomalyLogs(anomalies)
      setIsLoading(false)
    }, 800)
  }

  const filterAuthLogs = () => {
    let filtered = [...authLogs]

    if (searchQuery) {
      filtered = filtered.filter(
        (log) =>
          log.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.type.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (filterType !== "all") {
      filtered = filtered.filter((log) => log.type === filterType)
    }

    return filtered
  }

  const filterSystemLogs = () => {
    let filtered = [...systemLogs]

    if (searchQuery) {
      filtered = filtered.filter(
        (log) =>
          log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.type.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (filterType !== "all") {
      filtered = filtered.filter((log) => log.severity === filterType)
    }

    return filtered
  }

  const filterAnomalyLogs = () => {
    let filtered = [...anomalyLogs]

    if (searchQuery) {
      filtered = filtered.filter(
        (log) =>
          log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.type.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (filterType !== "all") {
      filtered = filtered.filter((log) => log.status === filterType)
    }

    return filtered
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>System Logs</CardTitle>
            <CardDescription>View authentication, system, and anomaly logs</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshLogs} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {activeTab === "auth" && (
                  <>
                    <SelectItem value="successful_login">Successful Login</SelectItem>
                    <SelectItem value="failed_login">Failed Login</SelectItem>
                    <SelectItem value="logout">Logout</SelectItem>
                    <SelectItem value="registration">Registration</SelectItem>
                  </>
                )}
                {activeTab === "system" && (
                  <>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </>
                )}
                {activeTab === "anomaly" && (
                  <>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value)
            setFilterType("all")
          }}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="auth" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>Auth Logs</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>System Logs</span>
            </TabsTrigger>
            <TabsTrigger value="anomaly" className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              <span>AI Anomalies</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="auth" className="mt-4">
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 border-b bg-muted p-4 font-medium">
                <div className="col-span-3">Timestamp</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-3">Email</div>
                <div className="col-span-4">Details</div>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {filterAuthLogs().length > 0 ? (
                  filterAuthLogs().map((log, index) => (
                    <div
                      key={`${log.email}-${log.timestamp}`}
                      className={`grid grid-cols-12 gap-4 p-4 text-sm ${
                        index % 2 === 0 ? "bg-background" : "bg-muted/30"
                      }`}
                    >
                      <div className="col-span-3 text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</div>
                      <div className="col-span-2">
                        <Badge
                          variant={
                            log.type === "failed_login"
                              ? "destructive"
                              : log.type === "successful_login"
                                ? "default"
                                : "outline"
                          }
                        >
                          {log.type.replace(/_/g, " ")}
                        </Badge>
                      </div>
                      <div className="col-span-3">{log.email}</div>
                      <div className="col-span-4 text-muted-foreground">
                        IP: {log.ip} | {log.userAgent.substring(0, 30)}...
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">No logs found</div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="system" className="mt-4">
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 border-b bg-muted p-4 font-medium">
                <div className="col-span-3">Timestamp</div>
                <div className="col-span-2">Severity</div>
                <div className="col-span-3">Service</div>
                <div className="col-span-4">Message</div>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {filterSystemLogs().length > 0 ? (
                  filterSystemLogs().map((log, index) => (
                    <div
                      key={log.id}
                      className={`grid grid-cols-12 gap-4 p-4 text-sm ${
                        index % 2 === 0 ? "bg-background" : "bg-muted/30"
                      }`}
                    >
                      <div className="col-span-3 text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</div>
                      <div className="col-span-2">
                        <Badge
                          variant={
                            log.severity === "error"
                              ? "destructive"
                              : log.severity === "warning"
                                ? "default"
                                : "outline"
                          }
                        >
                          {log.severity}
                        </Badge>
                      </div>
                      <div className="col-span-3">{log.service}</div>
                      <div className="col-span-4 text-muted-foreground">{log.message}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">No logs found</div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="anomaly" className="mt-4">
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 border-b bg-muted p-4 font-medium">
                <div className="col-span-3">Timestamp</div>
                <div className="col-span-2">Confidence</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-5">Details</div>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {filterAnomalyLogs().length > 0 ? (
                  filterAnomalyLogs().map((log, index) => (
                    <div
                      key={log.id}
                      className={`grid grid-cols-12 gap-4 p-4 text-sm ${
                        index % 2 === 0 ? "bg-background" : "bg-muted/30"
                      }`}
                    >
                      <div className="col-span-3 text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</div>
                      <div className="col-span-2">
                        <Badge
                          variant={log.confidence > 80 ? "destructive" : log.confidence > 65 ? "default" : "outline"}
                        >
                          {log.confidence}% confidence
                        </Badge>
                      </div>
                      <div className="col-span-2">
                        <Badge variant={log.status === "open" ? "destructive" : "outline"}>{log.status}</Badge>
                      </div>
                      <div className="col-span-5 text-muted-foreground">{log.details}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">No anomalies found</div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

