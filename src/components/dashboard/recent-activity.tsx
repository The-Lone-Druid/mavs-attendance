"use client";

import { AttendanceStatusBadge } from "@/components/attendance/attendance-status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Attendance, User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export function RecentActivity() {
  const { data: activities, isLoading } = useQuery<
    (Attendance & { user: User })[]
  >({
    queryKey: ["recentActivity"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/activity");
      if (!response.ok) throw new Error("Failed to fetch activities");
      return response.json();
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest attendance records</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {activities?.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={activity.user.profilePicture ?? undefined}
                      alt={activity.user.name}
                    />
                    <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{activity.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(activity.checkInTime), "MMM d, h:mm a")}
                    </p>
                  </div>
                </div>
                <AttendanceStatusBadge status={activity.status} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
