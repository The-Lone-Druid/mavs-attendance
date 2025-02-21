import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DepartmentList } from "@/components/departments/department-list";
import { CreateDepartmentDialog } from "@/components/departments/create-department-dialog";
import { PageHeader } from "@/components/layout/page-header";

export default async function DepartmentsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "Admin") {
    redirect("/dashboard");
  }

  const departments = await prisma.department.findMany({
    include: {
      _count: {
        select: { users: true },
      },
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          profilePicture: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="p-4 md:p-8">
      <PageHeader title="Departments">
        <CreateDepartmentDialog />
      </PageHeader>
      <div className="mt-8">
        <DepartmentList departments={departments} />
      </div>
    </div>
  );
}
