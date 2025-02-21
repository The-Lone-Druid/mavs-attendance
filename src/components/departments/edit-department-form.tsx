"use client";

import { useState } from "react";
import { Department } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import * as z from "zod";

const departmentSchema = z.object({
  name: z.string().min(2, "Department name must be at least 2 characters"),
});

interface EditDepartmentFormProps {
  department: Department;
  onSuccess: () => void;
}

export function EditDepartmentForm({ department, onSuccess }: EditDepartmentFormProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(department.name);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      departmentSchema.parse({ name });
      setError("");
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        setError(validationError.errors[0].message);
        return;
      }
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/departments/${department.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error("Failed to update department");

      toast.success("Department updated successfully");
      onSuccess();
    } catch (error) {
      toast.error("Failed to update department");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Department Name</label>
        <Input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          placeholder="Enter department name"
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
} 