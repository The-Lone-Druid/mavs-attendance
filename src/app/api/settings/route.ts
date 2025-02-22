import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "Admin") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();
    const settings = await prisma.settings.create({ data: body });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("[SETTINGS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "Admin") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();
    const settings = await prisma.settings.update({
      where: { id: 1 }, // Assuming single settings record
      data: body,
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("[SETTINGS_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
