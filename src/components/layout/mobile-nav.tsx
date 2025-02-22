"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "./sidebar-nav";
import { type AdminNavItem } from "@/types/nav";
import Link from "next/link";
import { SignOutButton } from "../auth/sign-out-button";

interface MobileNavProps {
  items: AdminNavItem[];
}

export function MobileNav({ items }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 flex items-center bg-background w-full lg:hidden p-4 border-b">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] p-0">
          <SheetHeader className="px-6 py-4">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <div className="flex h-full flex-col">
            <div className="flex h-[60px] items-center border-b px-6">
              <Link
                className="flex items-center gap-2 font-semibold"
                href="/"
                onClick={() => setOpen(false)}
              >
                <span>Attendance App</span>
              </Link>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-2">
              <SidebarNav items={items} onItemClick={() => setOpen(false)} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold lg:hidden">Attendance App</span>
        </div>
        <div className="flex items-center gap-2">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
