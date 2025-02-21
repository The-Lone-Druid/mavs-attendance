import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {session.user?.name}
            </p>
          </div>
          <SignOutButton />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Add your dashboard cards/content here */}
          <div className="rounded-lg border p-4">
            <h2 className="font-semibold">Today's Attendance</h2>
            {/* Add attendance stats */}
          </div>

          <div className="rounded-lg border p-4">
            <h2 className="font-semibold">Quick Actions</h2>
            {/* Add quick action buttons */}
          </div>

          <div className="rounded-lg border p-4">
            <h2 className="font-semibold">Recent Activity</h2>
            {/* Add activity list */}
          </div>
        </div>
      </div>
    </div>
  );
}
