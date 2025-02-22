import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/profile/profile-form";
import { ProfilePicture } from "@/components/profile/profile-picture";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { department: true },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold md:text-3xl">Profile Settings</h1>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold">Profile Picture</h2>
          <div className="mt-4">
            <ProfilePicture user={user} />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Personal Information</h2>
          <div className="mt-4">
            <ProfileForm user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
