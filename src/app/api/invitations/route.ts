import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { addDays } from "date-fns";
import bcrypt from "bcryptjs";
import { sendInvitationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !["Admin", "Manager"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();
    const { email, role, departmentId } = body;

    // Generate temporary password
    const token = crypto.randomBytes(32).toString("hex");
    const expires = addDays(new Date(), 1);
    const tempPassword = await bcrypt.hash(token.slice(0, 8), 10);

    const invitation = await prisma.invitation.create({
      data: {
        email,
        token,
        expiresAt: expires,
        user: {
          create: {
            email,
            name: email.split("@")[0],
            role,
            departmentId: departmentId ? parseInt(departmentId) : null,
            password: tempPassword,
          },
        },
      },
    });

    const inviteUrl = `${process.env.NEXTAUTH_URL}/auth/signup?token=${token}`;
    await sendInvitationEmail(email, inviteUrl);

    return NextResponse.json(invitation);
  } catch (error) {
    console.error("[INVITATIONS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
