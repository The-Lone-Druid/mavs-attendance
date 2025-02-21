"use client";

import React from "react";
import { MobileNav } from "./mobile-nav";
import { SidebarNav } from "./sidebar-nav";
import { adminNavItems } from "@/config/nav";
import Link from "next/link";

type Props = {
  isAdmin: boolean;
  children: React.ReactNode;
};

const MenuLayout = ({ isAdmin, children }: Props) => {
  const navItems = isAdmin ? adminNavItems : [];

  return (
    <div className={"flex flex-col lg:min-h-screen lg:flex-row lg:flex-1"}>
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-gray-100/40 lg:flex lg:w-64 lg:flex-col">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="/">
              <span>Attendance App</span>
            </Link>
          </div>
          <div className="flex-1 px-4 py-2">
            <SidebarNav items={navItems} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex w-full flex-1 flex-col">
        <MobileNav items={navItems} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default MenuLayout;
