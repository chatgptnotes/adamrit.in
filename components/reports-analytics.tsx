"use client"

import React, { useState } from "react"
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
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts"
import { 
  Calendar,
  Download,
  FileText, 
  TrendingUp, 
  Users, 
  FileDown, 
  ClipboardList,
  Scissors,
  Search,
  Printer,
  ArrowUpDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

// Sample data for the charts
const diagnosisData = [
  { name: "Diabetes", count: 65 },
  { name: "Hypertension", count: 45 },
  { name: "Asthma", count: 32 },
  { name: "Arthritis", count: 28 },
  { name: "Heart Disease", count: 24 },
  { name: "Thyroid", count: 20 },
  { name: "Anemia", count: 15 },
]

const surgeryData = [
  { name: "Appendectomy", count: 24 },
  { name: "Knee Replacement", count: 18 },
  { name: "Cataract", count: 42 },
  { name: "Hernia Repair", count: 30 },
  { name: "Gallbladder Removal", count: 22 },
]

const monthlyApprovalData = [
  { name: "Jan", approved: 45, rejected: 12, pending: 8 },
  { name: "Feb", approved: 52, rejected: 15, pending: 10 },
  { name: "Mar", approved: 48, rejected: 10, pending: 5 },
  { name: "Apr", approved: 60, rejected: 8, pending: 12 },
  { name: "May", approved: 55, rejected: 14, pending: 6 },
  { name: "Jun", approved: 68, rejected: 9, pending: 8 },
  { name: "Jul", approved: 72, rejected: 11, pending: 9 },
  { name: "Aug", approved: 65, rejected: 13, pending: 7 },
  { name: "Sep", approved: 58, rejected: 10, pending: 8 },
  { name: "Oct", approved: 63, rejected: 12, pending: 10 },
  { name: "Nov", approved: 70, rejected: 9, pending: 6 },
  { name: "Dec", approved: 75, rejected: 8, pending: 5 },
]

const approvalStatusData = [
  { name: "Approved", value: 635, color: "#4ade80" },
  { name: "Rejected", value: 121, color: "#f87171" },
  { name: "Pending", value: 84, color: "#fbbf24" },
  { name: "Info Required", value: 41, color: "#60a5fa" },
]

const topDoctorsData = [
  { name: "Dr. Neha Patel", department: "Cardiology", cases: 78 },
  { name: "Dr. Rajesh Kumar", department: "Orthopedics", cases: 65 },
  { name: "Dr. Anjali Gupta", department: "Ophthalmology", cases: 62 },
  { name: "Dr. Vikram Singh", department: "General Surgery", cases: 57 },
  { name: "Dr. Sunil Mehta", department: "Neurology", cases: 52 },
]

// Add dummy patient data right after the topDoctorsData
const patientsData = [
  { 
    id: "ESIC-2023-1001", 
    name: "Rahul Sharma", 
    age: 42, 
    gender: "Male", 
    diagnosis: "Type 2 Diabetes Mellitus",
    surgery: "Cataract Surgery",
    approvalStatus: "Approved",
    registrationDate: "15 Jan 2023",
    lastVisit: "22 Apr 2023",
    insuranceStatus: "Active",
    referee: "Dr. Neha Patel"
  },
  { 
    id: "ESIC-2023-1002", 
    name: "Priya Patel", 
    age: 35, 
    gender: "Female", 
    diagnosis: "Hypertension",
    surgery: "None",
    approvalStatus: "Approved",
    registrationDate: "18 Feb 2023",
    lastVisit: "14 May 2023",
    insuranceStatus: "Active",
    referee: "Dr. Vikram Singh"
  },
  { 
    id: "ESIC-2023-1003", 
    name: "Amit Kumar", 
    age: 58, 
    gender: "Male", 
    diagnosis: "Coronary Artery Disease",
    surgery: "Coronary Angioplasty",
    approvalStatus: "Pending",
    registrationDate: "22 Mar 2023",
    lastVisit: "10 Jun 2023",
    insuranceStatus: "Active",
    referee: "Dr. Neha Patel"
  },
  { 
    id: "ESIC-2023-1004", 
    name: "Sunita Gupta", 
    age: 62, 
    gender: "Female", 
    diagnosis: "Rheumatoid Arthritis",
    surgery: "Total Knee Replacement",
    approvalStatus: "Approved",
    registrationDate: "05 Apr 2023",
    lastVisit: "28 Jul 2023",
    insuranceStatus: "Active",
    referee: "Dr. Rajesh Kumar"
  },
  { 
    id: "ESIC-2023-1005", 
    name: "Rajesh Verma", 
    age: 47, 
    gender: "Male", 
    diagnosis: "Asthma",
    surgery: "None",
    approvalStatus: "Approved",
    registrationDate: "12 May 2023",
    lastVisit: "16 Aug 2023",
    insuranceStatus: "Expired",
    referee: "Dr. Sunil Mehta"
  },
  { 
    id: "ESIC-2023-1006", 
    name: "Anjali Deshmukh", 
    age: 39, 
    gender: "Female", 
    diagnosis: "Hypothyroidism",
    surgery: "None",
    approvalStatus: "Approved",
    registrationDate: "23 Jun 2023",
    lastVisit: "11 Sep 2023",
    insuranceStatus: "Active",
    referee: "Dr. Anjali Gupta"
  },
  { 
    id: "ESIC-2023-1007", 
    name: "Vikram Singh", 
    age: 51, 
    gender: "Male", 
    diagnosis: "Diabetic Nephropathy",
    surgery: "None",
    approvalStatus: "Pending",
    registrationDate: "08 Jul 2023",
    lastVisit: "30 Oct 2023",
    insuranceStatus: "Active",
    referee: "Dr. Neha Patel"
  },
  { 
    id: "ESIC-2023-1008", 
    name: "Meena Joshi", 
    age: 44, 
    gender: "Female", 
    diagnosis: "Gastroesophageal Reflux Disease",
    surgery: "Laparoscopic Cholecystectomy",
    approvalStatus: "Approved",
    registrationDate: "19 Aug 2023",
    lastVisit: "14 Nov 2023",
    insuranceStatus: "Active",
    referee: "Dr. Vikram Singh"
  },
  { 
    id: "ESIC-2023-1009", 
    name: "Deepak Sharma", 
    age: 56, 
    gender: "Male", 
    diagnosis: "Chronic Obstructive Pulmonary Disease",
    surgery: "None",
    approvalStatus: "Rejected",
    registrationDate: "03 Sep 2023",
    lastVisit: "18 Dec 2023",
    insuranceStatus: "Expired",
    referee: "Dr. Sunil Mehta"
  },
  { 
    id: "ESIC-2023-1010", 
    name: "Kavita Malhotra", 
    age: 38, 
    gender: "Female", 
    diagnosis: "Migraine",
    surgery: "None",
    approvalStatus: "Approved",
    registrationDate: "27 Oct 2023",
    lastVisit: "15 Jan 2024",
    insuranceStatus: "Active",
    referee: "Dr. Anjali Gupta"
  },
];

export function ReportsAnalytics() {
  const [timeRange, setTimeRange] = useState("year")
  const [activeTab, setActiveTab] = useState("approvals")
  const [patientSearchTerm, setPatientSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedReferee, setSelectedReferee] = useState<string>("all")
  
  // Extract unique referees for the filter
  const uniqueReferees = Array.from(new Set(patientsData.map(patient => patient.referee)))
  
  // Function to handle clicking on total patients card
  const handleTotalPatientsClick = () => {
    setActiveTab("patients");
  }
  
  const filteredPatients = patientsData.filter(patient => {
    // Filter by search term
    const searchTermLower = patientSearchTerm.toLowerCase();
    const matchesSearch = (
      patient.id.toLowerCase().includes(searchTermLower) ||
      patient.name.toLowerCase().includes(searchTermLower) ||
      patient.diagnosis.toLowerCase().includes(searchTermLower) ||
      patient.surgery.toLowerCase().includes(searchTermLower) ||
      patient.approvalStatus.toLowerCase().includes(searchTermLower) ||
      patient.referee.toLowerCase().includes(searchTermLower)
    );
    
    // Filter by referee
    const matchesReferee = selectedReferee === "all" || patient.referee === selectedReferee;
    
    return matchesSearch && matchesReferee;
  });
  
  // Handle sorting columns
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction if same column is clicked
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column and default to ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Sort patients based on current sort settings
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    // Handle different columns
    switch (sortColumn) {
      case 'name':
        return direction * a.name.localeCompare(b.name);
      case 'age':
        return direction * (a.age - b.age);
      case 'diagnosis':
        return direction * a.diagnosis.localeCompare(b.diagnosis);
      case 'registration':
        // Simple string comparison for dates in this format
        return direction * a.registrationDate.localeCompare(b.registrationDate);
      case 'referee':
        return direction * a.referee.localeCompare(b.referee);
      default:
        return 0;
    }
  });

  // Print patient list
  const handlePrintList = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const tableStyles = `
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f7ff; color: #1a56db; }
          tr:nth-child(even) { background-color: #f9fafb; }
          h1 { color: #1a56db; }
          .status { padding: 2px 8px; border-radius: 12px; font-size: 12px; }
          .approved { background-color: #d1fae5; color: #047857; }
          .pending { background-color: #fef3c7; color: #b45309; }
          .rejected { background-color: #fee2e2; color: #b91c1c; }
          .active { background-color: #d1fae5; color: #047857; }
          .expired { background-color: #fee2e2; color: #b91c1c; }
        </style>
      `;
      
      // Header
      let content = `
        <html>
          <head>
            <title>Patient Registry - Hope Hospital Hospital Management System</title>
            ${tableStyles}
          </head>
          <body>
            <h1>Patient Registry</h1>
            <p>Total Patients: ${sortedPatients.length} | Generated on: ${new Date().toLocaleDateString()}</p>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Age/Gender</th>
                  <th>Primary Diagnosis</th>
                  <th>Surgery</th>
                  <th>Status</th>
                  <th>Registration</th>
                  <th>Insurance</th>
                  <th>Referee</th>
                </tr>
              </thead>
              <tbody>
      `;
      
      // Table rows
      sortedPatients.forEach(patient => {
        content += `
          <tr>
            <td>${patient.id}</td>
            <td>${patient.name}</td>
            <td>${patient.age} / ${patient.gender}</td>
            <td>${patient.diagnosis}</td>
            <td>${patient.surgery === "None" ? "-" : patient.surgery}</td>
            <td><span class="status ${patient.approvalStatus.toLowerCase()}">${patient.approvalStatus}</span></td>
            <td>${patient.registrationDate}</td>
            <td><span class="status ${patient.insuranceStatus.toLowerCase()}">${patient.insuranceStatus}</span></td>
            <td>${patient.referee}</td>
          </tr>
        `;
      });
      
      // Footer
      content += `
              </tbody>
            </table>
            <p style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px;">
              Hope Hospital ESIC Patient Management System
            </p>
          </body>
        </html>
      `;
      
      printWindow.document.open();
      printWindow.document.write(content);
      printWindow.document.close();
      
      // Add a slight delay to ensure content is loaded
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">ESIC Reports & Analytics</h3>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <FileDown className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">881</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72.1%</div>
            <p className="text-xs text-muted-foreground">
              +4.3% from previous period
            </p>
          </CardContent>
        </Card>
        <Card 
          className="cursor-pointer relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-blue-200 group" 
          onClick={handleTotalPatientsClick}
        >
          <div className="absolute inset-0 bg-blue-100 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-blue-50 text-blue-500 group-hover:bg-blue-100 transition-colors">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col">
            <div className="flex items-end">
              <div className="text-3xl font-bold text-blue-700">{patientsData.length}</div>
              <div className="text-sm ml-2 mb-1 text-muted-foreground">registered</div>
            </div>
            <div className="flex items-center mt-2 text-xs text-blue-600">
              <span>View patient list</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-3 w-3 transition-transform duration-300 group-hover:translate-x-1">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Processing Time</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2 days</div>
            <p className="text-xs text-muted-foreground">
              -0.8 days from previous period
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="approvals">Approval Metrics</TabsTrigger>
          <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
          <TabsTrigger value="surgeries">Surgeries</TabsTrigger>
          <TabsTrigger value="doctors">Top Doctors</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
        </TabsList>
        
        {/* Approvals Tab */}
        <TabsContent value="approvals" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Monthly Approvals Trend */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Monthly ESIC Approval Trends</CardTitle>
                <CardDescription>
                  Number of approvals, rejections and pending cases by month
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyApprovalData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="approved" stackId="a" fill="#4ade80" name="Approved" />
                    <Bar dataKey="rejected" stackId="a" fill="#f87171" name="Rejected" />
                    <Bar dataKey="pending" stackId="a" fill="#fbbf24" name="Pending" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Approval Status Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Approval Status Distribution</CardTitle>
                <CardDescription>
                  Overall distribution of request statuses
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={approvalStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {approvalStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>
                  Latest generated reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Monthly Approval Summary</span>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Top Surgeries Q3</span>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Doctor Performance</span>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Cost Analysis Report</span>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Diagnosis Tab */}
        <TabsContent value="diagnosis">
          <Card>
            <CardHeader>
              <CardTitle>Top Diagnoses</CardTitle>
              <CardDescription>
                Most common diagnoses in ESIC claims
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={diagnosisData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 60,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" name="Number of Cases" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Surgeries Tab */}
        <TabsContent value="surgeries">
          <Card>
            <CardHeader>
              <CardTitle>Top Surgeries</CardTitle>
              <CardDescription>
                Most common surgery procedures in ESIC claims
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={surgeryData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 60,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" name="Number of Cases" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Doctors Tab */}
        <TabsContent value="doctors">
          <Card>
            <CardHeader>
              <CardTitle>Top Doctors by Case Volume</CardTitle>
              <CardDescription>
                Doctors with the highest number of ESIC cases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {topDoctorsData.map((doctor, index) => (
                  <div key={index} className="flex items-center">
                    <div className="space-y-1 mr-4">
                      <p className="text-sm font-medium leading-none">{doctor.name}</p>
                      <p className="text-sm text-muted-foreground">{doctor.department}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-sm font-medium">{doctor.cases} cases</span>
                      <div className="h-2 w-[100px] bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${(doctor.cases / topDoctorsData[0].cases) * 100}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Patients Tab */}
        <TabsContent value="patients">
          <Card>
            <CardHeader className="flex justify-between flex-col sm:flex-row items-start gap-4">
              <div>
                <CardTitle>Patient Registry</CardTitle>
                <CardDescription>
                  Complete list of patients registered in the ESIC system
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                <Select 
                  value={selectedReferee} 
                  onValueChange={setSelectedReferee}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Referee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Referees</SelectItem>
                    {uniqueReferees.map(referee => (
                      <SelectItem key={referee} value={referee}>{referee}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, ID, diagnosis..."
                    className="pl-10 pr-4 py-2"
                    onChange={(e) => setPatientSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" onClick={handlePrintList} className="whitespace-nowrap">
                  <Printer className="mr-2 h-4 w-4" />
                  Print List
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border overflow-hidden">
                <div className="overflow-auto max-h-[600px]">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-blue-50">
                        <th className="h-12 px-4 text-left text-xs font-medium text-blue-700 align-middle whitespace-nowrap">ID</th>
                        <th 
                          className="h-12 px-4 text-left text-xs font-medium text-blue-700 align-middle whitespace-nowrap cursor-pointer hover:bg-blue-100"
                          onClick={() => handleSort('name')}
                        >
                          <div className="flex items-center">
                            Name
                            <ArrowUpDown className="ml-1 h-3 w-3" />
                          </div>
                        </th>
                        <th 
                          className="h-12 px-4 text-left text-xs font-medium text-blue-700 align-middle whitespace-nowrap cursor-pointer hover:bg-blue-100"
                          onClick={() => handleSort('age')}
                        >
                          <div className="flex items-center">
                            Age
                            <ArrowUpDown className="ml-1 h-3 w-3" />
                          </div>
                        </th>
                        <th className="h-12 px-4 text-left text-xs font-medium text-blue-700 align-middle whitespace-nowrap">Gender</th>
                        <th 
                          className="h-12 px-4 text-left text-xs font-medium text-blue-700 align-middle whitespace-nowrap cursor-pointer hover:bg-blue-100"
                          onClick={() => handleSort('diagnosis')}
                        >
                          <div className="flex items-center">
                            Primary Diagnosis
                            <ArrowUpDown className="ml-1 h-3 w-3" />
                          </div>
                        </th>
                        <th className="h-12 px-4 text-left text-xs font-medium text-blue-700 align-middle whitespace-nowrap">Surgery</th>
                        <th className="h-12 px-4 text-left text-xs font-medium text-blue-700 align-middle whitespace-nowrap">Approval Status</th>
                        <th 
                          className="h-12 px-4 text-left text-xs font-medium text-blue-700 align-middle whitespace-nowrap cursor-pointer hover:bg-blue-100"
                          onClick={() => handleSort('registration')}
                        >
                          <div className="flex items-center">
                            Registration Date
                            <ArrowUpDown className="ml-1 h-3 w-3" />
                          </div>
                        </th>
                        <th className="h-12 px-4 text-left text-xs font-medium text-blue-700 align-middle whitespace-nowrap">Last Visit</th>
                        <th className="h-12 px-4 text-left text-xs font-medium text-blue-700 align-middle whitespace-nowrap">Insurance Status</th>
                        <th 
                          className="h-12 px-4 text-left text-xs font-medium text-blue-700 align-middle whitespace-nowrap cursor-pointer hover:bg-blue-100"
                          onClick={() => handleSort('referee')}
                        >
                          <div className="flex items-center">
                            Referee
                            <ArrowUpDown className="ml-1 h-3 w-3" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedPatients.map((patient, index) => (
                        <tr key={patient.id} className={index % 2 === 0 ? "bg-white hover:bg-blue-50/50" : "bg-blue-50/20 hover:bg-blue-50/50"} style={{transition: "background-color 0.2s"}}>
                          <td className="p-3 px-4 align-middle text-sm">{patient.id}</td>
                          <td className="p-3 px-4 align-middle text-sm font-medium">{patient.name}</td>
                          <td className="p-3 px-4 align-middle text-sm">{patient.age}</td>
                          <td className="p-3 px-4 align-middle text-sm">{patient.gender}</td>
                          <td className="p-3 px-4 align-middle text-sm">{patient.diagnosis}</td>
                          <td className="p-3 px-4 align-middle text-sm">{patient.surgery === "None" ? "-" : patient.surgery}</td>
                          <td className="p-3 px-4 align-middle text-sm">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                              patient.approvalStatus === "Approved" 
                                ? "bg-green-100 text-green-700 ring-1 ring-inset ring-green-600/20" 
                                : patient.approvalStatus === "Pending"
                                ? "bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-600/20"
                                : "bg-red-100 text-red-700 ring-1 ring-inset ring-red-600/20"
                            }`}>
                              {patient.approvalStatus}
                            </span>
                          </td>
                          <td className="p-3 px-4 align-middle text-sm">{patient.registrationDate}</td>
                          <td className="p-3 px-4 align-middle text-sm">{patient.lastVisit}</td>
                          <td className="p-3 px-4 align-middle text-sm">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                              patient.insuranceStatus === "Active" 
                                ? "bg-green-100 text-green-700 ring-1 ring-inset ring-green-600/20" 
                                : "bg-red-100 text-red-700 ring-1 ring-inset ring-red-600/20"
                            }`}>
                              {patient.insuranceStatus}
                            </span>
                          </td>
                          <td className="p-3 px-4 align-middle text-sm">
                            <div className="flex items-center">
                              <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                              {patient.referee}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {sortedPatients.length === 0 && (
                    <div className="p-12 text-center">
                      <Users className="mx-auto h-12 w-12 text-muted-foreground/30" />
                      <h3 className="mt-4 text-lg font-semibold">No patients found</h3>
                      <p className="mt-2 text-muted-foreground">Try a different search term</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 