"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { MedicalStaff } from "@/components/medical-staff-master"

interface StaffComboboxProps {
  staffList: MedicalStaff[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
}

export function StaffCombobox({
  staffList,
  value,
  onValueChange,
  placeholder = "Search staff...",
  emptyMessage = "No staff member found.",
  className,
}: StaffComboboxProps) {
  const [open, setOpen] = React.useState(false)
  
  // Find the selected staff member object
  const selectedStaff = staffList.find(staff => staff.id === value)
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {value
            ? selectedStaff?.name || "Unknown staff"
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}`} />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-auto">
            {staffList.map((staff) => (
              <CommandItem
                key={staff.id}
                value={staff.name}
                onSelect={() => {
                  onValueChange(staff.id === value ? "" : staff.id)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === staff.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{staff.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {staff.specialization}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 