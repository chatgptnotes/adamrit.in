"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Pencil, Trash2, Search, Upload, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"

// Initial diagnosis database
const initialDiagnosisDatabase = [
  { id: "d1", name: "Type 2 Diabetes Mellitus", icd: "E11" },
  { id: "d2", name: "Hypertension", icd: "I10" },
  { id: "d3", name: "Coronary Artery Disease", icd: "I25.1" },
  { id: "d4", name: "Diabetic Nephropathy", icd: "E11.2" },
  { id: "d5", name: "Chronic Kidney Disease", icd: "N18" },
  { id: "d6", name: "Asthma", icd: "J45" },
  { id: "d7", name: "Rheumatoid Arthritis", icd: "M05" },
  { id: "d8", name: "Congestive Heart Failure", icd: "I50" },
  { id: "d9", name: "Chronic Obstructive Pulmonary Disease", icd: "J44" },
  { id: "d10", name: "Osteoporosis", icd: "M81" },
  { id: "d11", name: "Parkinson's Disease", icd: "G20" },
  { id: "d12", name: "Multiple Sclerosis", icd: "G35" },
  { id: "d13", name: "Hypothyroidism", icd: "E03" },
  { id: "d14", name: "Alzheimer's Disease", icd: "G30" },
  { id: "d15", name: "Epilepsy", icd: "G40" },
  { id: "d16", name: "Gastroesophageal Reflux Disease", icd: "K21" },
  { id: "d17", name: "Migraine", icd: "G43" },
  { id: "d18", name: "Anemia", icd: "D64" },
  { id: "d19", name: "Glaucoma", icd: "H40" },
  { id: "d20", name: "Psoriasis", icd: "L40" },
]

// Type for diagnosis entries
interface DiagnosisMaster {
  id: string
  name: string
  icd: string
}

export function DiagnosisMaster() {
  const [diagnosisDatabase, setDiagnosisDatabase] = useState<DiagnosisMaster[]>(initialDiagnosisDatabase)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [formData, setFormData] = useState<DiagnosisMaster>({ id: "", name: "", icd: "" })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Filter diagnoses based on search term
  const filteredDiagnoses = diagnosisDatabase.filter(
    (diagnosis) => 
      diagnosis.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diagnosis.icd.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAdd = () => {
    setFormData({ id: `d${diagnosisDatabase.length + 1}`, name: "", icd: "" })
    setIsAddDialogOpen(true)
  }

  const handleEdit = (diagnosis: DiagnosisMaster) => {
    setFormData({ ...diagnosis })
    setEditingId(diagnosis.id)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setDiagnosisDatabase(diagnosisDatabase.filter(diagnosis => diagnosis.id !== id))
  }

  const handleSaveAdd = () => {
    if (formData.name.trim() === "" || formData.icd.trim() === "") {
      return // Don't save if required fields are empty
    }
    
    setDiagnosisDatabase([...diagnosisDatabase, formData])
    setIsAddDialogOpen(false)
  }

  const handleSaveEdit = () => {
    if (formData.name.trim() === "" || formData.icd.trim() === "") {
      return // Don't save if required fields are empty
    }
    
    setDiagnosisDatabase(diagnosisDatabase.map(diagnosis => 
      diagnosis.id === editingId ? formData : diagnosis
    ))
    setIsEditDialogOpen(false)
  }

  const handleImportClick = () => {
    setImportError(null)
    setIsImportDialogOpen(true)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const csvData = e.target?.result as string
        const importedData = parseCSV(csvData)
        
        if (importedData.length === 0) {
          setImportError("No valid data found in the CSV file")
          return
        }

        // Generate IDs for the new entries
        const newDiagnoses = importedData.map((diagnosis, index) => ({
          ...diagnosis,
          id: `d${diagnosisDatabase.length + index + 1}`
        }))

        setDiagnosisDatabase([...diagnosisDatabase, ...newDiagnoses])
        setIsImportDialogOpen(false)
        
        // Show success message
        toast({
          title: "Import Successful",
          description: `${newDiagnoses.length} diagnoses were imported.`,
        })

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } catch (error) {
        setImportError("Failed to parse CSV file. Please check the format.")
      }
    }
    reader.onerror = () => {
      setImportError("Failed to read the file")
    }
    reader.readAsText(file)
  }

  const parseCSV = (csvData: string): Omit<DiagnosisMaster, "id">[] => {
    // Split by lines
    const lines = csvData.split(/\r\n|\n|\r/).filter(line => line.trim())
    
    if (lines.length < 2) {
      throw new Error("CSV file must contain a header row and at least one data row")
    }
    
    // The first line is the header
    const headers = lines[0].split(',').map(header => header.trim().toLowerCase())
    
    // Check if the CSV has the required columns
    const requiredColumns = ['name', 'icd']
    const hasRequiredColumns = requiredColumns.every(col => 
      headers.includes(col)
    )
    
    if (!hasRequiredColumns) {
      throw new Error("CSV file must contain 'name' and 'icd' columns")
    }
    
    // Get column indices
    const nameIndex = headers.indexOf('name')
    const icdIndex = headers.indexOf('icd')
    
    // Parse the rows
    const diagnoses: Omit<DiagnosisMaster, "id">[] = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(val => val.trim())
      
      // Skip empty lines
      if (values.length <= 1 && values[0] === '') continue
      
      if (values.length < headers.length) {
        continue // Skip malformed rows
      }
      
      diagnoses.push({
        name: values[nameIndex],
        icd: values[icdIndex]
      })
    }
    
    return diagnoses
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by diagnosis name or ICD code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 h-10 bg-muted/40 border-0 rounded-lg"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleImportClick}
            className="rounded-lg"
          >
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
          <Button onClick={handleAdd} className="rounded-lg">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Diagnosis
          </Button>
        </div>
      </div>
      
      <div className="bg-card rounded-xl border shadow-sm flex-1 overflow-hidden flex flex-col">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Diagnosis Name</TableHead>
              <TableHead className="w-[150px]">ICD Code</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDiagnoses.length > 0 ? (
              filteredDiagnoses.map((diagnosis) => (
                <TableRow key={diagnosis.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{diagnosis.id}</TableCell>
                  <TableCell>{diagnosis.name}</TableCell>
                  <TableCell className="text-blue-600 font-medium">{diagnosis.icd}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="rounded-full h-8 w-8"
                        onClick={() => handleEdit(diagnosis)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="rounded-full h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(diagnosis.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Search className="h-10 w-10 mb-2 opacity-20" />
                    <p>No diagnoses found. Try a different search term.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Diagnosis Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Diagnosis</DialogTitle>
            <DialogDescription>
              Add a new diagnosis with its ICD code.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right text-sm font-medium">
                Diagnosis
              </label>
              <Input
                id="name"
                className="col-span-3"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="icd" className="text-right text-sm font-medium">
                ICD Code
              </label>
              <Input
                id="icd"
                className="col-span-3"
                value={formData.icd}
                onChange={(e) => setFormData({ ...formData, icd: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAdd}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Diagnosis Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Diagnosis</DialogTitle>
            <DialogDescription>
              Update the diagnosis name and ICD code.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-name" className="text-right text-sm font-medium">
                Diagnosis
              </label>
              <Input
                id="edit-name"
                className="col-span-3"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-icd" className="text-right text-sm font-medium">
                ICD Code
              </label>
              <Input
                id="edit-icd"
                className="col-span-3"
                value={formData.icd}
                onChange={(e) => setFormData({ ...formData, icd: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import CSV Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Import Diagnoses</DialogTitle>
            <DialogDescription>
              Upload a CSV file with diagnoses to import. The CSV file should have columns for name and ICD code.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {importError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{importError}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex flex-col gap-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Input
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  id="csv-upload-diagnosis"
                />
                <label 
                  htmlFor="csv-upload-diagnosis"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload a CSV file</p>
                  <p className="text-xs text-muted-foreground">The file should have columns for name and ICD code</p>
                </label>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">CSV Format Example:</h4>
                <pre className="text-xs overflow-x-auto">
                  name,icd<br/>
                  Osteoarthritis,M15<br/>
                  Bipolar Disorder,F31<br/>
                  Atrial Fibrillation,I48
                </pre>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 