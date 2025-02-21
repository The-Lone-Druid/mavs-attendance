import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { addHours } from "date-fns";
import { sendResetPasswordEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    console.log("Reset password request for:", email);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("User not found:", email);
      // Return success even if user not found for security
      return NextResponse.json({ success: true });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = addHours(new Date(), 1);

    // Save reset token
    const passwordReset = await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expires,
      },
    });

    console.log("Password reset token created:", passwordReset.id);

    // Send email
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password/${token}`;
    await sendResetPasswordEmail(email, resetUrl);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[RESET_PASSWORD_REQUEST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 