"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Users, Target, MapPin, Building2, Calendar, TrendingUp, Filter } from "lucide-react"
import { IndiaMap } from "@/components/india-map"

const projectsByYear = [
  { year: "2019", projects: 45, students: 320 },
  { year: "2020", projects: 52, students: 385 },
  { year: "2021", projects: 68, students: 465 },
  { year: "2022", projects: 78, students: 520 },
  { year: "2023", projects: 92, students: 640 },
  { year: "2024", projects: 105, students: 735 },
]

const projectsBySDG = [
  { sdg: "Quality Education", count: 78, color: "hsl(10, 70%, 55%)" },
  { sdg: "Good Health", count: 65, color: "hsl(120, 65%, 45%)" },
  { sdg: "Clean Water", count: 52, color: "hsl(200, 75%, 50%)" },
  { sdg: "Zero Hunger", count: 48, color: "hsl(40, 80%, 55%)" },
  { sdg: "Decent Work", count: 45, color: "hsl(350, 70%, 50%)" },
  { sdg: "Other SDGs", count: 152, color: "hsl(260, 50%, 50%)" },
]

const projectsBySector = [
  { sector: "Education", count: 145 },
  { sector: "Healthcare", count: 98 },
  { sector: "Environment", count: 76 },
  { sector: "Social Welfare", count: 67 },
  { sector: "Infrastructure", count: 54 },
]

const projectsByPartner = [
  { type: "NGO", count: 185, percentage: 42 },
  { type: "Government", count: 165, percentage: 38 },
  { type: "Private Sector", count: 90, percentage: 20 },
]

const geographyData = [
  { location: "North Goa", projects: 210 },
  { location: "South Goa", projects: 185 },
  { location: "Outside Goa", projects: 45 },
]

export default function DashboardPage() {
  const [selectedYear, setSelectedYear] = useState("all")
  const [selectedSDG, setSelectedSDG] = useState("all")
  const [selectedSector, setSelectedSector] = useState("all")
  const [selectedPartner, setSelectedPartner] = useState("all")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-10">
          <div className="flex flex-col gap-3">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">GiveGoa Live Dashboard</h1>
              <p className="text-base md:text-lg text-muted-foreground mt-3 leading-relaxed">
                Real-time insights into community engagement projects led by GIM students
              </p>
            </div>
            <p className="text-sm md:text-base text-muted-foreground max-w-4xl leading-relaxed">
              Filter projects by year, SDG alignment, sector, partner type, and geography to understand how student
              initiatives contribute to sustainable development across Goa and beyond. This dashboard is dynamically
              updated from the GiveGoa data repository and supports institutional reporting, accreditation, and
              stakeholder engagement.
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-10">
        {/* Filters Section */}
        <Card className="mb-8 md:mb-10">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Filter className="h-5 w-5 flex-shrink-0" />
              Filter Projects
            </CardTitle>
            <CardDescription className="text-base">
              Refine the dashboard data by selecting specific criteria
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Year</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                    <SelectItem value="2020">2020</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">SDG Alignment</label>
                <Select value={selectedSDG} onValueChange={setSelectedSDG}>
                  <SelectTrigger>
                    <SelectValue placeholder="All SDGs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All SDGs</SelectItem>
                    <SelectItem value="education">Quality Education (SDG 4)</SelectItem>
                    <SelectItem value="health">Good Health (SDG 3)</SelectItem>
                    <SelectItem value="water">Clean Water (SDG 6)</SelectItem>
                    <SelectItem value="hunger">Zero Hunger (SDG 2)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Sector</label>
                <Select value={selectedSector} onValueChange={setSelectedSector}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Sectors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sectors</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="environment">Environment</SelectItem>
                    <SelectItem value="social">Social Welfare</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Partner Type</label>
                <Select value={selectedPartner} onValueChange={setSelectedPartner}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Partners" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Partners</SelectItem>
                    <SelectItem value="ngo">NGO</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="private">Private Sector</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedYear("all")
                  setSelectedSDG("all")
                  setSelectedSector("all")
                  setSelectedPartner("all")
                }}
              >
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-8 md:mb-10">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-4xl font-bold">440</div>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 flex-shrink-0 text-green-500" />
                    <span className="text-green-500 font-medium">+14%</span> from last year
                  </p>
                </div>
                <Target className="h-10 w-10 flex-shrink-0 text-muted-foreground opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Students Engaged</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-4xl font-bold">3,065</div>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 flex-shrink-0 text-green-500" />
                    <span className="text-green-500 font-medium">+15%</span> from last year
                  </p>
                </div>
                <Users className="h-10 w-10 flex-shrink-0 text-muted-foreground opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Partner Organizations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-4xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground mt-2">Across all sectors</p>
                </div>
                <Building2 className="h-10 w-10 flex-shrink-0 text-muted-foreground opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Geographic Reach</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-4xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground mt-2">Districts covered</p>
                </div>
                <MapPin className="h-10 w-10 flex-shrink-0 text-muted-foreground opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Projects Over Time */}
          <Card>
            <CardHeader className="pb-6">
              <CardTitle className="text-xl">Project Growth Over Time</CardTitle>
              <CardDescription className="text-base">
                Number of projects and student participation by year
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ChartContainer
                config={{
                  projects: {
                    label: "Projects",
                    color: "hsl(200, 75%, 50%)",
                  },
                  students: {
                    label: "Students",
                    color: "hsl(260, 50%, 50%)",
                  },
                }}
                className="h-[320px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={projectsByYear}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="projects"
                      stroke="hsl(200, 75%, 50%)"
                      strokeWidth={2}
                      name="Projects"
                    />
                    <Line
                      type="monotone"
                      dataKey="students"
                      stroke="hsl(260, 50%, 50%)"
                      strokeWidth={2}
                      name="Students"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Projects by Sector */}
          <Card>
            <CardHeader className="pb-6">
              <CardTitle className="text-xl">Projects by Sector</CardTitle>
              <CardDescription className="text-base">Distribution across different focus areas</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ChartContainer
                config={{
                  count: {
                    label: "Projects",
                    color: "hsl(200, 75%, 50%)",
                  },
                }}
                className="h-[320px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectsBySector}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="sector" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="hsl(200, 75%, 50%)" name="Projects" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 md:mb-10">
          {/* SDG Alignment */}
          <Card>
            <CardHeader className="pb-6">
              <CardTitle className="text-xl">SDG Alignment</CardTitle>
              <CardDescription className="text-base">
                Projects aligned with UN Sustainable Development Goals
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ChartContainer
                config={{
                  count: {
                    label: "Projects",
                  },
                }}
                className="h-[320px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectsBySDG}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => {
                        if (!entry || !entry.sdg) return ""
                        const percent = entry.percent || 0
                        return `${entry.sdg} ${(percent * 100).toFixed(0)}%`
                      }}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="sdg"
                    >
                      {projectsBySDG.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Partner Distribution */}
          <Card>
            <CardHeader className="pb-6">
              <CardTitle className="text-xl">Partner Type Distribution</CardTitle>
              <CardDescription className="text-base">Collaboration with different organization types</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-6 pt-4">
                {projectsByPartner.map((partner) => (
                  <div key={partner.type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="font-medium text-base">{partner.type}</div>
                        <Badge variant="secondary" className="text-sm">
                          {partner.count} projects
                        </Badge>
                      </div>
                      <div className="text-sm font-medium text-muted-foreground">{partner.percentage}%</div>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${partner.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Geography Section */}
        <Card className="mb-8 md:mb-10">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl">Geographic Distribution</CardTitle>
            <CardDescription className="text-base">Project locations across Goa and beyond</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="mb-8">
              <IndiaMap />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {geographyData.map((location) => (
                <div
                  key={location.location}
                  className="flex items-center gap-4 p-5 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                >
                  <MapPin className="h-10 w-10 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-base">{location.location}</div>
                    <div className="text-3xl font-bold mt-1">{location.projects}</div>
                    <div className="text-xs text-muted-foreground mt-1">projects</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="mt-8 p-5 bg-muted/50 rounded-lg border">
          <p className="text-sm text-muted-foreground text-center flex items-center justify-center gap-2">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>Dashboard last updated: December 23, 2025 | Data sourced from GiveGoa Repository</span>
          </p>
        </div>
      </main>
    </div>
  )
}
