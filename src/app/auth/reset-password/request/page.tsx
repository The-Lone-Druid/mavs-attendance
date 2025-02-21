import { ResetPasswordRequestForm } from "@/components/auth/reset-password-request-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordRequestPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[350px] space-y-8">
        <div className="space-y-2">
          <Link
            href="/auth/signin"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Link>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Reset your password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>
        <ResetPasswordRequestForm />
      </div>
    </div>
  );
}
