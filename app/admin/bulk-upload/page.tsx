"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

function parseCSV(text: string): Record<string, string>[] {
  // Robust CSV parser that supports:
  // - Commas inside quoted fields
  // - Newlines inside quoted fields
  // - Trims outer quotes on headers and values
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '"') {
      // Toggle quote state. This is a simple parser and assumes no escaped quotes.
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      currentRow.push(currentField);
      currentField = "";
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (currentField.length > 0 || currentRow.length > 0) {
        currentRow.push(currentField);
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = "";

      // Handle CRLF (\r\n) by skipping next \n when we already processed \r
      if (char === '\r' && text[i + 1] === '\n') {
        i++;
      }
      continue;
    }

    currentField += char;
  }

  // Push last field/row at EOF
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  if (rows.length < 2) return [];

  const headers = rows[0].map(h => h.trim().replace(/^"|"$/g, ''));
  const result: Record<string, string>[] = [];

  for (let i = 1; i < rows.length; i++) {
    const rawValues = rows[i];
    const values = rawValues.map(v => v.trim().replace(/^"|"$/g, ''));

    // Skip completely empty rows
    if (values.every(value => value === '')) {
      continue;
    }

    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ?? '';
    });
    result.push(row);
  }

  return result;
}

export default function BulkUploadPage() {
  const [file, setFile] = React.useState<File | null>(null)
  const [uploading, setUploading] = React.useState(false)
  const [uploadStatus, setUploadStatus] = React.useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = React.useState("")
  const [previewData, setPreviewData] = React.useState<Record<string, string>[]>([])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setUploadStatus("idle")
      setMessage("")
      
      const text = await selectedFile.text()
      const parsed = parseCSV(text)
      setPreviewData(parsed.slice(0, 5))
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setUploadStatus("idle")
    
    try {
      const text = await file.text()
      const projects = parseCSV(text)
      
      if (projects.length === 0) {
        setUploadStatus("error")
        setMessage("No valid data found in CSV file")
        setUploading(false)
        return
      }

      const response = await fetch('/api/bulk-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects }),
      })

      const result = await response.json()

      if (response.ok) {
        setUploadStatus("success")
        setMessage(result.message || `Successfully imported ${result.count} projects`)
      } else {
        setUploadStatus("error")
        setMessage(result.error || "Failed to upload projects")
      }
    } catch (error) {
      setUploadStatus("error")
      setMessage("Failed to process file")
    }
    
    setUploading(false)
  }

  const downloadTemplate = () => {
    const headers = "List of Projects,Sector,Geographical Scope,Group No,Yr,GroupID,conc,SDG,Link to the projects,Objectives"
    const sample = "Sample Project,Education,Goa,1,2024,GRP001,Marketing,SDG 4,https://example.com,To improve education access"
    const csv = headers + "\n" + sample
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'projects_template.csv'
    a.click()
    URL.revokeObjectURL(url)
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
          <Card>
            <CardHeader>
              <CardTitle>Upload Instructions</CardTitle>
              <CardDescription>Follow these steps to upload projects in bulk</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <div className="font-medium mb-1">Export Excel to CSV</div>
                  <p className="text-sm text-muted-foreground">Save your Excel file as CSV (File → Save As → CSV)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <div className="font-medium mb-1">Upload CSV File</div>
                  <p className="text-sm text-muted-foreground">Select your CSV file below</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <div className="font-medium mb-1">Review and Import</div>
                  <p className="text-sm text-muted-foreground">Preview your data and click upload</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expected Column Headers</CardTitle>
              <CardDescription>Your CSV should have these columns (matching your Excel)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-lg text-sm font-mono">
                List of Projects, Sector, Geographical Scope, Group No, Yr, GroupID, conc, SDG, Link to the projects, Objectives
              </div>
              <Button variant="outline" className="mt-4 bg-transparent" onClick={downloadTemplate}>
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload CSV File</CardTitle>
              <CardDescription>Select your CSV file to upload</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <FileSpreadsheet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <div className="space-y-2">
                  <div className="font-medium">{file ? file.name : "Choose a CSV file"}</div>
                  <div className="text-sm text-muted-foreground">CSV files only</div>
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

              {previewData.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Preview (first 5 rows):</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border">
                      <thead className="bg-muted">
                        <tr>
                          {Object.keys(previewData[0]).slice(0, 5).map(key => (
                            <th key={key} className="p-2 text-left border">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((row, i) => (
                          <tr key={i}>
                            {Object.values(row).slice(0, 5).map((val, j) => (
                              <td key={j} className="p-2 border truncate max-w-[200px]">{val}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Found {previewData.length} rows to import (showing first 5)
                  </p>
                </div>
              )}

              {file && (
                <Button onClick={handleUpload} disabled={uploading} className="w-full">
                  {uploading ? "Uploading..." : `Upload ${previewData.length} Projects`}
                </Button>
              )}
            </CardContent>
          </Card>

          {uploadStatus === "success" && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Upload Successful</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {uploadStatus === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Upload Failed</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  )
}
