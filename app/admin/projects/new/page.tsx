"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Plus, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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
  "Agriculture",
  "Technology",
]

const years = ["2024", "2023", "2022", "2021", "2020"]

const partnerTypes = ["NGO", "Government", "Private"]

export default function NewProjectPage() {
  const router = useRouter()
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    fullDescription: "",
    year: "",
    sector: "",
    partnerName: "",
    partnerType: "",
    location: "",
    facultyCoordinator: "",
    projectMentor: "",
    outcomes: [""],
  })

  const [selectedSDGs, setSelectedSDGs] = React.useState<string[]>([])
  const [keywords, setKeywords] = React.useState<string[]>([])
  const [keywordInput, setKeywordInput] = React.useState("")
  const [studentNames, setStudentNames] = React.useState<string[]>([""])
  const [images, setImages] = React.useState<File[]>([])
  const [videos, setVideos] = React.useState<File[]>([])
  const [pdfReport, setPdfReport] = React.useState<File | null>(null)
  const [errors, setErrors] = React.useState<string[]>([])
  const [submitted, setSubmitted] = React.useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSDGToggle = (sdg: string) => {
    if (selectedSDGs.includes(sdg)) {
      setSelectedSDGs(selectedSDGs.filter((s) => s !== sdg))
    } else {
      setSelectedSDGs([...selectedSDGs, sdg])
    }
  }

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()])
      setKeywordInput("")
    }
  }

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword))
  }

  const addStudentField = () => {
    setStudentNames([...studentNames, ""])
  }

  const updateStudentName = (index: number, value: string) => {
    const updated = [...studentNames]
    updated[index] = value
    setStudentNames(updated)
  }

  const removeStudentField = (index: number) => {
    setStudentNames(studentNames.filter((_, i) => i !== index))
  }

  const addOutcomeField = () => {
    setFormData({ ...formData, outcomes: [...formData.outcomes, ""] })
  }

  const updateOutcome = (index: number, value: string) => {
    const updated = [...formData.outcomes]
    updated[index] = value
    setFormData({ ...formData, outcomes: updated })
  }

  const removeOutcomeField = (index: number) => {
    setFormData({ ...formData, outcomes: formData.outcomes.filter((_, i) => i !== index) })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)])
    }
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideos([...videos, ...Array.from(e.target.files)])
    }
  }

  const handlePDFUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfReport(e.target.files[0])
    }
  }

  const validateForm = () => {
    const newErrors: string[] = []

    if (!formData.title.trim()) newErrors.push("Project title is required")
    if (!formData.description.trim()) newErrors.push("Short description is required")
    if (!formData.fullDescription.trim()) newErrors.push("Full description is required")
    if (!formData.year) newErrors.push("Year is required")
    if (!formData.sector) newErrors.push("Sector is required")
    if (selectedSDGs.length === 0) newErrors.push("At least one SDG goal must be selected")
    if (!formData.partnerName.trim()) newErrors.push("Partner organization name is required")
    if (!formData.partnerType) newErrors.push("Partner type is required")
    if (!formData.location.trim()) newErrors.push("Location is required")
    if (studentNames.filter((name) => name.trim()).length === 0) newErrors.push("At least one student name is required")

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    // Simulate form submission
    console.log("Form Data:", {
      ...formData,
      selectedSDGs,
      keywords,
      studentNames: studentNames.filter((name) => name.trim()),
      images,
      videos,
      pdfReport,
    })

    setSubmitted(true)
    setTimeout(() => {
      router.push("/admin/projects")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="container py-6">
          <h1 className="text-3xl font-bold">Add New Project</h1>
          <p className="text-muted-foreground mt-1">Fill in the project details to submit</p>
        </div>
      </div>

      <div className="container py-8 max-w-4xl">
        {errors.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Please fix the following errors:</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1 mt-2">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {submitted && (
          <Alert className="mb-6">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>Project submitted successfully. Redirecting to projects list...</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the core project details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Project Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Enter project title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Short Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Brief overview of the project (1-2 sentences)"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullDescription">
                  Full Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="fullDescription"
                  placeholder="Detailed project description, methodology, and approach"
                  value={formData.fullDescription}
                  onChange={(e) => handleInputChange("fullDescription", e.target.value)}
                  rows={8}
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">
                    Year <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.year} onValueChange={(value) => handleInputChange("year", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sector">
                    Sector <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.sector} onValueChange={(value) => handleInputChange("sector", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map((sector) => (
                        <SelectItem key={sector} value={sector}>
                          {sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SDG Goals */}
          <Card>
            <CardHeader>
              <CardTitle>
                SDG Goals <span className="text-destructive">*</span>
              </CardTitle>
              <CardDescription>Select all applicable Sustainable Development Goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
                {sdgGoals.map((sdg) => (
                  <div key={sdg} className="flex items-center space-x-2">
                    <Checkbox
                      id={`sdg-${sdg}`}
                      checked={selectedSDGs.includes(sdg)}
                      onCheckedChange={() => handleSDGToggle(sdg)}
                    />
                    <Label htmlFor={`sdg-${sdg}`} className="text-sm cursor-pointer">
                      {sdg}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedSDGs.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                  {selectedSDGs.map((sdg) => (
                    <Badge key={sdg} variant="secondary">
                      {sdg}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Partner Information */}
          <Card>
            <CardHeader>
              <CardTitle>Partner Organization</CardTitle>
              <CardDescription>Details about the partnering organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="partnerName">
                  Partner Organization Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="partnerName"
                  placeholder="Enter organization name"
                  value={formData.partnerName}
                  onChange={(e) => handleInputChange("partnerName", e.target.value)}
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="partnerType">
                    Partner Type <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.partnerType}
                    onValueChange={(value) => handleInputChange("partnerType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {partnerTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">
                    Location <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., South Goa, Mumbai"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Details */}
          <Card>
            <CardHeader>
              <CardTitle>Team Details</CardTitle>
              <CardDescription>Student team and faculty information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>
                  Student Names <span className="text-destructive">*</span>
                </Label>
                {studentNames.map((name, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Student ${index + 1} name`}
                      value={name}
                      onChange={(e) => updateStudentName(index, e.target.value)}
                    />
                    {studentNames.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStudentField(index)}
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addStudentField} className="bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="faculty">Faculty Coordinator</Label>
                  <Input
                    id="faculty"
                    placeholder="Enter faculty name"
                    value={formData.facultyCoordinator}
                    onChange={(e) => handleInputChange("facultyCoordinator", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mentor">Project Mentor</Label>
                  <Input
                    id="mentor"
                    placeholder="Enter mentor name"
                    value={formData.projectMentor}
                    onChange={(e) => handleInputChange("projectMentor", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Outcomes */}
          <Card>
            <CardHeader>
              <CardTitle>Project Outcomes</CardTitle>
              <CardDescription>Key achievements and impact metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.outcomes.map((outcome, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Outcome ${index + 1}`}
                    value={outcome}
                    onChange={(e) => updateOutcome(index, e.target.value)}
                  />
                  {formData.outcomes.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOutcomeField(index)}
                      className="flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addOutcomeField} className="bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add Outcome
              </Button>
            </CardContent>
          </Card>

          {/* Keywords */}
          <Card>
            <CardHeader>
              <CardTitle>Keywords</CardTitle>
              <CardDescription>Add tags to help users find this project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter keyword and press Add"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                />
                <Button type="button" onClick={addKeyword} variant="outline" className="bg-transparent">
                  Add
                </Button>
              </div>
              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="pl-3 pr-1">
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="ml-1 hover:bg-muted rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* File Uploads */}
          <Card>
            <CardHeader>
              <CardTitle>Media & Documents</CardTitle>
              <CardDescription>Upload images, videos, and project reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Images */}
              <div className="space-y-2">
                <Label htmlFor="images">Project Images</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground mb-2">
                    {images.length > 0 ? `${images.length} image(s) selected` : "Upload project images"}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="images"
                  />
                  <label htmlFor="images">
                    <Button type="button" variant="outline" size="sm" asChild className="bg-transparent">
                      <span>Select Images</span>
                    </Button>
                  </label>
                </div>
              </div>

              {/* Videos */}
              <div className="space-y-2">
                <Label htmlFor="videos">Project Videos</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground mb-2">
                    {videos.length > 0 ? `${videos.length} video(s) selected` : "Upload project videos"}
                  </div>
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="videos"
                  />
                  <label htmlFor="videos">
                    <Button type="button" variant="outline" size="sm" asChild className="bg-transparent">
                      <span>Select Videos</span>
                    </Button>
                  </label>
                </div>
              </div>

              {/* PDF Report */}
              <div className="space-y-2">
                <Label htmlFor="pdf">Project Report (PDF)</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <div className="text-sm text-muted-foreground mb-2">
                    {pdfReport ? pdfReport.name : "Upload project report"}
                  </div>
                  <input type="file" accept=".pdf" onChange={handlePDFUpload} className="hidden" id="pdf" />
                  <label htmlFor="pdf">
                    <Button type="button" variant="outline" size="sm" asChild className="bg-transparent">
                      <span>Select PDF</span>
                    </Button>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="submit" size="lg" disabled={submitted}>
              Submit Project
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => router.push("/admin/projects")}
              className="bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
