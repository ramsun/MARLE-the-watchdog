"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface BusStop {
  id: string
  name: string
  position: { x: number; y: number }
  routes: string[]
}

interface BusRoute {
  id: string
  name: string
  color: string
  path: { x: number; y: number }[]
}

interface BusMapProps {
  onStopSelect: (stopId: string) => void
}

// Mock data for demonstration
const busStops: BusStop[] = [
  { id: "stop1", name: "Downtown Terminal", position: { x: 150, y: 150 }, routes: ["101", "202", "303"] },
  { id: "stop2", name: "Central Park", position: { x: 250, y: 100 }, routes: ["101", "404"] },
  { id: "stop3", name: "University Campus", position: { x: 350, y: 200 }, routes: ["202", "505"] },
  { id: "stop4", name: "Shopping Mall", position: { x: 200, y: 300 }, routes: ["303", "404"] },
  { id: "stop5", name: "Hospital", position: { x: 300, y: 350 }, routes: ["505"] },
]

const busRoutes: BusRoute[] = [
  {
    id: "101",
    name: "Blue Line",
    color: "#3b82f6",
    path: [
      { x: 150, y: 150 },
      { x: 200, y: 125 },
      { x: 250, y: 100 },
    ],
  },
  {
    id: "202",
    name: "Red Line",
    color: "#ef4444",
    path: [
      { x: 150, y: 150 },
      { x: 250, y: 175 },
      { x: 350, y: 200 },
    ],
  },
  {
    id: "303",
    name: "Green Line",
    color: "#22c55e",
    path: [
      { x: 150, y: 150 },
      { x: 175, y: 225 },
      { x: 200, y: 300 },
    ],
  },
  {
    id: "404",
    name: "Yellow Line",
    color: "#eab308",
    path: [
      { x: 250, y: 100 },
      { x: 225, y: 200 },
      { x: 200, y: 300 },
    ],
  },
  {
    id: "505",
    name: "Purple Line",
    color: "#a855f7",
    path: [
      { x: 350, y: 200 },
      { x: 325, y: 275 },
      { x: 300, y: 350 },
    ],
  },
]

export function BusMap({ onStopSelect }: BusMapProps) {
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([])
  const [hoveredStop, setHoveredStop] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapSize, setMapSize] = useState({ width: 500, height: 400 })

  useEffect(() => {
    const updateMapSize = () => {
      if (mapRef.current) {
        setMapSize({
          width: mapRef.current.clientWidth,
          height: 400, // Fixed height or you could make this responsive too
        })
      }
    }

    updateMapSize()
    window.addEventListener("resize", updateMapSize)
    return () => window.removeEventListener("resize", updateMapSize)
  }, [])

  const toggleRoute = (routeId: string) => {
    setSelectedRoutes((prev) => (prev.includes(routeId) ? prev.filter((id) => id !== routeId) : [...prev, routeId]))
  }

  const filteredRoutes = selectedRoutes.length
    ? busRoutes.filter((route) => selectedRoutes.includes(route.id))
    : busRoutes

  const filteredStops = busStops.filter(
    (stop) => selectedRoutes.length === 0 || stop.routes.some((route) => selectedRoutes.includes(route)),
  )

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {busRoutes.map((route) => (
          <Button
            key={route.id}
            variant="outline"
            size="sm"
            className={cn("border-2", selectedRoutes.includes(route.id) && "bg-accent")}
            style={{ borderColor: route.color }}
            onClick={() => toggleRoute(route.id)}
          >
            {route.name}
          </Button>
        ))}
      </div>

      <div
        ref={mapRef}
        className="relative h-[400px] w-full overflow-hidden rounded-md bg-accent"
        style={{ backgroundImage: "url('/placeholder.svg?height=400&width=600')", backgroundSize: "cover" }}
      >
        {/* Draw routes */}
        <svg width="100%" height="100%" className="absolute inset-0">
          {filteredRoutes.map((route) => (
            <polyline
              key={route.id}
              points={route.path.map((p) => `${p.x},${p.y}`).join(" ")}
              stroke={route.color}
              strokeWidth="4"
              fill="none"
            />
          ))}
        </svg>

        {/* Draw stops */}
        <TooltipProvider>
          {filteredStops.map((stop) => (
            <Tooltip key={stop.id} open={hoveredStop === stop.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "absolute h-8 w-8 rounded-full border-2 border-primary bg-background p-0",
                    hoveredStop === stop.id && "ring-2 ring-primary",
                  )}
                  style={{
                    left: `${stop.position.x}px`,
                    top: `${stop.position.y}px`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onMouseEnter={() => setHoveredStop(stop.id)}
                  onMouseLeave={() => setHoveredStop(null)}
                  onClick={() => onStopSelect(stop.id)}
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <div className="text-sm font-medium">{stop.name}</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {stop.routes.map((routeId) => {
                    const route = busRoutes.find((r) => r.id === routeId)
                    return route ? (
                      <Badge key={routeId} style={{ backgroundColor: route.color }} className="text-white">
                        {route.name}
                      </Badge>
                    ) : null
                  })}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>

        {/* User location (simulated) */}
        <div
          className="absolute h-6 w-6 animate-pulse rounded-full bg-blue-500 opacity-75"
          style={{ left: "150px", top: "250px", transform: "translate(-50%, -50%)" }}
        ></div>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        <p>Click on a bus stop to see arrival times and details.</p>
        <p>Select route buttons above to filter the map view.</p>
      </div>
    </div>
  )
}

