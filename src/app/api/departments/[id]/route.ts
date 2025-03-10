import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "Admin") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { name } = await req.json();
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    // Check for duplicate name
    const existing = await prisma.department.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
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
    console.error(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "Admin") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    await prisma.department.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
