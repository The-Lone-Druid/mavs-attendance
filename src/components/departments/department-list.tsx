"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EditDepartmentDialog } from "./edit-department-dialog";
import { Department, User } from "@prisma/client";
import { DepartmentUserList } from "./department-user-list";
import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";
import Link from "next/link";

interface DepartmentWithDetails extends Department {
  _count: {
    users: number;
  };
  users: Pick<User, "id" | "name" | "email" | "role" | "profilePicture">[];
}

interface DepartmentListProps {
  departments: DepartmentWithDetails[];
}

export function DepartmentList({ departments }: DepartmentListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {departments.map((department) => (
        <Card key={department.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="line-clamp-1">{department.name}</CardTitle>
              <CardDescription>
                {department._count.users} members
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/dashboard/departments/${department.id}/reports`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary sm:hidden"
              >
                <BarChart className="h-4 w-4" />
                <span>View Reports</span>
              </Link>
              <Link href={`/dashboard/departments/${department.id}/reports`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:inline-flex"
                >
                  <BarChart className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">View Reports</span>
                </Button>
              </Link>
              <EditDepartmentDialog department={department} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between sm:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() =>
                    (window.location.href = `/dashboard/departments/${department.id}/reports`)
                  }
                >
                  <BarChart className="mr-2 h-4 w-4" />
                  View Reports
                </Button>
              </div>
              <DepartmentUserList department={department} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
