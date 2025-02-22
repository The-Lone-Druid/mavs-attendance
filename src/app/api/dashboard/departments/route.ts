import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { endOfMonth, startOfMonth } from "date-fns";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);

    // Get all departments with their users and attendance
    const departments = await prisma.department.findMany({
      include: {
        users: {
          include: {
            attendance: {
              where: {
                checkInTime: {
                  gte: monthStart,
                  lte: monthEnd,
                },
              },
            },
          },
        },
      },
    });

    // Calculate statistics for each department
    const stats = departments.map((dept) => {
      const totalMembers = dept.users.length;
      const totalAttendance = dept.users.reduce(
        (sum, user) => sum + user.attendance.length,
        0
      );
      const onTimeCount = dept.users.reduce(
        (sum, user) =>
          sum + user.attendance.filter((a) => a.status === "ON_TIME").length,
        0
      );
      const lateCount = dept.users.reduce(
        (sum, user) =>
          sum +
          user.attendance.filter(
            (a) => a.status === "LATE" || a.status === "VERY_LATE"
          ).length,
        0
      );

      const workingDays = 22; // Approximate working days in a month
      const expectedAttendance = totalMembers * workingDays;

      return {
        id: dept.id,
        name: dept.name,
        totalMembers,
        onTimePercentage: Math.round((onTimeCount / expectedAttendance) * 100),
        latePercentage: Math.round((lateCount / expectedAttendance) * 100),
        absentPercentage: Math.round(
          ((expectedAttendance - totalAttendance) / expectedAttendance) * 100
        ),
      };
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
