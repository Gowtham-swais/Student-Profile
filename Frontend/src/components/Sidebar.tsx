"use client";

import {
  LayoutDashboard,
  UserRound,
  FileText,
  UsersRound,
  GraduationCap,
  BookOpen,
  BarChart3,
  BrainCircuit,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Student Profile",
    icon: UserRound,
  },
  {
    label: "Admission Details",
    icon: FileText,
  },
  {
    label: "Parent / Guardian",
    icon: UsersRound,
  },
  {
    label: "Faculty Information",
    icon: GraduationCap,
  },
  {
    label: "Day Scholar",
    icon: BookOpen,
  },
  {
    label: "Progress Reports",
    icon: BarChart3,
  },
  {
    label: "AI Analysis",
    icon: BrainCircuit,
  },
];

export default function Sidebar({
  activeItem = "Dashboard",
  onItemClick,
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleItemClick = (item: string) => {
    onItemClick?.(item);
    setMobileOpen(false);
  };

  return (
    <>
      {/* =====================================================
          DESKTOP SIDEBAR
      ===================================================== */}

      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[230px] flex-col bg-[#020617] text-white md:flex">
        
        {/* =================================================
            DESKTOP BRAND
        ================================================= */}

        <div className="flex h-[88px] shrink-0 items-center border-b border-slate-800 px-4">
          
          {/* LOGO */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
            <img
              src="/swais-logo.jpeg"
              alt="SWAIS Logo"
              width={44}
              height={44}
              className="h-full w-full object-contain"
            />
          </div>

          {/* BRAND TEXT */}
          <div className="ml-3 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-400">
              SWAIS
            </p>

            <h1 className="truncate text-sm font-bold text-white">
              Demo Junior College
            </h1>
          </div>

        </div>

        {/* =================================================
            MODULE INFORMATION
        ================================================= */}

        <div className="shrink-0 px-4 pb-3 pt-5">
          
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-400">
            Module 1
          </p>

          <p className="mt-2 text-xs font-bold text-white">
            Student Profile
          </p>

          <p className="mt-1 text-[9px] leading-4 text-slate-400">
            Student Profile & Day Scholar Dashboard
          </p>

        </div>

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <nav className="min-h-0 flex-1 overflow-y-auto px-2.5 py-2">
          
          <div className="space-y-1">
            
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.label;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleItemClick(item.label)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      isActive
                        ? "bg-blue-500"
                        : "bg-slate-900"
                    }`}
                  >
                    <Icon size={16} />
                  </span>

                  <span className="truncate text-xs font-semibold">
                    {item.label}
                  </span>

                </button>
              );
            })}

          </div>

        </nav>

        {/* =================================================
            DESKTOP FOOTER
        ================================================= */}

        <div className="shrink-0 border-t border-slate-800 p-3">
          
          <div className="rounded-xl bg-slate-900 p-3">
            
            <p className="text-[9px] font-bold uppercase tracking-wider text-blue-400">
              Current Module
            </p>

            <p className="mt-2 text-xs font-bold text-white">
              Student Profile
            </p>

            <p className="mt-1 text-[9px] text-slate-400">
              Day Scholar Dashboard
            </p>

          </div>

        </div>

      </aside>

      {/* =====================================================
          MOBILE TOP HEADER
      ===================================================== */}

      <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-slate-800 bg-[#020617] px-3 text-white md:hidden">
        
        {/* MOBILE BRAND */}
        <div className="flex min-w-0 items-center gap-2">
          
          {/* MOBILE LOGO */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
            <img
              src="/swais-logo.jpeg"
              alt="SWAIS Logo"
              width={40}
              height={40}
              className="h-full w-full object-contain"
            />
          </div>

          {/* MOBILE BRAND TEXT */}
          <div className="min-w-0">
            
            <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-blue-400">
              SWAIS
            </p>

            <p className="truncate text-[11px] font-bold text-white">
              Demo Junior College
            </p>

          </div>

        </div>

        {/* HAMBURGER */}
        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 transition hover:bg-slate-700"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X size={19} />
          ) : (
            <Menu size={19} />
          )}
        </button>

      </header>

      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* =====================================================
          MOBILE DRAWER
      ===================================================== */}

      <aside
        className={`fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-[280px] overflow-y-auto bg-[#020617] p-4 text-white shadow-2xl transition-transform duration-300 md:hidden ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* =================================================
            MOBILE MODULE CARD
        ================================================= */}

        <div className="mb-5 rounded-xl border border-slate-800 bg-slate-900 p-4">
          
          <div className="flex items-center gap-3">

            {/* DRAWER LOGO */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
              <img
                src="/swais-logo.jpeg"
                alt="SWAIS Logo"
                width={40}
                height={40}
                className="h-full w-full object-contain"
              />
            </div>

            <div className="min-w-0">
              
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-400">
                Module 1
              </p>

              <p className="mt-1 truncate text-sm font-bold text-white">
                Student Profile
              </p>

            </div>

          </div>

          <p className="mt-3 text-[10px] leading-4 text-slate-400">
            Student Profile & Day Scholar Dashboard
          </p>

        </div>

        {/* =================================================
            MOBILE NAVIGATION
        ================================================= */}

        <nav>
          
          <div className="space-y-1">
            
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.label;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleItemClick(item.label)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-left transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >

                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      isActive
                        ? "bg-blue-500"
                        : "bg-slate-800"
                    }`}
                  >
                    <Icon size={17} />
                  </span>

                  <span className="text-sm font-semibold">
                    {item.label}
                  </span>

                </button>
              );
            })}

          </div>

        </nav>

        {/* =================================================
            MOBILE FOOTER
        ================================================= */}

        <div className="mt-6 border-t border-slate-800 pt-4">
          
          <div className="rounded-xl bg-slate-900 p-4">
            
            <p className="text-[9px] font-bold uppercase tracking-wider text-blue-400">
              Current Module
            </p>

            <p className="mt-2 text-sm font-bold text-white">
              Student Profile
            </p>

            <p className="mt-1 text-[10px] text-slate-400">
              Day Scholar Dashboard
            </p>

          </div>

        </div>

      </aside>

      {/* =====================================================
          MOBILE BOTTOM NAVIGATION
      ===================================================== */}

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-[#020617] md:hidden">
        
        <div className="flex h-[68px] w-full items-center">
          
          {menuItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.label;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleItemClick(item.label)}
                className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 transition ${
                  isActive
                    ? "text-blue-400"
                    : "text-slate-500"
                }`}
              >
                
                <Icon size={17} />

                <span className="w-full truncate text-center text-[8px] font-semibold">
                  {item.label}
                </span>

              </button>
            );
          })}

        </div>

      </div>
    </>
  );
}