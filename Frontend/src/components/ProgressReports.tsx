"use client";

import { useEffect, useState } from "react";

interface ProgressReportsProps {
  studentId: number | null;
}

interface Result {
  result_id: number;
  exam_id: number;
  exam_name: string | null;
  exam_type: string | null;
  start_date: string | null;
  end_date: string | null;
  total_marks: number;
  marks_obtained: number;
  percentage: number;
  grade: string | null;
  result_status: string;
  rank: number | null;
  remarks: string | null;
}

interface Mark {
  marks_id: number;
  exam_subject_id: number;
  exam_id: number;
  exam_name: string | null;
  exam_type: string | null;
  exam_date: string | null;
  subject_id: number;
  subject_code: string;
  subject_name: string;
  subject_type: string | null;
  subject_max_marks: number | null;
  pass_marks: number | null;
  marks_obtained: number | null;
  grade: string | null;
  remarks: string | null;
}

interface ProgressData {
  student: {
    student_id: number;
    student_code: string;
    first_name: string;
    last_name: string | null;
    group_id: number | null;
    group_name: string | null;
  };

  results: Result[];

  marks: Mark[];

  attendance: {
    attendance_records: number;
  };
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://127.0.0.1:8000";

export default function ProgressReports({
  studentId,
}: ProgressReportsProps) {
  const [data, setData] =
    useState<ProgressData | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (studentId === null) {
      setData(null);
      return;
    }

    async function loadProgress() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/students/${studentId}/progress`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Unable to load progress (${response.status})`
          );
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(
            "Progress API returned an unsuccessful response."
          );
        }

        setData(result.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load progress."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, [studentId]);

  if (studentId === null) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Academic Performance
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Progress Reports
        </h2>

        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
          <p className="font-semibold text-slate-700">
            Select a student first
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Open Dashboard and select a student to view their
            progress report.
          </p>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-32 animate-pulse rounded-2xl bg-white" />
        <div className="h-64 animate-pulse rounded-2xl bg-white" />
        <div className="h-80 animate-pulse rounded-2xl bg-white" />
      </div>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-bold text-red-700">
          Unable to load Progress Reports
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      </section>
    );
  }

  if (!data) {
    return null;
  }

  const studentName = [
    data.student.first_name,
    data.student.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-5">

      {/* Student Header */}
      <section className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Academic Performance
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Progress Reports
        </h2>

        <div className="mt-4 flex flex-wrap gap-3">
          <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
            {studentName}
          </span>

          <span className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
            {data.student.student_code}
          </span>

          <span className="rounded-lg bg-purple-50 px-3 py-2 text-sm font-semibold text-purple-700">
            {data.student.group_name || "Group Not Assigned"}
          </span>
        </div>
      </section>

      {/* Overall Results */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h3 className="text-lg font-bold text-slate-900">
          Examination Results
        </h3>

        {data.results.length === 0 ? (
          <div className="mt-5 rounded-xl bg-slate-50 p-8 text-center">
            <p className="font-semibold text-slate-600">
              No examination results available.
            </p>
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                  <th className="px-4 py-3">Exam</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Obtained</th>
                  <th className="px-4 py-3">Percentage</th>
                  <th className="px-4 py-3">Grade</th>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {data.results.map((result) => (
                  <tr
                    key={result.result_id}
                    className="border-b border-slate-100"
                  >
                    <td className="px-4 py-4 font-semibold text-slate-900">
                      {result.exam_name || "Exam"}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {result.exam_type || "-"}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {result.total_marks}
                    </td>

                    <td className="px-4 py-4 font-semibold text-slate-900">
                      {result.marks_obtained}
                    </td>

                    <td className="px-4 py-4 font-bold text-blue-700">
                      {result.percentage}%
                    </td>

                    <td className="px-4 py-4 font-bold">
                      {result.grade || "-"}
                    </td>

                    <td className="px-4 py-4">
                      {result.rank ?? "-"}
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                        {result.result_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Subject Marks */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h3 className="text-lg font-bold text-slate-900">
          Subject-wise Performance
        </h3>

        {data.marks.length === 0 ? (
          <div className="mt-5 rounded-xl bg-slate-50 p-8 text-center">
            <p className="font-semibold text-slate-600">
              No subject marks available.
            </p>
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                  <th className="px-4 py-3">Exam</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Maximum</th>
                  <th className="px-4 py-3">Obtained</th>
                  <th className="px-4 py-3">Grade</th>
                  <th className="px-4 py-3">Remarks</th>
                </tr>
              </thead>

              <tbody>
                {data.marks.map((mark) => (
                  <tr
                    key={mark.marks_id}
                    className="border-b border-slate-100"
                  >
                    <td className="px-4 py-4 font-semibold text-slate-700">
                      {mark.exam_name || "-"}
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-bold text-slate-900">
                        {mark.subject_name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {mark.subject_code}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      {mark.subject_max_marks ?? "-"}
                    </td>

                    <td className="px-4 py-4 font-bold text-blue-700">
                      {mark.marks_obtained ?? "-"}
                    </td>

                    <td className="px-4 py-4 font-bold">
                      {mark.grade || "-"}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {mark.remarks || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Attendance */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <h3 className="text-lg font-bold text-slate-900">
          Attendance Records
        </h3>

        <div className="mt-5 rounded-xl bg-blue-50 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Attendance Records
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-900">
            {data.attendance.attendance_records}
          </p>

          <p className="mt-1 text-sm text-blue-700">
            Attendance records available for this student
          </p>
        </div>

      </section>

    </div>
  );
}