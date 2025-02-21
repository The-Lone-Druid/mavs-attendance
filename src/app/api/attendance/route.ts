import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { validateCheckInTime, validateCheckOutTime } from "@/lib/attendance";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();
    const { location, selfie, type } = body;

    if (type === "checkin") {
      // Validate check-in time
      const settings = await prisma.settings.findFirst();
      const validation = validateCheckInTime(new Date(), settings!);

      const attendance = await prisma.attendance.create({
        data: {
          userId: session.user.id,
          checkInTime: new Date(),
          location,
          selfie,
          status: validation.status || "ON_TIME",
          minutesLate: validation.minutesLate,
        },
      });
      return NextResponse.json(attendance);
    } else {
      const attendance = await prisma.attendance.findFirst({
        where: {
          userId: session.user.id,
          checkOutTime: null,
        },
        orderBy: {
          checkInTime: "desc",
        },
      });

      if (!attendance) {
        return new NextResponse("No active check-in found", { status: 400 });
      }

      const settings = await prisma.settings.findFirst();
      const validation = validateCheckOutTime(new Date(), settings!);

      const updated = await prisma.attendance.update({
        where: { id: attendance.id },
        data: {
          checkOutTime: new Date(),
          location,
          selfie,
          status: validation.status || attendance.status,
        },
      });

      return NextResponse.json(updated);
    }
  } catch (error) {
    console.error("[ATTENDANCE_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
