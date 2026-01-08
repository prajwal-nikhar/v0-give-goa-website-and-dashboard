import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileSpreadsheet, FileText } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="container py-6">
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1">Generate and download project reports</p>
        </div>
      </div>

      <div className="container py-8 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <FileSpreadsheet className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Projects Summary (CSV)</CardTitle>
              <CardDescription>Complete list of all projects with key metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Impact Report (PDF)</CardTitle>
              <CardDescription>Comprehensive impact assessment across all projects</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileSpreadsheet className="h-10 w-10 text-primary mb-2" />
              <CardTitle>SDG Alignment Report</CardTitle>
              <CardDescription>Projects mapped to UN Sustainable Development Goals</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Partner Organizations Report</CardTitle>
              <CardDescription>List of all partner organizations and collaboration details</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileSpreadsheet className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Student Participation Report</CardTitle>
              <CardDescription>Student engagement metrics and involvement data</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Annual Report</CardTitle>
              <CardDescription>Year-end comprehensive report for accreditation</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
