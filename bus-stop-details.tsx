"use client"

import { useEffect, useState } from "react"
import { Bus, Clock, MapPin } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface BusStopDetailsProps {
  stopId: string | null
}

interface BusArrival {
  routeId: string
  routeName: string
  routeColor: string
  destination: string
  arrivalTime: string
  minutesAway: number
}

// Mock data for demonstration
const busStops = {
  stop1: {
    id: "stop1",
    name: "Downtown Terminal",
    address: "123 Main Street",
    amenities: ["Shelter", "Bench", "Lighting"],
    arrivals: [
      {
        routeId: "101",
        routeName: "Blue Line",
        routeColor: "#3b82f6",
        destination: "Central Park",
        arrivalTime: "10:15 AM",
        minutesAway: 5,
      },
      {
        routeId: "202",
        routeName: "Red Line",
        routeColor: "#ef4444",
        destination: "University Campus",
        arrivalTime: "10:20 AM",
        minutesAway: 10,
      },
      {
        routeId: "303",
        routeName: "Green Line",
        routeColor: "#22c55e",
        destination: "Shopping Mall",
        arrivalTime: "10:22 AM",
        minutesAway: 12,
      },
    ],
  },
  stop2: {
    id: "stop2",
    name: "Central Park",
    address: "45 Park Avenue",
    amenities: ["Bench", "Lighting"],
    arrivals: [
      {
        routeId: "101",
        routeName: "Blue Line",
        routeColor: "#3b82f6",
        destination: "Downtown Terminal",
        arrivalTime: "10:30 AM",
        minutesAway: 8,
      },
      {
        routeId: "404",
        routeName: "Yellow Line",
        routeColor: "#eab308",
        destination: "Shopping Mall",
        arrivalTime: "10:35 AM",
        minutesAway: 13,
      },
    ],
  },
  stop3: {
    id: "stop3",
    name: "University Campus",
    address: "789 University Drive",
    amenities: ["Shelter", "Bench", "Lighting", "Real-time display"],
    arrivals: [
      {
        routeId: "202",
        routeName: "Red Line",
        routeColor: "#ef4444",
        destination: "Downtown Terminal",
        arrivalTime: "10:25 AM",
        minutesAway: 7,
      },
      {
        routeId: "505",
        routeName: "Purple Line",
        routeColor: "#a855f7",
        destination: "Hospital",
        arrivalTime: "10:40 AM",
        minutesAway: 22,
      },
    ],
  },
  stop4: {
    id: "stop4",
    name: "Shopping Mall",
    address: "456 Commerce Boulevard",
    amenities: ["Shelter", "Bench"],
    arrivals: [
      {
        routeId: "303",
        routeName: "Green Line",
        routeColor: "#22c55e",
        destination: "Downtown Terminal",
        arrivalTime: "10:18 AM",
        minutesAway: 6,
      },
      {
        routeId: "404",
        routeName: "Yellow Line",
        routeColor: "#eab308",
        destination: "Central Park",
        arrivalTime: "10:28 AM",
        minutesAway: 16,
      },
    ],
  },
  stop5: {
    id: "stop5",
    name: "Hospital",
    address: "321 Health Street",
    amenities: ["Shelter", "Bench", "Lighting", "Accessibility ramp"],
    arrivals: [
      {
        routeId: "505",
        routeName: "Purple Line",
        routeColor: "#a855f7",
        destination: "University Campus",
        arrivalTime: "10:45 AM",
        minutesAway: 15,
      },
    ],
  },
}

export function BusStopDetails({ stopId }: BusStopDetailsProps) {
  const [loading, setLoading] = useState(true)
  const [stopData, setStopData] = useState<any>(null)

  useEffect(() => {
    // Simulate API call
    setLoading(true)

    if (stopId && busStops[stopId as keyof typeof busStops]) {
      setTimeout(() => {
        setStopData(busStops[stopId as keyof typeof busStops])
        setLoading(false)
      }, 800)
    } else {
      setLoading(false)
    }
  }, [stopId])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="space-y-2">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    )
  }

  if (!stopId || !stopData) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center text-center">
        <MapPin className="mb-2 h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-medium">No Stop Selected</h3>
        <p className="text-sm text-muted-foreground">Select a stop from the map to view arrival times and details</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-bold">{stopData.name}</h3>
        <p className="text-sm text-muted-foreground">{stopData.address}</p>

        <div className="mt-2 flex flex-wrap gap-1">
          {stopData.amenities.map((amenity: string) => (
            <Badge key={amenity} variant="outline">
              {amenity}
            </Badge>
          ))}
        </div>
      </div>

      <h4 className="mb-2 font-medium">Upcoming Arrivals</h4>

      <div className="space-y-3">
        {stopData.arrivals.map((arrival: BusArrival) => (
          <Card key={`${arrival.routeId}-${arrival.arrivalTime}`}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge style={{ backgroundColor: arrival.routeColor }} className="text-white">
                    {arrival.routeId}
                  </Badge>
                  <span className="font-medium">{arrival.routeName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{arrival.arrivalTime}</span>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Bus className="h-3 w-3" />
                  <span>To: {arrival.destination}</span>
                </div>
                <Badge variant={arrival.minutesAway <= 5 ? "default" : "outline"}>{arrival.minutesAway} min</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <Button variant="outline" size="sm">
          View Full Schedule
        </Button>
      </div>
    </div>
  )
}

