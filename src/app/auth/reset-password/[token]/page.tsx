import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

interface ResetPasswordPageProps {
  params: {
    token: string;
  };
}

export default async function ResetPasswordPage({
  params,
}: ResetPasswordPageProps) {
  const { token } = params;

  // Verify token
  const resetRequest = await prisma.passwordReset.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetRequest || resetRequest.expires < new Date()) {
    redirect("/auth/reset-password/request?error=invalid-token");
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset your password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your new password below
          </p>
        </div>
        <ResetPasswordForm token={token} email={resetRequest.user.email} />
      </div>
    </div>
  );
}
