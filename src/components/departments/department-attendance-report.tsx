"use client";

import { AttendanceStatusBadge } from "@/components/attendance/attendance-status-badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { exportToExcel, formatAttendanceForExport } from "@/lib/export";
import { Attendance, Department, User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";

interface DepartmentAttendanceReportProps {
  department: Department & {
    users: Pick<User, "id" | "name" | "email">[];
  };
}
type AttendanceStats = {
  total: number;
  onTime: number;
  late: number;
  veryLate: number;
  leftEarly: number;
};

export function DepartmentAttendanceReport({
  department,
}: DepartmentAttendanceReportProps) {
  const [date, setDate] = useState<Date>(new Date());

  const { data, isLoading } = useQuery<{
    attendance: (Attendance & { user: User })[];
    stats: AttendanceStats;
  }>({
    queryKey: ["departmentAttendance", department.id, format(date, "yyyy-MM")],
    queryFn: async () => {
      const response = await fetch(
        `/api/departments/${department.id}/attendance?month=${format(
          date,
          "yyyy-MM"
        )}`
      );
      if (!response.ok) throw new Error("Failed to fetch attendance");
      return response.json();
    },
  });

  const handleExport = () => {
    if (!data?.attendance) return;
    const formattedData = formatAttendanceForExport(data.attendance);

    exportToExcel(
      formattedData,
      `${department.name}-attendance-${format(date, "MMM-yyyy")}`
    );
  };

  return (
    <div className="grid gap-6">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Select Month</CardTitle>
            <CardDescription>
              View attendance for specific month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              disabled={(date) => date > new Date()}
              className="mx-auto max-w-[300px]"
            />
          </CardContent>
        </Card>
        {isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </CardHeader>
            <CardContent className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-8" />
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          data?.stats && (
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
                <CardDescription>Monthly attendance overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Records:</span>
                  <span className="font-medium">{data.stats.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>On Time:</span>
                  <span className="font-medium text-green-600">
                    {data.stats.onTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Late:</span>
                  <span className="font-medium text-yellow-600">
                    {data.stats.late}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Very Late:</span>
                  <span className="font-medium text-red-600">
                    {data.stats.veryLate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Left Early:</span>
                  <span className="font-medium text-orange-600">
                    {data.stats.leftEarly}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>{format(date, "MMMM yyyy")}</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={isLoading || !data?.attendance?.length}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
            <div className="min-w-[600px]">
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.attendance.map(
                      (record: Attendance & { user: User }) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.user.name}</TableCell>
                          <TableCell>
                            {format(
                              new Date(record.checkInTime),
                              "MMM d, yyyy"
                            )}
                          </TableCell>
                          <TableCell>
                            {format(new Date(record.checkInTime), "hh:mm a")}
                          </TableCell>
                          <TableCell>
                            {record.checkOutTime
                              ? format(new Date(record.checkOutTime), "hh:mm a")
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <AttendanceStatusBadge status={record.status} />
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              )}
              {!isLoading && !data?.attendance?.length && (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No attendance records found for this month
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
