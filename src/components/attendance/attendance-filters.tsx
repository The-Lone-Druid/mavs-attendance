"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, toDate } from "date-fns";
import { CalendarIcon } from "lucide-react";

export function AttendanceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");

  const [date, setDate] = useState<Date | undefined>(
    dateParam ? toDate(dateParam) : undefined
  );

  const status = searchParams.get("status") || "";

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("status", value);
    } else {
      params.delete("status");
    }
    router.push(`?${params.toString()}`);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setDate(date);
    const params = new URLSearchParams(searchParams);
    if (date) {
      params.set("date", format(date, "yyyy-MM-dd"));
    } else {
      params.delete("date");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Select value={status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value=" ">All Status</SelectItem>
          <SelectItem value="ON_TIME">On Time</SelectItem>
          <SelectItem value="LATE">Late</SelectItem>
          <SelectItem value="VERY_LATE">Very Late</SelectItem>
          <SelectItem value="LEFT_EARLY">Left Early</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[240px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {(status || date) && (
        <Button
          variant="ghost"
          onClick={() => {
            setDate(undefined);
            router.push("?");
          }}
        >
          Reset Filters
        </Button>
      )}
    </div>
  );
}
