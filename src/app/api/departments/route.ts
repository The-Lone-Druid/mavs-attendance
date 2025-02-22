import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      include: {
        _count: { select: { users: true } },
      },
    });
    return NextResponse.json(departments);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "Admin") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { name } = await req.json();

    // Check for duplicate name
    const existing = await prisma.department.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });

    if (existing) {
      return new NextResponse("Department already exists", { status: 400 });
    }

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
