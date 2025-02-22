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

    // Get all attendance records for the current month
    const attendance = await prisma.attendance.findMany({
      where: {
        checkInTime: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });

    // Calculate statistics
    const stats = {
      total: attendance.length,
      onTime: attendance.filter((a) => a.status === "ON_TIME").length,
      late: attendance.filter((a) => a.status === "LATE").length,
      veryLate: attendance.filter((a) => a.status === "VERY_LATE").length,
      leftEarly: attendance.filter((a) => a.status === "LEFT_EARLY").length,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("[DASHBOARD_STATS]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
