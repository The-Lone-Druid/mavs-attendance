import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    const resetRequest = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetRequest || resetRequest.expires < new Date()) {
      return new NextResponse("Invalid or expired token", { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    await prisma.user.update({
      where: { id: resetRequest.userId },
      data: { password: hashedPassword },
    });

    // Delete reset request
    await prisma.passwordReset.delete({
      where: { id: resetRequest.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[RESET_PASSWORD]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
