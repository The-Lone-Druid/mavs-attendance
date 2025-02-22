import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const activities = await prisma.attendance.findMany({
      take: 10,
      orderBy: {
        checkInTime: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            profilePicture: true,
          },
        },
      },
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
