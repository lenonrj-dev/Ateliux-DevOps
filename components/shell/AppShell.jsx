"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { ToastProvider } from "../providers/ToastProvider";
import { PreferencesProvider } from "../providers/PreferencesProvider";

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <ToastProvider>
      <PreferencesProvider>
        <div className="flex">
          <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
          <div className="flex-1 min-w-0">
            <Topbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
            <main className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">{children}</main>
          </div>
        </div>
      </PreferencesProvider>
    </ToastProvider>
  );
}
