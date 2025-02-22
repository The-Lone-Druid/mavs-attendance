"use client";

import { Department, User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DepartmentUserListProps {
  department: Department & {
    users: Pick<User, "id" | "name" | "email" | "role" | "profilePicture">[];
  };
}

export function DepartmentUserList({ department }: DepartmentUserListProps) {
  return (
    <div className="space-y-3">
      {department.users.map((user) => (
        <div key={user.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user.profilePicture ?? undefined}
                alt={user.name}
              />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="line-clamp-1 text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {user.email}
              </p>
            </div>
          </div>
          <div className="text-xs font-medium">
            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              {user.role}
            </span>
          </div>
        </div>
      ))}
      {department.users.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No members yet
        </p>
      )}
    </div>
  );
}
