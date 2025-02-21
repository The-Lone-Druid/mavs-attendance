import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AttendanceStatusBadgeProps {
  status: string;
}

export function AttendanceStatusBadge({ status }: AttendanceStatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ON_TIME":
        return "bg-green-500/15 text-green-700 hover:bg-green-500/25";
      case "LATE":
        return "bg-yellow-500/15 text-yellow-700 hover:bg-yellow-500/25";
      case "VERY_LATE":
        return "bg-red-500/15 text-red-700 hover:bg-red-500/25";
      case "LEFT_EARLY":
        return "bg-orange-500/15 text-orange-700 hover:bg-orange-500/25";
      default:
        return "bg-gray-500/15 text-gray-700 hover:bg-gray-500/25";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ON_TIME":
        return "On Time";
      case "LATE":
        return "Late";
      case "VERY_LATE":
        return "Very Late";
      case "LEFT_EARLY":
        return "Left Early";
      default:
        return status;
    }
  };

  return (
    <Badge
      variant="secondary"
      className={cn("font-medium", getStatusColor(status))}
    >
      {getStatusText(status)}
    </Badge>
  );
}
