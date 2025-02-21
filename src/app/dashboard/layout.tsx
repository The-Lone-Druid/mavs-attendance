import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { adminNavItems } from "@/config/nav";
import MenuLayout from "@/components/layout/menu-layout";

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

  console.log(adminNavItems);

  return (
    <div className="flex min-h-screen flex-col">
      <MenuLayout isAdmin={isAdmin}>{children}</MenuLayout>
    </div>
  );
}
