"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function BulkUploadPage() {
  const [file, setFile] = React.useState<File | null>(null)
  const [uploading, setUploading] = React.useState(false)
  const [uploadStatus, setUploadStatus] = React.useState<"idle" | "success" | "error">("idle")
  const [validationErrors, setValidationErrors] = React.useState<string[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setUploadStatus("idle")
      setValidationErrors([])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    // Simulate upload and validation
    setTimeout(() => {
      // Simulate validation errors
      const errors = []
      if (Math.random() > 0.7) {
        errors.push("Row 5: Missing required field 'Project Title'")
        errors.push("Row 12: Invalid SDG goal 'SDG 18'")
        errors.push("Row 23: Year must be between 2018-2024")
      }

      if (errors.length > 0) {
        setValidationErrors(errors)
        setUploadStatus("error")
      } else {
        setUploadStatus("success")
      }
      setUploading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="container py-6">
          <h1 className="text-3xl font-bold">Bulk Upload</h1>
          <p className="text-muted-foreground mt-1">Upload multiple projects via CSV file</p>
        </div>
      </div>

      <div className="container py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Instructions</CardTitle>
              <CardDescription>Follow these steps to upload projects in bulk</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <div className="font-medium mb-1">Download CSV Template</div>
                  <p className="text-sm text-muted-foreground">
                    Use our template to ensure your data is properly formatted
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <div className="font-medium mb-1">Fill in Project Data</div>
                  <p className="text-sm text-muted-foreground">Add your projects following the column specifications</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <div className="font-medium mb-1">Upload and Validate</div>
                  <p className="text-sm text-muted-foreground">Upload your file and review any validation messages</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Download Template */}
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Download Template</CardTitle>
              <CardDescription>Get the CSV template with required columns</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Download CSV Template
              </Button>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="text-sm font-medium mb-2">Required Columns:</div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>• Project Title, Description, Full Description</div>
                  <div>• Year, Sector, SDG Goals (comma-separated)</div>
                  <div>• Partner Name, Partner Type, Location</div>
                  <div>• Student Names (comma-separated), Faculty, Mentor</div>
                  <div>• Keywords (comma-separated)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload File */}
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Upload CSV File</CardTitle>
              <CardDescription>Select your completed CSV file to upload</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
                <FileSpreadsheet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <div className="space-y-2">
                  <div className="font-medium">{file ? file.name : "Choose a CSV file or drag and drop"}</div>
                  <div className="text-sm text-muted-foreground">CSV files only, max 10MB</div>
                </div>
                <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" id="file-upload" />
                <label htmlFor="file-upload">
                  <Button variant="outline" className="mt-4 bg-transparent" asChild>
                    <span>
                      <Upload className="mr-2 h-4 w-4" />
                      Select File
                    </span>
                  </Button>
                </label>
              </div>

              {file && (
                <Button onClick={handleUpload} disabled={uploading} className="w-full">
                  {uploading ? "Uploading..." : "Upload and Validate"}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Upload Status */}
          {uploadStatus === "success" && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Upload Successful</AlertTitle>
              <AlertDescription>
                Your projects have been successfully uploaded and are now live on the platform.
              </AlertDescription>
            </Alert>
          )}

          {uploadStatus === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Validation Errors</AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-1">
                  {validationErrors.map((error, index) => (
                    <div key={index} className="text-sm">
                      • {error}
                    </div>
                  ))}
                </div>
                <div className="mt-4">Please fix these errors and try uploading again.</div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  )
}
