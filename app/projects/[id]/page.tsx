import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ArrowRight, MapPin, Calendar, Building2, Users, FileText } from "lucide-react"
import { ImageGallery } from "@/components/image-gallery"
import { VideoPreview } from "@/components/video-preview"

// Sample project data - in a real app, this would come from a database
const projectsData: Record<string, any> = {
  "1": {
    id: 1,
    title: "Rural Education Initiative",
    description:
      "Providing quality education to underprivileged children in rural Goa through innovative teaching methods.",
    fullDescription: `The Rural Education Initiative is a comprehensive program designed to bridge the educational gap in rural areas of South Goa. Our team of dedicated GIM students has partnered with local NGOs to establish learning centers in underserved communities.

The program focuses on holistic development, incorporating modern teaching techniques with traditional learning methods. We've introduced digital learning tools, interactive workshops, and mentorship programs to enhance the educational experience.

Through this initiative, we've reached over 250 children across 5 villages, providing them with access to quality education, learning materials, and career guidance. The program also includes teacher training workshops to build local capacity for sustainable impact.`,
    images: ["/rural-classroom.png", "/students-learning.jpg", "/teaching-session.jpg", "/classroom-activities.jpg"],
    videoUrl: "/project-video-1.mp4",
    sdgs: ["Quality Education", "Reduced Inequalities", "Partnerships for the Goals"],
    sector: "Education",
    year: "2024",
    partner: {
      name: "Education for All Foundation",
      type: "NGO",
      contact: "contact@educationforall.org",
    },
    location: "South Goa, Multiple Villages",
    outcomes: [
      "250+ children enrolled in the program",
      "5 learning centers established",
      "20 trained local teachers",
      "95% attendance rate maintained",
      "Improved learning outcomes by 40%",
    ],
    team: {
      students: ["Priya Sharma", "Rahul Desai", "Ananya Verma", "Karan Patel"],
      faculty: "Dr. Sunita Rao",
      mentor: "Prof. Vikram Singh",
    },
    reportUrl: "/reports/rural-education-report.pdf",
    keywords: ["education", "rural development", "children", "community"],
  },
  "2": {
    id: 2,
    title: "Clean Beach Campaign",
    description:
      "Community-driven initiative to clean and maintain Goa's beaches while promoting environmental awareness.",
    fullDescription: `The Clean Beach Campaign is an ambitious environmental project that brings together students, local communities, and tourists to preserve Goa's pristine beaches. This initiative goes beyond simple cleanup drives to create a sustainable model for beach conservation.

Our team has organized weekly cleanup drives, installed recycling stations, and conducted awareness workshops on marine conservation. We've also collaborated with local authorities to implement better waste management systems in coastal areas.

The campaign has evolved into a year-round movement, with over 500 volunteers participating regularly. We've collected and properly disposed of over 10 tons of waste, preventing it from entering the ocean and harming marine life.`,
    images: [
      "/beach-cleanup-volunteers.png",
      "/waste-collection.jpg",
      "/recycling-station.jpg",
      "/beach-after-cleanup.jpg",
    ],
    videoUrl: "/project-video-2.mp4",
    sdgs: ["Climate Action", "Life Below Water", "Sustainable Cities and Communities"],
    sector: "Environment",
    year: "2024",
    partner: {
      name: "Goa Coastal Management Authority",
      type: "Government",
      contact: "info@goaenvironment.gov.in",
    },
    location: "North Goa Beaches",
    outcomes: [
      "10+ tons of waste collected and recycled",
      "500+ volunteers engaged",
      "12 recycling stations installed",
      "8 beaches adopted for regular maintenance",
      "30% reduction in beach pollution",
    ],
    team: {
      students: ["Neha Fernandes", "Arjun Naik", "Kavya Shetty", "Rohan D'Souza"],
      faculty: "Dr. Maria Gomes",
      mentor: "Prof. Ashok Deshmukh",
    },
    reportUrl: "/reports/beach-campaign-report.pdf",
    keywords: ["environment", "beach", "cleanup", "conservation"],
  },
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = projectsData[params.id]

  if (!project) {
    notFound()
  }

  const prevProjectId = Number.parseInt(params.id) > 1 ? (Number.parseInt(params.id) - 1).toString() : null
  const nextProjectId = projectsData[(Number.parseInt(params.id) + 1).toString()]
    ? (Number.parseInt(params.id) + 1).toString()
    : null

  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <div className="border-b bg-muted/30">
        <div className="container py-4">
          <Button variant="ghost" asChild>
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        {/* Project Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {project.sdgs.map((sdg: string) => (
              <Badge key={sdg} variant="secondary">
                {sdg}
              </Badge>
            ))}
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-balance">{project.title}</h1>
          <p className="text-xl text-muted-foreground text-pretty">{project.description}</p>
        </div>

        {/* Project Metadata */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <div className="text-sm text-muted-foreground">Year</div>
                <div className="font-semibold">{project.year}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex items-start gap-3">
              <Building2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <div className="text-sm text-muted-foreground">Partner</div>
                <div className="font-semibold">{project.partner.name}</div>
                <div className="text-xs text-muted-foreground">{project.partner.type}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <div className="text-sm text-muted-foreground">Location</div>
                <div className="font-semibold">{project.location}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex items-start gap-3">
              <FileText className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <div className="text-sm text-muted-foreground">Sector</div>
                <div className="font-semibold">{project.sector}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Media Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageGallery images={project.images} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Video</CardTitle>
            </CardHeader>
            <CardContent>
              <VideoPreview videoUrl={project.videoUrl} thumbnail={project.images[0]} />
            </CardContent>
          </Card>
        </div>

        {/* Project Description */}
        <Card>
          <CardHeader>
            <CardTitle>About This Project</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            {project.fullDescription.split("\n\n").map((paragraph: string, index: number) => (
              <p key={index} className="mb-4 text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </CardContent>
        </Card>

        {/* Outcomes */}
        <Card>
          <CardHeader>
            <CardTitle>Key Outcomes & Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {project.outcomes.map((outcome: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-muted-foreground">{outcome}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Team Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Project Team
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Student Team</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {project.team.students.map((student: string) => (
                  <div key={student} className="px-4 py-2 bg-muted rounded-lg text-sm">
                    {student}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Faculty Coordinator</h3>
                <p className="text-muted-foreground">{project.team.faculty}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Project Mentor</h3>
                <p className="text-muted-foreground">{project.team.mentor}</p>
              </div>
            </div>

            {project.partner.contact && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Partner Contact</h3>
                  <p className="text-muted-foreground">{project.partner.contact}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Embedded Report */}
        <Card>
          <CardHeader>
            <CardTitle>Project Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[600px] border rounded-lg overflow-hidden bg-muted">
              <iframe src={project.reportUrl} className="w-full h-full" title="Project Report" loading="lazy" />
            </div>
            <div className="mt-4">
              <Button asChild variant="outline">
                <a href={project.reportUrl} download>
                  Download Full Report
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-8 border-t">
          {prevProjectId ? (
            <Button asChild variant="outline">
              <Link href={`/projects/${prevProjectId}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous Project
              </Link>
            </Button>
          ) : (
            <div />
          )}

          {nextProjectId ? (
            <Button asChild variant="outline">
              <Link href={`/projects/${nextProjectId}`}>
                Next Project
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  )
}
