"use client";

import { useEffect, useMemo, useState } from "react";

interface Student {
  student_id: number;
  student_code: string;
  first_name: string;
  last_name: string | null;
  student_type: string;
}

interface StudentListResponse {
  success: boolean;
  count: number;
  data: Student[];
}

interface StudentListProps {
  onSelectStudent: (studentId: number) => void;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://127.0.0.1:8000";

export default function StudentList({
  onSelectStudent,
}: StudentListProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/students`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Unable to fetch students (${response.status})`
        );
      }

      const result: StudentListResponse =
        await response.json();

      if (!result.success) {
        throw new Error(
          "Student API returned an unsuccessful response."
        );
      }

      setStudents(result.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load students."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return students;
    }

    return students.filter((student) => {
      const fullName = [
        student.first_name,
        student.last_name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        fullName.includes(query) ||
        student.student_code
          .toLowerCase()
          .includes(query)
      );
    });
  }, [students, search]);

  if (loading) {
    return (
      <section className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Module 1
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Student Profile & Day Scholar Dashboard
          </h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-2xl bg-white"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">

      {/* Heading */}
      <div>
        <p className="text-sm font-semibold text-blue-600">
          Module 1
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Student Profile & Day Scholar Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Search and view day scholar student information.
        </p>
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

          <div className="flex-1">

            <label
              htmlFor="student-search"
              className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
            >
              Search Student
            </label>

            <input
              id="student-search"
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by student name or code..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

          </div>

          <div className="rounded-xl bg-blue-50 px-5 py-3">

            <p className="text-xs font-semibold text-blue-500">
              Total Students
            </p>

            <p className="mt-1 text-2xl font-bold text-blue-700">
              {students.length}
            </p>

          </div>

        </div>

      </div>

      {/* API Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">

          <p className="font-semibold text-red-700">
            Unable to load students
          </p>

          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchStudents}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Retry
          </button>

        </div>
      )}

      {/* Student List */}
      {!error && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

          {filteredStudents.map((student) => {

            const fullName = [
              student.first_name,
              student.last_name,
            ]
              .filter(Boolean)
              .join(" ");

            const initials =
              `${student.first_name?.charAt(0) ?? ""}${student.last_name?.charAt(0) ?? ""}`
                .toUpperCase();

            return (
              <button
                key={student.student_id}
                type="button"
                onClick={() =>
                  onSelectStudent(student.student_id)
                }
                className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
                    {initials || "ST"}
                  </div>

                  <div className="min-w-0 flex-1">

                    <h2 className="truncate font-bold text-slate-900 group-hover:text-blue-600">
                      {fullName}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {student.student_code}
                    </p>

                  </div>

                  <span className="text-xl text-slate-300 group-hover:text-blue-500">
                    →
                  </span>

                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                  <span className="text-xs font-semibold text-slate-500">
                    ID: {student.student_id}
                  </span>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-[10px] font-bold text-green-700">
                    {student.student_type === "DS"
                      ? "DAY SCHOLAR"
                      : student.student_type}
                  </span>

                </div>

              </button>
            );
          })}

        </div>
      )}

      {/* No Results */}
      {!error &&
        filteredStudents.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">

            <p className="font-semibold text-slate-700">
              No students found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Try another name or student code.
            </p>

          </div>
        )}

    </section>
  );
}