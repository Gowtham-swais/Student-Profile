"use client";

import { useEffect, useState } from "react";

interface AIAnalysisProps {
  studentId: number;
}

interface AIInsight {
  insight_id: number;
  insight_type: string;
  title: string;
  description: string;
  recommendation?: string | null;
  confidence_score?: number | null;
  generated_by?: string | null;
  created_at?: string;
}

interface AIData {
  student: {
    student_id: number;
    student_code: string;
    first_name: string;
    last_name: string;
    group_name?: string | null;
  };

  insights?: AIInsight[];

  performance?: {
    exam_count?: number | null;
    average_percentage?: number | null;
    highest_percentage?: number | null;
    lowest_percentage?: number | null;
    passed_exams?: number | null;
    failed_exams?: number | null;
  };

  // Supports your older frontend response too
  summary?: {
    overall_percentage?: number | null;
    average_percentage?: number | null;
    highest_percentage?: number | null;
    lowest_percentage?: number | null;
    passed_exams?: number | null;
    failed_exams?: number | null;
    exam_count?: number | null;
  };
}

interface AIResponse {
  success: boolean;
  data: AIData;
}

export default function AIAnalysis({
  studentId,
}: AIAnalysisProps) {
  const [data, setData] = useState<AIData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadAIAnalysis() {
      try {
        setLoading(true);
        setError("");

        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "http://127.0.0.1:8000";

        const response = await fetch(
          `${baseUrl}/api/students/${studentId}/ai-analysis`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `AI Analysis API failed: ${response.status}`
          );
        }

        const json: AIResponse = await response.json();

        if (!json.success || !json.data) {
          throw new Error(
            "Invalid AI Analysis response"
          );
        }

        if (mounted) {
          setData(json.data);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load AI analysis"
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAIAnalysis();

    return () => {
      mounted = false;
    };
  }, [studentId]);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded-lg bg-purple-100" />

          <div>
            <p className="text-sm font-bold text-slate-700">
              Loading AI analysis...
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Analysing academic performance
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">

        <div className="rounded-xl bg-red-50 p-5">

          <p className="text-sm font-bold text-red-700">
            Unable to load AI analysis
          </p>

          <p className="mt-2 text-xs text-red-500">
            {error}
          </p>

        </div>

      </section>
    );
  }

  if (!data) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          No AI analysis data available.
        </p>
      </section>
    );
  }

  // ============================================================
  // SUPPORT BOTH RESPONSE FORMATS
  // ============================================================

  const performance = data.performance || {};

  const summary = data.summary || {};

  const averagePercentage =
    performance.average_percentage ??
    summary.overall_percentage ??
    summary.average_percentage ??
    null;

  const highestPercentage =
    performance.highest_percentage ??
    summary.highest_percentage ??
    null;

  const lowestPercentage =
    performance.lowest_percentage ??
    summary.lowest_percentage ??
    null;

  const passedExams =
    performance.passed_exams ??
    summary.passed_exams ??
    0;

  const failedExams =
    performance.failed_exams ??
    summary.failed_exams ??
    0;

  const examCount =
    performance.exam_count ??
    summary.exam_count ??
    0;

  const insights = data.insights || [];

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <section className="space-y-6">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div>

        <p className="text-xs font-bold uppercase tracking-[0.16em] text-purple-600">
          Artificial Intelligence
        </p>

        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          AI Analysis
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          AI-powered analysis of{" "}
          <span className="font-semibold text-slate-700">
            {data.student.first_name}{" "}
            {data.student.last_name}
          </span>
          {" "}academic performance.
        </p>

      </div>

      {/* ======================================================
          STUDENT INFO
      ====================================================== */}

      <div className="rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 to-blue-50 p-5">

        <div className="flex flex-wrap items-center justify-between gap-4">

          <div>

            <p className="text-xs font-bold uppercase tracking-wider text-purple-500">
              Student
            </p>

            <h3 className="mt-1 text-lg font-bold text-slate-900">
              {data.student.first_name}{" "}
              {data.student.last_name}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {data.student.student_code}

              {data.student.group_name && (
                <>
                  {" • "}
                  {data.student.group_name}
                </>
              )}
            </p>

          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-lg font-bold text-white shadow-lg">
            AI
          </div>

        </div>

      </div>

      {/* ======================================================
          PERFORMANCE SUMMARY
      ====================================================== */}

      <div>

        <div className="mb-4">

          <h3 className="text-lg font-bold text-slate-900">
            Performance Summary
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            AI-generated academic performance indicators
          </p>

        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Overall */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Overall Performance
            </p>

            <p className="mt-3 text-4xl font-bold text-slate-900">
              {averagePercentage !== null
                ? `${Number(
                    averagePercentage
                  ).toFixed(2)}%`
                : "--"}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Average academic score
            </p>

          </div>

          {/* Highest */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Highest Score
            </p>

            <p className="mt-3 text-4xl font-bold text-emerald-600">
              {highestPercentage !== null
                ? `${Number(
                    highestPercentage
                  ).toFixed(2)}%`
                : "--"}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Best examination performance
            </p>

          </div>

          {/* Passed */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Passed Exams
            </p>

            <p className="mt-3 text-4xl font-bold text-blue-600">
              {passedExams}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Successful examinations
            </p>

          </div>

          {/* Exams */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Exams
            </p>

            <p className="mt-3 text-4xl font-bold text-purple-600">
              {examCount}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Examinations analysed
            </p>

          </div>

        </div>

      </div>

      {/* ======================================================
          ADDITIONAL METRICS
      ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Lowest Score
              </p>

              <p className="mt-2 text-2xl font-bold text-orange-600">
                {lowestPercentage !== null
                  ? `${Number(
                      lowestPercentage
                    ).toFixed(2)}%`
                  : "--"}
              </p>

            </div>

            <div className="rounded-xl bg-orange-50 px-4 py-3 text-xs font-bold text-orange-600">
              Improvement Area
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Failed Exams
              </p>

              <p className="mt-2 text-2xl font-bold text-red-600">
                {failedExams}
              </p>

            </div>

            <div className="rounded-xl bg-red-50 px-4 py-3 text-xs font-bold text-red-600">
              Attention
            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          AI INSIGHTS
      ====================================================== */}

      <div className="rounded-2xl border border-purple-200 bg-white p-6 shadow-sm">

        <div className="mb-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-sm font-bold text-white">
              AI
            </div>

            <div>

              <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
                SWAIS AI
              </p>

              <h3 className="text-lg font-bold text-slate-900">
                Academic Insights
              </h3>

            </div>

          </div>

        </div>

        {insights.length === 0 ? (

          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">

            <p className="text-sm font-semibold text-slate-600">
              No AI insights available.
            </p>

            <p className="mt-2 text-xs text-slate-400">
              AI insights will appear when academic
              analysis is available for this student.
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {insights.map((insight) => (

              <div
                key={insight.insight_id}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >

                {/* Insight header */}

                <div className="flex flex-wrap items-start justify-between gap-4">

                  <div className="min-w-0">

                    <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-700">
                      {insight.insight_type}
                    </span>

                    <h4 className="mt-3 text-base font-bold text-slate-900">
                      {insight.title}
                    </h4>

                  </div>

                  {insight.confidence_score !== null &&
                    insight.confidence_score !== undefined && (

                      <div className="shrink-0 rounded-xl bg-blue-50 px-4 py-2 text-center">

                        <p className="text-[9px] font-bold uppercase tracking-wider text-blue-500">
                          Confidence
                        </p>

                        <p className="mt-1 text-sm font-bold text-blue-700">
                          {Number(
                            insight.confidence_score
                          ) <= 1
                            ? (
                                Number(
                                  insight.confidence_score
                                ) * 100
                              ).toFixed(0)
                            : Number(
                                insight.confidence_score
                              ).toFixed(0)}
                          %
                        </p>

                      </div>

                    )}

                </div>

                {/* Description */}

                <div className="mt-5">

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    AI Assessment
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {insight.description}
                  </p>

                </div>

                {/* Recommendation */}

                {insight.recommendation && (

                  <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4">

                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                      AI Recommendation
                    </p>

                    <p className="mt-2 text-sm leading-6 text-emerald-800">
                      {insight.recommendation}
                    </p>

                  </div>

                )}

                {/* Generated By */}

                {insight.generated_by && (

                  <div className="mt-4 flex justify-end">

                    <p className="text-[10px] font-semibold text-slate-400">
                      Generated by:{" "}
                      {insight.generated_by}
                    </p>

                  </div>

                )}

              </div>

            ))}

          </div>

        )}

      </div>

    </section>
  );
}