"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { PlusCircle, Pencil, Trash2, UserPlus } from "lucide-react"

// Define types for medical staff
export interface MedicalStaff {
  id: string;
  name: string;
  specialization: string;
  department: string;
  experience: number;
  qualification: string;
}

// Sample data for anesthetists
export const initialAnesthetists: MedicalStaff[] = [
  { 
    id: "A1", 
    name: "Dr. Anita Sharma", 
    specialization: "General Anesthesia", 
    department: "Anesthesiology",
    experience: 15,
    qualification: "MD Anesthesiology"
  },
  { 
    id: "A2", 
    name: "Dr. Rajiv Kapoor", 
    specialization: "Regional Anesthesia", 
    department: "Anesthesiology",
    experience: 12,
    qualification: "MD Anesthesiology"
  },
  { 
    id: "A3", 
    name: "Dr. Priya Mehta", 
    specialization: "Pediatric Anesthesia", 
    department: "Anesthesiology",
    experience: 10,
    qualification: "MD Anesthesiology, Fellowship in Pediatric Anesthesia"
  },
  { 
    id: "A4", 
    name: "Dr. Sanjay Verma", 
    specialization: "Cardiac Anesthesia", 
    department: "Anesthesiology",
    experience: 18,
    qualification: "MD Anesthesiology, DM Cardiac Anesthesia"
  },
  { 
    id: "A5", 
    name: "Dr. Meera Patel", 
    specialization: "Neuroanesthesia", 
    department: "Anesthesiology",
    experience: 14,
    qualification: "MD Anesthesiology, Fellowship in Neuroanesthesia"
  }
];

// Sample data for surgeons
export const initialSurgeons: MedicalStaff[] = [
  { 
    id: "S1", 
    name: "Dr. Rahul Gupta", 
    specialization: "General Surgery", 
    department: "Surgery",
    experience: 20,
    qualification: "MS General Surgery"
  },
  { 
    id: "S2", 
    name: "Dr. Nandini Shah", 
    specialization: "Cardiothoracic Surgery", 
    department: "Cardiology",
    experience: 16,
    qualification: "MS General Surgery, MCh Cardiothoracic Surgery"
  },
  { 
    id: "S3", 
    name: "Dr. Vivek Joshi", 
    specialization: "Orthopedic Surgery", 
    department: "Orthopedics",
    experience: 18,
    qualification: "MS Orthopedics"
  },
  { 
    id: "S4", 
    name: "Dr. Kiran Reddy", 
    specialization: "Neurosurgery", 
    department: "Neurology",
    experience: 22,
    qualification: "MS General Surgery, MCh Neurosurgery"
  },
  { 
    id: "S5", 
    name: "Dr. Deepak Malhotra", 
    specialization: "Ophthalmology", 
    department: "Ophthalmology",
    experience: 15,
    qualification: "MS Ophthalmology"
  },
  { 
    id: "S6", 
    name: "Dr. Anjali Singh", 
    specialization: "Obstetrics and Gynecology", 
    department: "OB-GYN",
    experience: 17,
    qualification: "MS Obstetrics and Gynecology"
  },
  { 
    id: "S7", 
    name: "Dr. Sunil Kumar", 
    specialization: "ENT Surgery", 
    department: "Otolaryngology",
    experience: 14,
    qualification: "MS ENT"
  }
];

export function MedicalStaffMaster() {
  const [activeTab, setActiveTab] = useState("anesthetists");
  const [anesthetists, setAnesthetists] = useState<MedicalStaff[]>(initialAnesthetists);
  const [surgeons, setSurgeons] = useState<MedicalStaff[]>(initialSurgeons);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<MedicalStaff | null>(null);
  const [staffType, setStaffType] = useState<"anesthetist" | "surgeon">("anesthetist");

  // Filter staff based on search term
  const filteredAnesthetists = anesthetists.filter(staff => 
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredSurgeons = surgeons.filter(staff => 
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle adding new staff
  const handleAddStaff = () => {
    setCurrentStaff({
      id: "",
      name: "",
      specialization: "",
      department: "",
      experience: 0,
      qualification: ""
    });
    setStaffType(activeTab === "anesthetists" ? "anesthetist" : "surgeon");
    setIsAddDialogOpen(true);
  };

  // Handle editing existing staff
  const handleEditStaff = (staff: MedicalStaff, type: "anesthetist" | "surgeon") => {
    setCurrentStaff({...staff});
    setStaffType(type);
    setIsEditDialogOpen(true);
  };

  // Handle deleting staff
  const handleDeleteStaff = (id: string, type: "anesthetist" | "surgeon") => {
    if (type === "anesthetist") {
      setAnesthetists(anesthetists.filter(staff => staff.id !== id));
    } else {
      setSurgeons(surgeons.filter(staff => staff.id !== id));
    }
    
    toast({
      title: "Staff member removed",
      description: "The staff member has been removed successfully."
    });
  };

  // Handle saving new staff
  const handleSaveNewStaff = () => {
    if (!currentStaff) return;
    
    const { name, specialization, department, experience, qualification } = currentStaff;
    
    if (!name || !specialization || !department) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (staffType === "anesthetist") {
      const newId = `A${anesthetists.length + 1}`;
      setAnesthetists([...anesthetists, {...currentStaff, id: newId}]);
    } else {
      const newId = `S${surgeons.length + 1}`;
      setSurgeons([...surgeons, {...currentStaff, id: newId}]);
    }
    
    setIsAddDialogOpen(false);
    
    toast({
      title: "Staff added",
      description: "The new staff member has been added successfully."
    });
  };

  // Handle updating existing staff
  const handleUpdateStaff = () => {
    if (!currentStaff) return;
    
    const { id, name, specialization, department, experience, qualification } = currentStaff;
    
    if (!name || !specialization || !department) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (staffType === "anesthetist") {
      setAnesthetists(anesthetists.map(staff => 
        staff.id === id ? currentStaff : staff
      ));
    } else {
      setSurgeons(surgeons.map(staff => 
        staff.id === id ? currentStaff : staff
      ));
    }
    
    setIsEditDialogOpen(false);
    
    toast({
      title: "Staff updated",
      description: "The staff member has been updated successfully."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Medical Staff Management</h3>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="anesthetists">Anesthetists</TabsTrigger>
            <TabsTrigger value="surgeons">Surgeons</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search staff..."
                className="w-[250px] pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button onClick={handleAddStaff}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Staff
            </Button>
          </div>
        </div>
        
        <TabsContent value="anesthetists" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Experience (Years)</TableHead>
                    <TableHead>Qualification</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnesthetists.length > 0 ? (
                    filteredAnesthetists.map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell className="font-medium">{staff.id}</TableCell>
                        <TableCell>{staff.name}</TableCell>
                        <TableCell>{staff.specialization}</TableCell>
                        <TableCell>{staff.department}</TableCell>
                        <TableCell>{staff.experience}</TableCell>
                        <TableCell>{staff.qualification}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditStaff(staff, "anesthetist")}
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteStaff(staff.id, "anesthetist")}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No anesthetists found. {searchTerm && "Try a different search term."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="surgeons" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Experience (Years)</TableHead>
                    <TableHead>Qualification</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSurgeons.length > 0 ? (
                    filteredSurgeons.map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell className="font-medium">{staff.id}</TableCell>
                        <TableCell>{staff.name}</TableCell>
                        <TableCell>{staff.specialization}</TableCell>
                        <TableCell>{staff.department}</TableCell>
                        <TableCell>{staff.experience}</TableCell>
                        <TableCell>{staff.qualification}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditStaff(staff, "surgeon")}
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteStaff(staff.id, "surgeon")}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No surgeons found. {searchTerm && "Try a different search term."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add Staff Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New {staffType === "anesthetist" ? "Anesthetist" : "Surgeon"}</DialogTitle>
            <DialogDescription>
              Enter the details for the new staff member.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Dr. Full Name"
                className="col-span-3"
                value={currentStaff?.name || ""}
                onChange={(e) => setCurrentStaff(prev => prev ? {...prev, name: e.target.value} : null)}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="specialization" className="text-right">
                Specialization <span className="text-red-500">*</span>
              </Label>
              <Input
                id="specialization"
                placeholder="Area of specialization"
                className="col-span-3"
                value={currentStaff?.specialization || ""}
                onChange={(e) => setCurrentStaff(prev => prev ? {...prev, specialization: e.target.value} : null)}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Department <span className="text-red-500">*</span>
              </Label>
              <Input
                id="department"
                placeholder="Department name"
                className="col-span-3"
                value={currentStaff?.department || ""}
                onChange={(e) => setCurrentStaff(prev => prev ? {...prev, department: e.target.value} : null)}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="experience" className="text-right">
                Experience (Years)
              </Label>
              <Input
                id="experience"
                type="number"
                placeholder="Years of experience"
                className="col-span-3"
                value={currentStaff?.experience || ""}
                onChange={(e) => setCurrentStaff(prev => prev ? {...prev, experience: parseInt(e.target.value) || 0} : null)}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="qualification" className="text-right">
                Qualification
              </Label>
              <Input
                id="qualification"
                placeholder="Educational qualifications"
                className="col-span-3"
                value={currentStaff?.qualification || ""}
                onChange={(e) => setCurrentStaff(prev => prev ? {...prev, qualification: e.target.value} : null)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNewStaff}>
              Add Staff
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Staff Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit {staffType === "anesthetist" ? "Anesthetist" : "Surgeon"}</DialogTitle>
            <DialogDescription>
              Update the details for this staff member.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                placeholder="Dr. Full Name"
                className="col-span-3"
                value={currentStaff?.name || ""}
                onChange={(e) => setCurrentStaff(prev => prev ? {...prev, name: e.target.value} : null)}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-specialization" className="text-right">
                Specialization <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-specialization"
                placeholder="Area of specialization"
                className="col-span-3"
                value={currentStaff?.specialization || ""}
                onChange={(e) => setCurrentStaff(prev => prev ? {...prev, specialization: e.target.value} : null)}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-department" className="text-right">
                Department <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-department"
                placeholder="Department name"
                className="col-span-3"
                value={currentStaff?.department || ""}
                onChange={(e) => setCurrentStaff(prev => prev ? {...prev, department: e.target.value} : null)}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-experience" className="text-right">
                Experience (Years)
              </Label>
              <Input
                id="edit-experience"
                type="number"
                placeholder="Years of experience"
                className="col-span-3"
                value={currentStaff?.experience || ""}
                onChange={(e) => setCurrentStaff(prev => prev ? {...prev, experience: parseInt(e.target.value) || 0} : null)}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-qualification" className="text-right">
                Qualification
              </Label>
              <Input
                id="edit-qualification"
                placeholder="Educational qualifications"
                className="col-span-3"
                value={currentStaff?.qualification || ""}
                onChange={(e) => setCurrentStaff(prev => prev ? {...prev, qualification: e.target.value} : null)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStaff}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Missing icon import
import { Search } from "lucide-react" 