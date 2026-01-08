"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CalendarIcon, CheckCircle2, MapPin, Users, IndianRupee } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const projects = [
  "Rural Education Initiative",
  "Clean Beach Campaign",
  "Women's Skill Development",
  "Healthcare Outreach Program",
  "Sustainable Farming Initiative",
  "Digital Literacy Program",
]

export default function TransportRequestPage() {
  const [formData, setFormData] = React.useState({
    projectName: "",
    pickupLocation: "",
    dropLocation: "",
    passengers: "",
    purpose: "",
    additionalNotes: "",
  })
  const [date, setDate] = React.useState<Date>()
  const [estimatedCost, setEstimatedCost] = React.useState(0)
  const [submitted, setSubmitted] = React.useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })

    // Auto-calculate estimated cost based on distance approximation
    if (field === "passengers" || field === "pickupLocation" || field === "dropLocation") {
      calculateEstimatedCost({ ...formData, [field]: value })
    }
  }

  const calculateEstimatedCost = (data: typeof formData) => {
    // Simple cost calculation logic
    const baseRate = 500
    const perPassengerRate = 100
    const passengers = Number.parseInt(data.passengers) || 0

    if (passengers > 0 && data.pickupLocation && data.dropLocation) {
      const cost = baseRate + passengers * perPassengerRate
      setEstimatedCost(cost)
    } else {
      setEstimatedCost(0)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Transport Request:", {
      ...formData,
      date: date?.toISOString(),
      estimatedCost,
    })
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      // Reset form
      setFormData({
        projectName: "",
        pickupLocation: "",
        dropLocation: "",
        passengers: "",
        purpose: "",
        additionalNotes: "",
      })
      setDate(undefined)
      setEstimatedCost(0)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="container py-6">
          <h1 className="text-3xl font-bold">Transport Request</h1>
          <p className="text-muted-foreground mt-1">Request transportation for your project activities</p>
        </div>
      </div>

      <div className="container py-8 max-w-3xl">
        {submitted && (
          <Alert className="mb-6">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Request Submitted Successfully!</AlertTitle>
            <AlertDescription>
              Your transport request has been submitted for approval. You will receive a confirmation email shortly.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Select the project for which you need transport</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project">
                  Project Name <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.projectName} onValueChange={(value) => handleInputChange("projectName", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project} value={project}>
                        {project}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">
                  Date <span className="text-destructive">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-transparent",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          {/* Location Details */}
          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
              <CardDescription>Specify pickup and drop-off locations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pickup">
                  Pickup Location <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="pickup"
                    placeholder="e.g., GIM Campus, Sanquelim"
                    value={formData.pickupLocation}
                    onChange={(e) => handleInputChange("pickupLocation", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="drop">
                  Drop Location <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="drop"
                    placeholder="e.g., Project Site, Panjim"
                    value={formData.dropLocation}
                    onChange={(e) => handleInputChange("dropLocation", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Passenger & Purpose */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>Number of passengers and purpose of travel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="passengers">
                  Number of Passengers <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="passengers"
                    type="number"
                    min="1"
                    max="50"
                    placeholder="e.g., 5"
                    value={formData.passengers}
                    onChange={(e) => handleInputChange("passengers", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">
                  Purpose <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="purpose"
                  placeholder="Brief description of the purpose of travel"
                  value={formData.purpose}
                  onChange={(e) => handleInputChange("purpose", e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requirements or additional information"
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Estimated Cost */}
          {estimatedCost > 0 && (
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5" />
                  Estimated Cost
                </CardTitle>
                <CardDescription>Approximate cost based on your request</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">₹{estimatedCost}</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Final cost may vary based on actual distance and vehicle type
                </p>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <Button type="submit" size="lg" className="w-full" disabled={submitted}>
            Submit Transport Request
          </Button>
        </form>
      </div>
    </div>
  )
}
