import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { DepartmentStats } from "@/components/dashboard/department-stats";
import { PageHeader } from "@/components/layout/page-header";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${session.user?.name}`}
      />

      <div className="mt-8 space-y-8">
        <DashboardStats />
        <div className="grid gap-4 md:grid-cols-2">
          <RecentActivity />
          <DepartmentStats />
        </div>
      </div>
    </div>
  );
}
