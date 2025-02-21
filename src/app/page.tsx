import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Welcome to MAVS Attendance</h1>
      
      {session ? (
        <div className="flex flex-col items-center gap-2">
          <p>Signed in as {session.user?.email}</p>
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      ) : (
        <Button asChild>
          <Link href="/auth/signin">Sign In</Link>
        </Button>
      )}
    </div>
  );
}
