"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useCamera } from "@/hooks/use-camera";
import { toast } from "sonner";
import { Attendance, Settings } from "@prisma/client";

interface CheckInOutButtonProps {
  currentAttendance: Attendance | undefined;
  settings: Settings | null;
}

export function CheckInOutButton({
  currentAttendance,
  settings,
}: CheckInOutButtonProps) {
  const [loading, setLoading] = useState(false);
  const { getLocation } = useGeolocation();
  const { takeSelfie } = useCamera();

  const handleCheckInOut = async () => {
    try {
      setLoading(true);

      // Get location
      let location;
      try {
        location = await getLocation();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to get location"
        );
        return;
      }

      // Take selfie
      const selfie = await takeSelfie();
      if (!selfie) {
        toast.error("Please allow camera access to take a selfie");
        return;
      }

      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: `${location.latitude},${location.longitude}`,
          selfie,
          type: currentAttendance?.checkOutTime ? "checkin" : "checkout",
        }),
      });

      if (!response.ok) throw new Error("Failed to record attendance");

      toast.success(
        currentAttendance?.checkOutTime
          ? "Checked in successfully"
          : "Checked out successfully"
      );

      // Refresh the page to show updated attendance
      window.location.reload();
    } catch (error) {
      console.error("Failed to record attendance", error);
      toast.error("Failed to record attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleCheckInOut} disabled={loading}>
      {currentAttendance?.checkOutTime ? "Check In" : "Check Out"}
    </Button>
  );
}
