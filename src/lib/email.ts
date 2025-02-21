import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetPasswordEmail(email: string, resetUrl: string) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set");
    }

    console.log("Sending reset password email to:", email);
    console.log("Reset URL:", resetUrl);

    const data = await resend.emails.send({
      from: "Attendance App <noreply@zahidshaikh.space>",
      to: email,
      subject: "Reset your password",
      html: `
        <h2>Reset Your Password</h2>
        <p>You requested to reset your password. Click the link below:</p>
        <a href="${resetUrl}" style="padding: 10px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p>Or copy this link: ${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    console.log("Email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Failed to send reset password email:", error);
    throw error;
  }
}

export async function sendInvitationEmail(email: string, inviteUrl: string) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set");
    }

    console.log("Sending invitation email to:", email);
    console.log("Invite URL:", inviteUrl);

    const data = await resend.emails.send({
      from: "Attendance App <noreply@zahidshaikh.space>",
      to: email,
      subject: "You've been invited to join Attendance App",
      html: `
        <h2>Welcome to Attendance App!</h2>
        <p>You've been invited to join the team. Click the link below to set up your account:</p>
        <a href="${inviteUrl}" style="padding: 10px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">
          Accept Invitation
        </a>
        <p>Or copy this link: ${inviteUrl}</p>
        <p>This invitation link will expire in 24 hours.</p>
        <p>If you weren't expecting this invitation, you can ignore this email.</p>
      `,
    });

    console.log("Email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Failed to send invitation email:", error);
    throw error;
  }
}
