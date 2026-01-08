"use client"

import * as React from "react"
import Link from "next/link"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const sdgGoals = [
  "No Poverty",
  "Zero Hunger",
  "Good Health and Well-being",
  "Quality Education",
  "Gender Equality",
  "Clean Water and Sanitation",
  "Affordable and Clean Energy",
  "Decent Work and Economic Growth",
  "Industry, Innovation and Infrastructure",
  "Reduced Inequalities",
  "Sustainable Cities and Communities",
  "Responsible Consumption and Production",
  "Climate Action",
  "Life Below Water",
  "Life on Land",
  "Peace, Justice and Strong Institutions",
  "Partnerships for the Goals",
]

const sectors = [
  "Education",
  "Healthcare",
  "Environment",
  "Rural Development",
  "Women Empowerment",
  "Skill Development",
]

const partnerTypes = ["NGO", "Government", "Private"]

const locations = ["North Goa", "South Goa", "Maharashtra", "Karnataka", "Delhi NCR", "Tamil Nadu", "Kerala"]

const years = ["2024", "2023", "2022", "2021", "2020"]

// Sample project data
const allProjects = [
  {
    id: 1,
    title: "Rural Education Initiative",
    description:
      "Providing quality education to underprivileged children in rural Goa through innovative teaching methods.",
    image: "/rural-classroom.png",
    sdgs: ["Quality Education", "Reduced Inequalities"],
    sector: "Education",
    year: "2024",
    partner: "NGO",
    location: "South Goa",
    keywords: ["education", "rural", "children"],
  },
  {
    id: 2,
    title: "Clean Beach Campaign",
    description:
      "Community-driven initiative to clean and maintain Goa's beaches while promoting environmental awareness.",
    image: "/beach-cleanup-volunteers.png",
    sdgs: ["Climate Action", "Life Below Water"],
    sector: "Environment",
    year: "2024",
    partner: "Government",
    location: "North Goa",
    keywords: ["environment", "beach", "cleanup"],
  },
  {
    id: 3,
    title: "Women's Skill Development",
    description: "Empowering rural women through vocational training and entrepreneurship programs.",
    image: "/women-skill-training-workshop.jpg",
    sdgs: ["Gender Equality", "Decent Work and Economic Growth"],
    sector: "Women Empowerment",
    year: "2024",
    partner: "NGO",
    location: "South Goa",
    keywords: ["women", "empowerment", "skills"],
  },
  {
    id: 4,
    title: "Healthcare Outreach Program",
    description: "Mobile health clinics providing medical care and health education to remote villages.",
    image: "/mobile-health-clinic.jpg",
    sdgs: ["Good Health and Well-being", "Reduced Inequalities"],
    sector: "Healthcare",
    year: "2023",
    partner: "Government",
    location: "North Goa",
    keywords: ["healthcare", "medical", "rural"],
  },
  {
    id: 5,
    title: "Sustainable Farming Initiative",
    description: "Teaching organic farming techniques to local farmers for sustainable agriculture practices.",
    image: "/organic-farming-training.jpg",
    sdgs: ["Zero Hunger", "Climate Action"],
    sector: "Rural Development",
    year: "2023",
    partner: "Private",
    location: "South Goa",
    keywords: ["agriculture", "farming", "sustainable"],
  },
  {
    id: 6,
    title: "Digital Literacy Program",
    description: "Bringing technology education to rural schools and community centers across Goa.",
    image: "/computer-education-class.jpg",
    sdgs: ["Quality Education", "Industry, Innovation and Infrastructure"],
    sector: "Education",
    year: "2023",
    partner: "Private",
    location: "North Goa",
    keywords: ["digital", "technology", "education"],
  },
]

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedSDGs, setSelectedSDGs] = React.useState<string[]>([])
  const [selectedSector, setSelectedSector] = React.useState<string>("")
  const [selectedYear, setSelectedYear] = React.useState<string>("")
  const [selectedPartner, setSelectedPartner] = React.useState<string>("")
  const [selectedLocation, setSelectedLocation] = React.useState<string>("")
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)

  const filteredProjects = React.useMemo(() => {
    return allProjects.filter((project) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery.toLowerCase()))

      // SDG filter
      const matchesSDG = selectedSDGs.length === 0 || selectedSDGs.some((sdg) => project.sdgs.includes(sdg))

      // Other filters
      const matchesSector = selectedSector === "" || project.sector === selectedSector
      const matchesYear = selectedYear === "" || project.year === selectedYear
      const matchesPartner = selectedPartner === "" || project.partner === selectedPartner
      const matchesLocation = selectedLocation === "" || project.location === selectedLocation

      return matchesSearch && matchesSDG && matchesSector && matchesYear && matchesPartner && matchesLocation
    })
  }, [searchQuery, selectedSDGs, selectedSector, selectedYear, selectedPartner, selectedLocation])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedSDGs([])
    setSelectedSector("")
    setSelectedYear("")
    setSelectedPartner("")
    setSelectedLocation("")
  }

  const hasActiveFilters =
    selectedSDGs.length > 0 ||
    selectedSector !== "" ||
    selectedYear !== "" ||
    selectedPartner !== "" ||
    selectedLocation !== ""

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* SDG Filter */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">SDG Goals</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {sdgGoals.map((sdg) => (
            <div key={sdg} className="flex items-center space-x-2">
              <Checkbox
                id={`sdg-${sdg}`}
                checked={selectedSDGs.includes(sdg)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedSDGs([...selectedSDGs, sdg])
                  } else {
                    setSelectedSDGs(selectedSDGs.filter((s) => s !== sdg))
                  }
                }}
              />
              <Label htmlFor={`sdg-${sdg}`} className="text-sm cursor-pointer">
                {sdg}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Sector Filter */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Sector</h3>
        <Select value={selectedSector} onValueChange={setSelectedSector}>
          <SelectTrigger>
            <SelectValue placeholder="All Sectors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sectors</SelectItem>
            {sectors.map((sector) => (
              <SelectItem key={sector} value={sector}>
                {sector}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Year Filter */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Year</h3>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger>
            <SelectValue placeholder="All Years" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Partner Type Filter */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Partner Type</h3>
        <Select value={selectedPartner} onValueChange={setSelectedPartner}>
          <SelectTrigger>
            <SelectValue placeholder="All Partners" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Partners</SelectItem>
            {partnerTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location Filter */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm">Location</h3>
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger>
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button onClick={clearFilters} variant="outline" className="w-full bg-transparent">
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  )

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
      {/* Header */}
      <div className="space-y-3 mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Projects</h1>
        <p className="text-base md:text-lg text-muted-foreground">
          Explore community engagement projects led by GIM students across various sectors and SDG goals.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by project title or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="outline">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2">
                  Active
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterPanel />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex gap-6 lg:gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base md:text-lg font-semibold">Filters</h2>
              {hasActiveFilters && (
                <Badge variant="secondary" className="text-xs">
                  Active
                </Badge>
              )}
            </div>
            <FilterPanel />
          </div>
        </aside>

        {/* Projects Grid */}
        <div className="flex-1 min-w-0">
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {filteredProjects.length} of {allProjects.length} projects
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {filteredProjects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{project.sector}</Badge>
                      <span className="text-sm text-muted-foreground">{project.year}</span>
                    </div>
                    <CardTitle className="line-clamp-2">{project.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {project.sdgs.slice(0, 2).map((sdg) => (
                        <Badge key={sdg} variant="outline" className="text-xs">
                          {sdg}
                        </Badge>
                      ))}
                      {project.sdgs.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.sdgs.length - 2}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="text-sm text-muted-foreground">
                    <span>{project.location}</span>
                    <span className="mx-2">•</span>
                    <span>{project.partner}</span>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-base md:text-lg text-muted-foreground">No projects found matching your criteria.</p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="link" className="mt-4">
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
