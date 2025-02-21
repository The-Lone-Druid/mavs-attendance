"use client";

import {
  Users,
  Building2,
  Settings,
  ClipboardList,
  LayoutDashboard,
} from "lucide-react";
import { type AdminNavItem } from "@/types/nav";

export const adminNavItems: AdminNavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Departments",
    href: "/dashboard/departments",
    icon: Building2,
  },
  {
    title: "Attendance",
    href: "/dashboard/attendance",
    icon: ClipboardList,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]; 