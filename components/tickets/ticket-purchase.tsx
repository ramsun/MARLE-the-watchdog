"use client"

import { useState, useEffect } from "react"
import { Calendar, CreditCard, MapPin, Plus, Ticket } from "lucide-react"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

interface TicketType {
  id: string
  type: string
  price: number
  validFrom: string
  validUntil: string
  zones: string[]
}

export function TicketPurchase() {
  const [ticketType, setTicketType] = useState("single")
  const [quantity, setQuantity] = useState(1)
  const [zones, setZones] = useState<string[]>(["A"])
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [userTickets, setUserTickets] = useState<TicketType[]>([])

  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    // Load user tickets from localStorage
    const storedTickets = localStorage.getItem("user_tickets")
    if (storedTickets) {
      setUserTickets(JSON.parse(storedTickets))
    }
  }, [])

  const ticketPrices = {
    single: 2.5,
    day: 8.0,
    week: 35.0,
    month: 120.0,
  }

  const calculatePrice = () => {
    const basePrice = ticketPrices[ticketType as keyof typeof ticketPrices]
    const zoneMultiplier = zones.length * 0.5 + 0.5 // 1.0 for 1 zone, 1.5 for 2 zones, etc.
    return basePrice * zoneMultiplier * quantity
  }

  const handleZoneToggle = (zone: string) => {
    setZones((prev) => (prev.includes(zone) ? prev.filter((z) => z !== zone) : [...prev, zone]))
  }

  const handlePurchase = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to purchase tickets",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // Simulate API call
    setTimeout(() => {
      const now = new Date()

      // Calculate validity period based on ticket type
      const validUntil = new Date(now)
      switch (ticketType) {
        case "single":
          validUntil.setHours(validUntil.getHours() + 2) // 2 hours
          break
        case "day":
          validUntil.setHours(23, 59, 59) // End of day
          break
        case "week":
          validUntil.setDate(validUntil.getDate() + 7) // 7 days
          break
        case "month":
          validUntil.setMonth(validUntil.getMonth() + 1) // 1 month
          break
      }

      // Create new tickets
      const newTickets: TicketType[] = Array.from({ length: quantity }, (_, i) => ({
        id: `ticket_${Date.now()}_${i}`,
        type: ticketType,
        price: calculatePrice() / quantity,
        validFrom: now.toISOString(),
        validUntil: validUntil.toISOString(),
        zones: [...zones],
      }))

      // Update state and localStorage
      const updatedTickets = [...userTickets, ...newTickets]
      setUserTickets(updatedTickets)
      localStorage.setItem("user_tickets", JSON.stringify(updatedTickets))

      toast({
        title: "Purchase successful",
        description: `You have purchased ${quantity} ${ticketType} ticket${quantity > 1 ? "s" : ""}`,
      })

      setIsProcessing(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Purchase Tickets</CardTitle>
          <CardDescription>Buy tickets for your journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Ticket Type</Label>
            <RadioGroup value={ticketType} onValueChange={setTicketType} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="single" id="single" />
                <Label htmlFor="single" className="flex items-center gap-2">
                  <Ticket className="h-4 w-4" />
                  <span>Single Journey (2 hours)</span>
                </Label>
                <span className="ml-auto font-medium">${ticketPrices.single.toFixed(2)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="day" id="day" />
                <Label htmlFor="day" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Day Pass (24 hours)</span>
                </Label>
                <span className="ml-auto font-medium">${ticketPrices.day.toFixed(2)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="week" id="week" />
                <Label htmlFor="week" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Weekly Pass (7 days)</span>
                </Label>
                <span className="ml-auto font-medium">${ticketPrices.week.toFixed(2)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="month" id="month" />
                <Label htmlFor="month" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Monthly Pass (30 days)</span>
                </Label>
                <span className="ml-auto font-medium">${ticketPrices.month.toFixed(2)}</span>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Zones</Label>
            <div className="flex flex-wrap gap-2">
              {["A", "B", "C", "D"].map((zone) => (
                <Button
                  key={zone}
                  type="button"
                  variant={zones.includes(zone) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleZoneToggle(zone)}
                  className="flex items-center gap-1"
                >
                  <MapPin className="h-3 w-3" />
                  <span>Zone {zone}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <div className="flex items-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <Input
                id="quantity"
                type="number"
                min="1"
                max="10"
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                className="mx-2 w-16 text-center"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                disabled={quantity >= 10}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Credit/Debit Card</span>
                  </div>
                </SelectItem>
                <SelectItem value="paypal">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">Pay</span>
                    <span className="text-blue-800">Pal</span>
                  </div>
                </SelectItem>
                <SelectItem value="apple">
                  <div className="flex items-center gap-2">
                    <span>Apple Pay</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex w-full items-center justify-between rounded-lg bg-muted p-4">
            <span className="text-sm font-medium">Total Price:</span>
            <span className="text-lg font-bold">${calculatePrice().toFixed(2)}</span>
          </div>
          <Button onClick={handlePurchase} className="w-full" disabled={isProcessing || zones.length === 0}>
            {isProcessing ? "Processing..." : "Purchase Tickets"}
          </Button>
        </CardFooter>
      </Card>

      {userTickets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Tickets</CardTitle>
            <CardDescription>View your active tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userTickets.map((ticket) => {
                const validFrom = new Date(ticket.validFrom)
                const validUntil = new Date(ticket.validUntil)
                const isActive = new Date() < validUntil

                return (
                  <div
                    key={ticket.id}
                    className={`rounded-lg border p-3 ${
                      isActive ? "border-green-500 bg-green-50" : "border-gray-200 bg-gray-50 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Ticket className={`h-4 w-4 ${isActive ? "text-green-500" : "text-gray-400"}`} />
                        <span className="font-medium capitalize">{ticket.type} Ticket</span>
                      </div>
                      <Badge variant={isActive ? "default" : "outline"}>{isActive ? "Active" : "Expired"}</Badge>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <div>Zones: {ticket.zones.join(", ")}</div>
                      <div>
                        Valid from: {validFrom.toLocaleDateString()} {validFrom.toLocaleTimeString()}
                      </div>
                      <div>
                        Valid until: {validUntil.toLocaleDateString()} {validUntil.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

