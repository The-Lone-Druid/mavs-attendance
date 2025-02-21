"use client";

import React from "react";
import { MobileNav } from "./mobile-nav";
import { SidebarNav } from "./sidebar-nav";
import { adminNavItems } from "@/config/nav";

type Props = {
  isAdmin: boolean;
  children: React.ReactNode;
};

const MenuLayout = ({ isAdmin, children }: Props) => {
  const navItems = isAdmin ? adminNavItems : [];

  return (
    <>
      {/* Mobile Header */}
      <div className="flex items-center border-b p-4 lg:hidden">
        <MobileNav items={navItems} />
      </div>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 border-r bg-muted/10 p-4 lg:block">
          <SidebarNav items={navItems} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </>
  );
};

export default MenuLayout;
