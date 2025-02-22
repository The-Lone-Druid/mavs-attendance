import { Settings } from "@prisma/client";
import {
  parse,
  isWithinInterval,
  addMinutes,
  set,
  differenceInMinutes,
} from "date-fns";

export type AttendanceStatus = "ON_TIME" | "LATE" | "VERY_LATE" | "LEFT_EARLY";

interface TimeValidationResult {
  isValid: boolean;
  message?: string;
  status?: AttendanceStatus;
  minutesLate?: number;
}

export function validateCheckInTime(
  currentTime: Date,
  settings: Settings
): TimeValidationResult {
  const today = new Date();
  const checkInStart = parse(settings.checkInStart, "HH:mm", today);
  const checkInEnd = parse(settings.checkInEnd, "HH:mm", today);
  const graceEndTime = addMinutes(checkInStart, settings.gracePeriod);
  const veryLateThreshold = settings.gracePeriod * 2; // Double grace period for "very late"

  const timeToCheck = set(new Date(), {
    hours: currentTime.getHours(),
    minutes: currentTime.getMinutes(),
    seconds: 0,
    milliseconds: 0,
  });

  // Check if within allowed window
  const isWithinWindow = isWithinInterval(timeToCheck, {
    start: checkInStart,
    end: checkInEnd,
  });

  if (!isWithinWindow) {
    return {
      isValid: false,
      message: `Check-in is only allowed between ${settings.checkInStart} and ${settings.checkInEnd}`,
    };
  }

  // Calculate minutes late
  const minutesLate = differenceInMinutes(timeToCheck, checkInStart);
  let status: AttendanceStatus = "ON_TIME";
  let message: string | undefined;

  if (minutesLate > 0) {
    if (timeToCheck <= graceEndTime) {
      status = "ON_TIME";
    } else if (minutesLate <= veryLateThreshold) {
      status = "LATE";
      message = `You are ${minutesLate} minutes late`;
    } else {
      status = "VERY_LATE";
      message = `You are ${minutesLate} minutes late - this is considered very late`;
    }
  }

  return {
    isValid: true,
    status,
    minutesLate: minutesLate > 0 ? minutesLate : 0,
    message,
  };
}

export function validateCheckOutTime(
  currentTime: Date,
  settings: Settings
): TimeValidationResult {
  const today = new Date();
  const checkOutStart = parse(settings.checkOutStart, "HH:mm", today);
  const checkOutEnd = parse(settings.checkOutEnd, "HH:mm", today);

  const timeToCheck = set(new Date(), {
    hours: currentTime.getHours(),
    minutes: currentTime.getMinutes(),
    seconds: 0,
    milliseconds: 0,
  });

  const isWithinWindow = isWithinInterval(timeToCheck, {
    start: checkOutStart,
    end: checkOutEnd,
  });

  if (!isWithinWindow) {
    if (timeToCheck < checkOutStart) {
      return {
        isValid: true,
        status: "LEFT_EARLY",
        message: "You are leaving earlier than the standard check-out time",
      };
    }

    return {
      isValid: false,
      message: `Check-out is only allowed between ${settings.checkOutStart} and ${settings.checkOutEnd}`,
    };
  }

  return {
    isValid: true,
    status: "ON_TIME",
  };
}
