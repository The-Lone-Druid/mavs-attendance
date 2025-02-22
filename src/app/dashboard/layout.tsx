import MenuLayout from "@/components/layout/menu-layout";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const isAdmin = session.user.role === "Admin";

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <MenuLayout isAdmin={isAdmin}>{children}</MenuLayout>
    </div>
  );
}
