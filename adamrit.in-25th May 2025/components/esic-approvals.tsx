"use client"

import React, { useState } from "react"
import { 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  MoreHorizontal,
  FileDown,
  FileUp,
  Clock,
  BadgeCheck,
  Ban,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

// Helper function to get status badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="mr-1 h-3 w-3" /> Pending</Badge>
    case "approved":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><BadgeCheck className="mr-1 h-3 w-3" /> Approved</Badge>
    case "rejected":
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><Ban className="mr-1 h-3 w-3" /> Rejected</Badge>
    case "info-required":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><AlertCircle className="mr-1 h-3 w-3" /> Info Required</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export function Approvals() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false)
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false)
  const [infoDialogOpen, setInfoDialogOpen] = useState(false)
  const [remarks, setRemarks] = useState("")
  
  // Dummy data for ESIC approval requests
  const dummyRequests = [
    {
      id: "ESIC-REQ-2023-001",
      patientName: "Amit Sharma",
      patientId: "ESIC-2023-1002",
      diagnosis: "Type 2 Diabetes",
      surgeryPackage: "Laparoscopic Cholecystectomy",
      dateSubmitted: "2023-10-15",
      status: "pending",
      doctor: "Dr. Neha Patel",
      estimatedCost: "₹35,000",
      documents: ["Medical History", "Lab Reports", "Doctor's Recommendation"]
    },
    {
      id: "ESIC-REQ-2023-002",
      patientName: "Priya Reddy",
      patientId: "ESIC-2023-1005",
      diagnosis: "Chronic Kidney Disease",
      surgeryPackage: "AV Fistula Creation",
      dateSubmitted: "2023-10-12",
      status: "approved",
      doctor: "Dr. Rajesh Kumar",
      estimatedCost: "₹42,500",
      documents: ["Medical History", "Kidney Function Tests", "Dialysis Records"]
    },
    {
      id: "ESIC-REQ-2023-003",
      patientName: "Mohammed Khan",
      patientId: "ESIC-2023-1008",
      diagnosis: "Coronary Artery Disease",
      surgeryPackage: "Coronary Angioplasty with Stent",
      dateSubmitted: "2023-10-10",
      status: "rejected",
      doctor: "Dr. Sunil Mehta",
      estimatedCost: "₹1,20,000",
      documents: ["ECG Reports", "Angiogram", "Cardiac Enzyme Tests"]
    },
    {
      id: "ESIC-REQ-2023-004",
      patientName: "Lakshmi Iyer",
      patientId: "ESIC-2023-1012",
      diagnosis: "Cataract",
      surgeryPackage: "Phacoemulsification with IOL Implantation",
      dateSubmitted: "2023-10-08",
      status: "info-required",
      doctor: "Dr. Anjali Gupta",
      estimatedCost: "₹18,000",
      documents: ["Eye Examination", "Visual Acuity Test"]
    },
    {
      id: "ESIC-REQ-2023-005",
      patientName: "Rajiv Malhotra",
      patientId: "ESIC-2023-1015",
      diagnosis: "Inguinal Hernia",
      surgeryPackage: "Laparoscopic Hernia Repair",
      dateSubmitted: "2023-10-05",
      status: "pending",
      doctor: "Dr. Vikram Singh",
      estimatedCost: "₹32,000",
      documents: ["Physical Examination Notes", "Ultrasound Report"]
    }
  ]
  
  // Filter the requests based on search and filters
  const filteredRequests = dummyRequests.filter(request => {
    // Search filter
    const matchesSearch = 
      searchQuery === "" || 
      request.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Status filter
    const matchesStatus = 
      statusFilter === "all" || 
      request.status === statusFilter
    
    // Date filter - simplified for demo
    const matchesDate = dateFilter === "all"
    
    return matchesSearch && matchesStatus && matchesDate
  })
  
  // Handle approval action
  const handleApprove = () => {
    toast({
      title: "Request Approved",
      description: `Request ${selectedRequest.id} has been approved.`,
    })
    setApprovalDialogOpen(false)
    setRemarks("")
  }
  
  // Handle rejection action
  const handleReject = () => {
    toast({
      title: "Request Rejected",
      description: `Request ${selectedRequest.id} has been rejected.`,
    })
    setRejectionDialogOpen(false)
    setRemarks("")
  }
  
  // Handle request for more information
  const handleRequestInfo = () => {
    toast({
      title: "Information Requested",
      description: `Additional information has been requested for ${selectedRequest.id}.`,
    })
    setInfoDialogOpen(false)
    setRemarks("")
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">ESIC Approval Requests</h3>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <FileUp className="h-4 w-4 mr-2" />
            Import
          </Button>
        </div>
      </div>
      
      {/* Filters and search */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient name, ID or diagnosis..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="info-required">Info Required</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dates</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="last-week">Last 7 Days</SelectItem>
            <SelectItem value="last-month">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Request cards list */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="overflow-hidden">
            <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start">
              <div>
                <CardTitle className="text-sm font-medium">{request.id}</CardTitle>
                <div className="text-xs text-muted-foreground mt-1">{request.dateSubmitted}</div>
              </div>
              {getStatusBadge(request.status)}
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="space-y-3">
                <div>
                  <div className="font-medium">{request.patientName}</div>
                  <div className="text-sm text-muted-foreground">{request.patientId}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <div className="text-muted-foreground">Diagnosis:</div>
                  <div>{request.diagnosis}</div>
                  
                  <div className="text-muted-foreground">Package:</div>
                  <div>{request.surgeryPackage}</div>
                  
                  <div className="text-muted-foreground">Doctor:</div>
                  <div>{request.doctor}</div>
                  
                  <div className="text-muted-foreground">Est. Cost:</div>
                  <div>{request.estimatedCost}</div>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      // View details functionality would go here
                      setSelectedRequest(request)
                    }}
                  >
                    View Details
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedRequest(request)
                          setApprovalDialogOpen(true)
                        }}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedRequest(request)
                          setRejectionDialogOpen(true)
                        }}
                      >
                        <XCircle className="mr-2 h-4 w-4 text-red-600" />
                        Reject
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedRequest(request)
                          setInfoDialogOpen(true)
                        }}
                      >
                        <AlertCircle className="mr-2 h-4 w-4 text-blue-600" />
                        Request Info
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Approval confirmation dialog */}
      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve ESIC Request</DialogTitle>
            <DialogDescription>
              You are about to approve ESIC request {selectedRequest?.id} for {selectedRequest?.patientName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="approval-remarks">Remarks (Optional)</Label>
              <Textarea
                id="approval-remarks"
                placeholder="Enter any remarks or notes for this approval"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApprovalDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Rejection confirmation dialog */}
      <Dialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject ESIC Request</DialogTitle>
            <DialogDescription>
              You are about to reject ESIC request {selectedRequest?.id} for {selectedRequest?.patientName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Reason for Rejection *</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Please provide the reason for rejection"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectionDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject}>
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Request for more info dialog */}
      <Dialog open={infoDialogOpen} onOpenChange={setInfoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Additional Information</DialogTitle>
            <DialogDescription>
              Request more information for ESIC request {selectedRequest?.id} for {selectedRequest?.patientName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="info-request">Information Required *</Label>
              <Textarea
                id="info-request"
                placeholder="Specify what additional information is needed"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInfoDialogOpen(false)}>Cancel</Button>
            <Button variant="default" onClick={handleRequestInfo}>
              <AlertCircle className="mr-2 h-4 w-4" />
              Request Information
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 