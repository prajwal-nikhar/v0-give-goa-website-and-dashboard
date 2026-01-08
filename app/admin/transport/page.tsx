"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, FileSpreadsheet, Check, X, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type RequestStatus = "Pending" | "Approved" | "Rejected"

interface TransportRequest {
  id: number
  projectName: string
  studentName: string
  date: string
  pickup: string
  drop: string
  passengers: number
  purpose: string
  estimatedCost: number
  status: RequestStatus
  submittedOn: string
}

const mockRequests: TransportRequest[] = [
  {
    id: 1,
    projectName: "Rural Education Initiative",
    studentName: "Priya Sharma",
    date: "2024-02-15",
    pickup: "GIM Campus, Sanquelim",
    drop: "Village School, Bicholim",
    passengers: 4,
    purpose: "Weekly teaching session and material distribution",
    estimatedCost: 900,
    status: "Pending",
    submittedOn: "2024-01-20",
  },
  {
    id: 2,
    projectName: "Clean Beach Campaign",
    studentName: "Neha Fernandes",
    date: "2024-02-10",
    pickup: "GIM Campus, Sanquelim",
    drop: "Candolim Beach",
    passengers: 8,
    purpose: "Monthly beach cleanup drive",
    estimatedCost: 1300,
    status: "Approved",
    submittedOn: "2024-01-18",
  },
  {
    id: 3,
    projectName: "Healthcare Outreach Program",
    studentName: "Rahul Desai",
    date: "2024-02-08",
    pickup: "GIM Campus, Sanquelim",
    drop: "Mobile Clinic Site, Sanguem",
    passengers: 5,
    purpose: "Medical camp setup and volunteer coordination",
    estimatedCost: 1100,
    status: "Approved",
    submittedOn: "2024-01-15",
  },
  {
    id: 4,
    projectName: "Women's Skill Development",
    studentName: "Ananya Verma",
    date: "2024-02-05",
    pickup: "GIM Campus, Sanquelim",
    drop: "Community Center, Ponda",
    passengers: 3,
    purpose: "Skill development workshop",
    estimatedCost: 800,
    status: "Rejected",
    submittedOn: "2024-01-10",
  },
  {
    id: 5,
    projectName: "Digital Literacy Program",
    studentName: "Karan Patel",
    date: "2024-02-20",
    pickup: "GIM Campus, Sanquelim",
    drop: "Rural School, Quepem",
    passengers: 6,
    purpose: "Computer training session for students",
    estimatedCost: 1000,
    status: "Pending",
    submittedOn: "2024-01-22",
  },
]

export default function AdminTransportPage() {
  const [requests, setRequests] = React.useState<TransportRequest[]>(mockRequests)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [selectedRequest, setSelectedRequest] = React.useState<TransportRequest | null>(null)

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      searchQuery === "" ||
      request.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.studentName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || request.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleStatusUpdate = (id: number, newStatus: RequestStatus) => {
    setRequests(requests.map((req) => (req.id === id ? { ...req, status: newStatus } : req)))
    setSelectedRequest(null)
  }

  const exportToExcel = () => {
    console.log("Exporting to Excel:", requests)
    alert("Export functionality will download an Excel file with all transport requests.")
  }

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case "Approved":
        return <Check className="h-4 w-4" />
      case "Rejected":
        return <X className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusVariant = (status: RequestStatus): "default" | "secondary" | "destructive" => {
    switch (status) {
      case "Approved":
        return "default"
      case "Rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const pendingCount = requests.filter((r) => r.status === "Pending").length
  const approvedCount = requests.filter((r) => r.status === "Approved").length
  const totalCost = requests.filter((r) => r.status === "Approved").reduce((sum, r) => sum + r.estimatedCost, 0)

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="container py-6">
          <h1 className="text-3xl font-bold">Transport Requests Management</h1>
          <p className="text-muted-foreground mt-1">Review and manage student transport requests</p>
        </div>
      </div>

      <div className="container py-8">
        {/* Summary Cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{pendingCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Approved This Month</CardTitle>
              <Check className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{approvedCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Transport requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Approved Cost</CardTitle>
              <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{totalCost}</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle>All Transport Requests</CardTitle>
                <CardDescription>Review and update request statuses</CardDescription>
              </div>
              <Button onClick={exportToExcel} variant="outline" className="bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Export to Excel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by project or student name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Passengers</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">#{request.id}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{request.projectName}</TableCell>
                      <TableCell>{request.studentName}</TableCell>
                      <TableCell className="whitespace-nowrap">{request.date}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                        {request.pickup} → {request.drop}
                      </TableCell>
                      <TableCell>{request.passengers}</TableCell>
                      <TableCell>₹{request.estimatedCost}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(request.status)} className="gap-1">
                          {getStatusIcon(request.status)}
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedRequest(request)}
                              className="bg-transparent"
                            >
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Transport Request Details</DialogTitle>
                              <DialogDescription>Request #{selectedRequest?.id}</DialogDescription>
                            </DialogHeader>
                            {selectedRequest && (
                              <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <div className="text-sm font-medium mb-1">Project Name</div>
                                    <div className="text-sm text-muted-foreground">{selectedRequest.projectName}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium mb-1">Student Name</div>
                                    <div className="text-sm text-muted-foreground">{selectedRequest.studentName}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium mb-1">Travel Date</div>
                                    <div className="text-sm text-muted-foreground">{selectedRequest.date}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium mb-1">Passengers</div>
                                    <div className="text-sm text-muted-foreground">{selectedRequest.passengers}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium mb-1">Pickup Location</div>
                                    <div className="text-sm text-muted-foreground">{selectedRequest.pickup}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium mb-1">Drop Location</div>
                                    <div className="text-sm text-muted-foreground">{selectedRequest.drop}</div>
                                  </div>
                                  <div className="col-span-2">
                                    <div className="text-sm font-medium mb-1">Purpose</div>
                                    <div className="text-sm text-muted-foreground">{selectedRequest.purpose}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium mb-1">Estimated Cost</div>
                                    <div className="text-sm text-muted-foreground">
                                      ₹{selectedRequest.estimatedCost}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium mb-1">Status</div>
                                    <Badge variant={getStatusVariant(selectedRequest.status)}>
                                      {selectedRequest.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            )}
                            <DialogFooter className="gap-2">
                              {selectedRequest?.status === "Pending" && (
                                <>
                                  <Button
                                    variant="outline"
                                    onClick={() => handleStatusUpdate(selectedRequest.id, "Rejected")}
                                    className="bg-transparent"
                                  >
                                    <X className="mr-2 h-4 w-4" />
                                    Reject
                                  </Button>
                                  <Button onClick={() => handleStatusUpdate(selectedRequest.id, "Approved")}>
                                    <Check className="mr-2 h-4 w-4" />
                                    Approve
                                  </Button>
                                </>
                              )}
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredRequests.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">No transport requests found.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
