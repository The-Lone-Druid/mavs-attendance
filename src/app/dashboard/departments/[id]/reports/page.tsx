import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DepartmentAttendanceReport } from "@/components/departments/department-attendance-report";
import { PageHeader } from "@/components/layout/page-header";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function DepartmentReportsPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  const resolvedParams = await params;

  if (!session || !["Admin", "Manager"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  const department = await prisma.department.findUnique({
    where: { id: parseInt(resolvedParams.id) },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!department) {
    redirect("/dashboard/departments");
  }

  return (
    <div className="p-4 md:p-8">
      <PageHeader title={department.name} description="Attendance Reports" />
      <div className="mt-8">
        <DepartmentAttendanceReport department={department} />
      </div>
    </div>
  );
}
