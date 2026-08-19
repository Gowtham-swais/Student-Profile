"use client";

import { useState } from "react";

import Sidebar from "../components/Sidebar";
import StudentList from "../components/StudentList";
import StudentDashboard from "../components/StudentDashboard";
import ProgressReports from "../components/ProgressReports";
import AIAnalysis from "../components/AIAnalysis";

export default function Home() {
  // ============================================================
  // STATE
  // ============================================================

  const [selectedStudentId, setSelectedStudentId] =
    useState<number | null>(null);

  const [activeItem, setActiveItem] =
    useState("Dashboard");

  // ============================================================
  // SIDEBAR CLICK
  // ============================================================

  const handleSidebarClick = (item: string) => {
    // ----------------------------------------------------------
    // Dashboard
    // ----------------------------------------------------------

    if (item === "Dashboard") {
      setActiveItem("Dashboard");
      setSelectedStudentId(null);

      window.history.replaceState(
        null,
        "",
        window.location.pathname
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    // ----------------------------------------------------------
    // If no student is selected
    // ----------------------------------------------------------

    if (selectedStudentId === null) {
      setActiveItem("Dashboard");
      return;
    }

    // ----------------------------------------------------------
    // Student Profile
    // ----------------------------------------------------------

    if (item === "Student Profile") {
      setActiveItem("Student Profile");

      window.history.replaceState(
        null,
        "",
        window.location.pathname
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    // ----------------------------------------------------------
    // Progress Reports
    // ----------------------------------------------------------

    if (item === "Progress Reports") {
      setActiveItem("Progress Reports");

      window.history.replaceState(
        null,
        "",
        window.location.pathname
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    // ----------------------------------------------------------
    // AI Analysis
    // ----------------------------------------------------------

    if (item === "AI Analysis") {
      setActiveItem("AI Analysis");

      window.history.replaceState(
        null,
        "",
        window.location.pathname
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    // ----------------------------------------------------------
    // Module 1 sections
    // ----------------------------------------------------------

    const sectionMap: Record<string, string> = {
      "Admission Details": "admission",
      "Parent / Guardian": "parents",
      "Faculty Information": "faculty",
      "Day Scholar": "overview",
    };

    const sectionId = sectionMap[item];

    if (sectionId) {
      setActiveItem(item);

      window.location.hash = sectionId;

      return;
    }
  };

  // ============================================================
  // STUDENT SELECT
  // ============================================================

  const handleStudentSelect = (
    studentId: number
  ) => {
    setSelectedStudentId(studentId);

    setActiveItem("Student Profile");

    window.history.replaceState(
      null,
      "",
      window.location.pathname
    );

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  };

  // ============================================================
  // BACK TO STUDENTS
  // ============================================================

  const handleBackToStudents = () => {
    setSelectedStudentId(null);

    setActiveItem("Dashboard");

    window.history.replaceState(
      null,
      "",
      window.location.pathname
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ============================================================
  // RENDER CONTENT
  // ============================================================

  const renderContent = () => {
    // ----------------------------------------------------------
    // No student selected
    // ----------------------------------------------------------

    if (selectedStudentId === null) {
      return (
        <StudentList
          onSelectStudent={handleStudentSelect}
        />
      );
    }

    // ----------------------------------------------------------
    // Progress Reports
    // ----------------------------------------------------------

    if (activeItem === "Progress Reports") {
      return (
        <ProgressReports
          studentId={selectedStudentId}
        />
      );
    }

    // ----------------------------------------------------------
    // AI Analysis
    // ----------------------------------------------------------

    if (activeItem === "AI Analysis") {
      return (
        <AIAnalysis
          studentId={selectedStudentId}
        />
      );
    }

    // ----------------------------------------------------------
    // Student Profile / Module 1 sections
    // ----------------------------------------------------------

    return (
      <StudentDashboard
        studentId={selectedStudentId}
        onBack={handleBackToStudents}
      />
    );
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-100">

      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <Sidebar
        activeItem={activeItem}
        onItemClick={handleSidebarClick}
      />

      {/* ======================================================
          MAIN AREA

          Mobile:
          - No left margin
          - Top spacing for mobile header
          - Bottom spacing for mobile navigation

          Desktop:
          - 230px left margin
          - No mobile spacing
      ====================================================== */}

      <div
        className="
          min-h-screen
          w-full
          overflow-x-hidden
          pt-16
          pb-[76px]

          md:ml-[230px]
          md:w-[calc(100%-230px)]
          md:pt-0
          md:pb-0
        "
      >

        {/* ====================================================
            DESKTOP HEADER
        ==================================================== */}

        <header
          className="
            sticky
            top-0
            z-30
            hidden
            h-16
            border-b
            border-slate-200
            bg-white
            md:block
          "
        >
          <div className="flex h-full items-center justify-between px-5 lg:px-6">

            {/* College Information */}

            <div className="min-w-0">

              <h1 className="truncate text-lg font-bold text-slate-900">
                SWAIS Demo Junior College
              </h1>

              <p className="text-xs text-slate-500">
                Student Profile & Day Scholar Dashboard
              </p>

            </div>

            {/* Module Badge */}

            <div className="shrink-0 rounded-lg bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
              Module 1
            </div>

          </div>
        </header>

        {/* ====================================================
            MOBILE PAGE HEADER
        ==================================================== */}

        <div
          className="
            border-b
            border-slate-200
            bg-white
            px-3
            py-3
            md:hidden
          "
        >
          <div className="flex min-w-0 items-center justify-between gap-3">

            <div className="min-w-0">

              <h1 className="truncate text-sm font-bold text-slate-900">
                {activeItem}
              </h1>

              <p className="mt-0.5 truncate text-[10px] text-slate-500">
                Student Profile & Day Scholar Dashboard
              </p>

            </div>

            <div className="shrink-0 rounded-md bg-blue-50 px-2.5 py-1.5 text-[10px] font-bold text-blue-700">
              Module 1
            </div>

          </div>
        </div>

        {/* ====================================================
            PAGE CONTENT
        ==================================================== */}

        <main
          className="
            w-full
            min-w-0
            px-3
            py-4

            sm:px-5
            sm:py-5

            lg:px-6
            lg:py-6
          "
        >
          <div className="w-full min-w-0 max-w-full">
            {renderContent()}
          </div>
        </main>

      </div>

    </div>
  );
}