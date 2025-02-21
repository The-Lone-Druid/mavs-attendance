"use client";

import { useState } from "react";
import { Department, User } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { EditDepartmentForm } from "./edit-department-form";

interface EditDepartmentDialogProps {
  department: Department & {
    users: Pick<User, "id" | "name" | "email" | "role">[];
  };
}

export function EditDepartmentDialog({ department }: EditDepartmentDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Department</DialogTitle>
        </DialogHeader>
        <EditDepartmentForm department={department} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
} 