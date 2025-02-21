import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "Admin") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { name } = await req.json();
    const id = parseInt(params.id);

    // Check for duplicate name
    const existing = await prisma.department.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        NOT: { id },
      },
    });

    if (existing) {
      return new NextResponse("Department already exists", { status: 400 });
    }

    const department = await prisma.department.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(department);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "Admin") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const id = parseInt(params.id);

    await prisma.department.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
} 