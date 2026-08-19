"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import ProfileCard from "./ProfileCard";
import AdmissionCard from "./AdmissionCard";
import ParentCard from "./ParentCard";
import FacultyCard from "./FacultyCard";

interface Student {
  student_id: number;
  user_id: number | null;
  campus_id: number;
  academic_year_id: number;
  admission_id: number | null;

  student_code: string;
  roll_number: string | null;

  first_name: string;
  last_name: string | null;

  date_of_birth: string | null;
  gender: string | null;
  student_type: string;

  phone: string | null;
  email: string | null;

  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;

  photo: string | null;
  blood_group: string | null;

  group_id: number | null;
  group_name: string | null;

  section_id: number | null;

  status: boolean;
}

interface Admission {
  admission_id: number;
  campus_id: number;
  academic_year_id: number;
  application_no: string;

  student_name: string;
  date_of_birth: string;

  gender: string | null;
  phone: string | null;
  email: string | null;

  previous_school: string | null;

  stream_id: number;
  group_id: number | null;

  application_date: string;
  admission_date: string | null;

  admission_status: string;
  documents_status: string | null;
}

interface Parent {
  parent_id: number;
  user_id: number | null;

  parent_code: string;

  father_name: string | null;
  mother_name: string | null;
  guardian_name: string | null;

  phone: string;
  alternate_phone: string | null;

  email: string | null;
  address: string | null;
  occupation: string | null;

  status: boolean;

  relationship: string;
  is_primary: boolean;
}

interface Faculty {
  faculty_id: number;
  user_id: number | null;

  campus_id: number;

  employee_code: string;

  first_name: string;
  last_name: string | null;

  phone: string | null;
  email: string | null;

  qualification: string | null;
  designation: string | null;

  joining_date: string | null;
  department: string | null;

  status: boolean;
}

interface DashboardData {
  student: Student;
  admission: Admission | null;
  parents: Parent[];
  faculty: Faculty[];
}

interface DashboardResponse {
  success: boolean;
  data: DashboardData;
}

interface StudentDashboardProps {
  studentId: number;
  onBack: () => void;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://127.0.0.1:8000";

export default function StudentDashboard({
  studentId,
  onBack,
}: StudentDashboardProps) {
  const [data, setData] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
   * Scroll to dashboard section
   */
  const scrollToSection = useCallback(
    (sectionId: string) => {
      setTimeout(() => {
        const element =
          document.getElementById(sectionId);

        if (!element) {
          return;
        }

        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    },
    []
  );

  /*
   * Fetch dashboard
   */
  const fetchDashboard = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/students/${studentId}/dashboard`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Unable to load student dashboard (${response.status})`
          );
        }

        const result: DashboardResponse =
          await response.json();

        if (!result.success) {
          throw new Error(
            "Dashboard API returned an unsuccessful response."
          );
        }

        setData(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load student dashboard."
        );
      } finally {
        setLoading(false);
      }
    },
    [studentId]
  );

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  /*
   * Sidebar hash navigation
   */
  useEffect(() => {
    const handleHashChange = () => {
      const sectionId =
        window.location.hash.replace("#", "");

      if (!sectionId) {
        return;
      }

      const validSections = [
        "profile",
        "overview",
        "admission",
        "parents",
        "faculty",
      ];

      if (
        validSections.includes(sectionId)
      ) {
        scrollToSection(sectionId);
      }
    };

    handleHashChange();

    window.addEventListener(
      "hashchange",
      handleHashChange
    );

    return () => {
      window.removeEventListener(
        "hashchange",
        handleHashChange
      );
    };
  }, [scrollToSection, data]);

  /*
   * Loading
   */
  if (loading) {
    return (
      <div className="space-y-5">

        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          ← Back to Students
        </button>

        <div className="h-64 animate-pulse rounded-2xl bg-white" />

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="h-80 animate-pulse rounded-2xl bg-white" />
          <div className="h-80 animate-pulse rounded-2xl bg-white" />
        </div>

      </div>
    );
  }

  /*
   * Error
   */
  if (error) {
    return (
      <div>

        <button
          type="button"
          onClick={onBack}
          className="mb-5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm"
        >
          ← Back to Students
        </button>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

          <h2 className="font-bold text-red-700">
            Unable to load student dashboard
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchDashboard}
            className="mt-5 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Retry
          </button>

        </div>

      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">

      {/* =====================================
          ACTIONS
          ===================================== */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <button
          type="button"
          onClick={onBack}
          className="w-fit rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          ← Back to Students
        </button>

        <button
          type="button"
          onClick={fetchDashboard}
          className="w-fit rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Refresh
        </button>

      </div>

      {/* =====================================
          STUDENT PROFILE
          ===================================== */}

      <section
        id="profile"
        className="scroll-mt-24"
      >
        <ProfileCard
          student={data.student}
        />
      </section>

      {/* =====================================
          STUDENT OVERVIEW
          ===================================== */}

      <section
        id="overview"
        className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >

        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Day Scholar
        </p>

        <h2 className="mt-1 text-lg font-bold text-slate-900">
          Student Overview
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl bg-green-50 p-5">

            <p className="text-xs font-bold uppercase text-green-600">
              Student Type
            </p>

            <p className="mt-2 text-lg font-bold text-green-800">
              {data.student.student_type === "DS"
                ? "Day Scholar"
                : data.student.student_type}
            </p>

          </div>

          <div className="rounded-xl bg-blue-50 p-5">

            <p className="text-xs font-bold uppercase text-blue-600">
              Course / Group
            </p>

            <p className="mt-2 text-lg font-bold text-blue-800">
              {data.student.group_name ||
                "Not Assigned"}
            </p>

          </div>

          <div className="rounded-xl bg-purple-50 p-5">

            <p className="text-xs font-bold uppercase text-purple-600">
              Parents
            </p>

            <p className="mt-2 text-lg font-bold text-purple-800">
              {data.parents.length}
            </p>

          </div>

          <div className="rounded-xl bg-orange-50 p-5">

            <p className="text-xs font-bold uppercase text-orange-600">
              Account Status
            </p>

            <p className="mt-2 text-lg font-bold text-orange-800">
              {data.student.status
                ? "Active"
                : "Inactive"}
            </p>

          </div>

        </div>

      </section>

      {/* =====================================
          ADMISSION
          ===================================== */}

      <section
        id="admission"
        className="scroll-mt-24"
      >
        <AdmissionCard
          admission={data.admission}
        />
      </section>

      {/* =====================================
          PARENTS
          ===================================== */}

      <section
        id="parents"
        className="scroll-mt-24"
      >
        <ParentCard
          parents={data.parents}
        />
      </section>

      {/* =====================================
          FACULTY
          ===================================== */}

      <section
        id="faculty"
        className="scroll-mt-24"
      >
        <FacultyCard
          faculty={data.faculty}
        />
      </section>

    </div>
  );
}