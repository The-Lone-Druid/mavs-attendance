import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AttendanceSettingsForm } from "@/components/settings/attendance-settings-form";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "Admin") {
    redirect("/dashboard");
  }

  const settings = await prisma.settings.findFirst();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <div className="mt-8 max-w-2xl">
        <AttendanceSettingsForm initialData={settings} />
      </div>
    </div>
  );
}
