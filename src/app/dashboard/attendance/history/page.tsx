import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { format, startOfDay, endOfDay, parseISO } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AttendanceStatusBadge } from "@/components/attendance/attendance-status-badge";
import { AttendanceFilters } from "@/components/attendance/attendance-filters";
import { PaginationButton } from "@/components/pagination-button";
import { PageHeader } from "@/components/layout/page-header";

const ITEMS_PER_PAGE = 10;

interface PageProps {
  searchParams: Promise<{
    status?: string;
    date?: string;
    page?: string;
  }>;
}

export default async function AttendanceHistoryPage({
  searchParams,
}: PageProps) {
  const session = await getServerSession(authOptions);
  const params = await searchParams;

  if (!session) {
    redirect("/auth/signin");
  }

  const page = Number(params.page) || 1;
  const status = params.status;
  const date = params.date ? parseISO(params.date) : null;

  // Build where clause
  const where = {
    userId: session.user.id,
    ...(status && { status }),
    ...(date && {
      checkInTime: {
        gte: startOfDay(date),
        lte: endOfDay(date),
      },
    }),
  };

  // Get total count for pagination
  const totalCount = await prisma.attendance.count({ where });
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const attendance = await prisma.attendance.findMany({
    where,
    orderBy: {
      checkInTime: "desc",
    },
    skip: (page - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
  });

  return (
    <div className="p-4 md:p-8">
      <PageHeader title="Attendance History">
        <AttendanceFilters />
      </PageHeader>

      <div className="mt-8 overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Late By</TableHead>
                <TableHead>Location</TableHead>
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
                  <TableCell>
                    <AttendanceStatusBadge status={record.status} />
                  </TableCell>
                  <TableCell>
                    {record.minutesLate ? `${record.minutesLate} mins` : "-"}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {record.location}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <PaginationButton
                currentPage={page}
                totalPages={totalPages}
                baseUrl="/dashboard/attendance/history"
                preserveParams={["status", "date"]}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
