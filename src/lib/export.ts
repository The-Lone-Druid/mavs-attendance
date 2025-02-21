import { format } from "date-fns";
import * as XLSX from "xlsx";

export function exportToExcel(data: any[], filename: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function formatAttendanceForExport(attendance: any[]) {
  return attendance.map((record) => ({
    "Employee Name": record.user.name,
    "Employee Email": record.user.email,
    Date: format(new Date(record.checkInTime), "MMM d, yyyy"),
    "Check In": format(new Date(record.checkInTime), "hh:mm a"),
    "Check Out": record.checkOutTime
      ? format(new Date(record.checkOutTime), "hh:mm a")
      : "-",
    Status: record.status,
    "Late By (mins)": record.minutesLate || "-",
  }));
} 