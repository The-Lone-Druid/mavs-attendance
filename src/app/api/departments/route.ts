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
    const { name } = body;

    const department = await prisma.department.create({
      data: { name },
    });

    return NextResponse.json(department);
  } catch (error) {
    console.error("[DEPARTMENTS_POST]", error);
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
    const { id, name } = body;

    const department = await prisma.department.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(department);
  } catch (error) {
    console.error("[DEPARTMENTS_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 