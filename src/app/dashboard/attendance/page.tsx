import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckInOutButton } from "@/components/attendance/check-in-out-button";

export default async function AttendancePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  // Get today's attendance records
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendance = await prisma.attendance.findMany({
    where: {
      userId: session.user.id,
      checkInTime: {
        gte: today,
      },
    },
    orderBy: {
      checkInTime: "desc",
    },
  });

  // Get attendance settings
  const settings = await prisma.settings.findFirst();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Attendance</h1>
        <CheckInOutButton
          currentAttendance={attendance[0]}
          settings={settings}
        />
      </div>

      <div className="mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendance.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  {format(record.checkInTime, "MMM d, yyyy")}
                </TableCell>
                <TableCell>{format(record.checkInTime, "hh:mm a")}</TableCell>
                <TableCell>
                  {record.checkOutTime
                    ? format(record.checkOutTime, "hh:mm a")
                    : "-"}
                </TableCell>
                <TableCell>{record.location}</TableCell>
                <TableCell>
                  {record.checkOutTime ? "Completed" : "In Progress"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
