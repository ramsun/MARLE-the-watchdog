"use client"

import type React from "react"

import { useState } from "react"
import { Bus, Clock, Heart, MapPin, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BusMap } from "@/components/bus-map"
import { BusRouteList } from "@/components/bus-route-list"
import { BusStopDetails } from "@/components/bus-stop-details"

export default function BusRouteApp() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("map")
  const [selectedStop, setSelectedStop] = useState<string | null>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would filter routes or search for destinations
    console.log("Searching for:", searchQuery)
  }

  const handleStopSelect = (stopId: string) => {
    setSelectedStop(stopId)
    setSelectedTab("stops")
  }

  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bus className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">MetroRoute</h1>
          </div>
          <Button variant="outline" size="icon">
            <Heart className="h-4 w-4" />
            <span className="sr-only">Favorites</span>
          </Button>
        </div>
        <form onSubmit={handleSearch} className="mt-4 flex gap-2">
          <Input
            type="text"
            placeholder="Search routes, stops or addresses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </form>
      </header>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="map" className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>Map</span>
          </TabsTrigger>
          <TabsTrigger value="routes" className="flex items-center gap-1">
            <Bus className="h-4 w-4" />
            <span>Routes</span>
          </TabsTrigger>
          <TabsTrigger value="stops" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Stops</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="map" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Bus Map</CardTitle>
              <CardDescription>View all bus routes and stops</CardDescription>
            </CardHeader>
            <CardContent>
              <BusMap onStopSelect={handleStopSelect} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="routes" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Bus Routes</CardTitle>
              <CardDescription>Find your route</CardDescription>
            </CardHeader>
            <CardContent>
              <BusRouteList />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="stops" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Bus Stops</CardTitle>
              <CardDescription>Check arrival times</CardDescription>
            </CardHeader>
            <CardContent>
              <BusStopDetails stopId={selectedStop} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

