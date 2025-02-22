"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
type DepartmentStat = {
  id: string;
  name: string;
  totalMembers: number;
  onTimePercentage: number;
  latePercentage: number;
  absentPercentage: number;
};

export function DepartmentStats() {
  const { data: stats, isLoading } = useQuery<DepartmentStat[]>({
    queryKey: ["departmentStats"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/departments");
      if (!response.ok) throw new Error("Failed to fetch department stats");
      return response.json();
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Overview</CardTitle>
        <CardDescription>Monthly attendance by department</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>On Time</TableHead>
                <TableHead>Late</TableHead>
                <TableHead>Absent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats?.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell className="font-medium">{dept.name}</TableCell>
                  <TableCell>{dept.totalMembers}</TableCell>
                  <TableCell className="text-green-600">
                    {dept.onTimePercentage}%
                  </TableCell>
                  <TableCell className="text-yellow-600">
                    {dept.latePercentage}%
                  </TableCell>
                  <TableCell className="text-red-600">
                    {dept.absentPercentage}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
