"use client"

import { useState } from "react"
import { ChevronRight, Clock } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data for demonstration
const busRoutes = [
  {
    id: "101",
    name: "Blue Line",
    color: "#3b82f6",
    from: "Downtown Terminal",
    to: "Central Park",
    frequency: "Every 10 min",
    status: "On Time",
  },
  {
    id: "202",
    name: "Red Line",
    color: "#ef4444",
    from: "Downtown Terminal",
    to: "University Campus",
    frequency: "Every 15 min",
    status: "Delayed",
  },
  {
    id: "303",
    name: "Green Line",
    color: "#22c55e",
    from: "Downtown Terminal",
    to: "Shopping Mall",
    frequency: "Every 12 min",
    status: "On Time",
  },
  {
    id: "404",
    name: "Yellow Line",
    color: "#eab308",
    from: "Central Park",
    to: "Shopping Mall",
    frequency: "Every 20 min",
    status: "On Time",
  },
  {
    id: "505",
    name: "Purple Line",
    color: "#a855f7",
    from: "University Campus",
    to: "Hospital",
    frequency: "Every 30 min",
    status: "On Time",
  },
]

export function BusRouteList() {
  const [filter, setFilter] = useState("")

  const filteredRoutes = busRoutes.filter(
    (route) =>
      route.name.toLowerCase().includes(filter.toLowerCase()) ||
      route.from.toLowerCase().includes(filter.toLowerCase()) ||
      route.to.toLowerCase().includes(filter.toLowerCase()) ||
      route.id.includes(filter),
  )

  return (
    <div>
      <div className="mb-4">
        <Input placeholder="Filter routes..." value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Route</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoutes.length > 0 ? (
              filteredRoutes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge style={{ backgroundColor: route.color }} className="text-white">
                        {route.id}
                      </Badge>
                      <span>{route.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{route.from}</TableCell>
                  <TableCell>{route.to}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{route.frequency}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={route.status === "On Time" ? "default" : "destructive"}>{route.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No routes found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

