import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { endOfDay, endOfMonth, startOfDay, startOfMonth } from "date-fns";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const resolvedParams = await params;

    if (!session || !["Admin", "Manager"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const id = parseInt(resolvedParams.id);

    const dateRange = month
      ? {
          gte: startOfMonth(new Date(month)),
          lte: endOfMonth(new Date(month)),
        }
      : {
          gte: startOfDay(new Date()),
          lte: endOfDay(new Date()),
        };

    const attendance = await prisma.attendance.findMany({
      where: {
        user: {
          departmentId: id,
        },
        checkInTime: dateRange,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        checkInTime: "desc",
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

    return NextResponse.json({ attendance, stats });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
