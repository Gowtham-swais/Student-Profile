from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import text
from sqlalchemy.orm import Session

from ..database import get_db


router = APIRouter(
    prefix="/api/students",
    tags=["Students"],
)


# ============================================================
# STUDENT LIST
# ============================================================

@router.get("")
def get_students(
    db: Session = Depends(get_db),
    search: str | None = Query(default=None),
):
    sql = """
        SELECT
            s.student_id,
            s.student_code,
            s.roll_number,
            s.first_name,
            s.last_name,
            s.student_type,
            s.group_id,
            g.group_name
        FROM jclg_student s
        LEFT JOIN jclg_group g
            ON g.group_id = s.group_id
        WHERE s.student_type = 'DS'
    """

    params: dict[str, Any] = {}

    if search:
        sql += """
            AND (
                s.student_code ILIKE :search
                OR s.first_name ILIKE :search
                OR s.last_name ILIKE :search
            )
        """

        params["search"] = f"%{search}%"

    sql += """
        ORDER BY s.first_name, s.last_name
    """

    result = db.execute(text(sql), params)

    rows = result.mappings().all()

    return {
        "success": True,
        "count": len(rows),
        "data": [dict(row) for row in rows],
    }


# ============================================================
# STUDENT PROGRESS REPORT
# IMPORTANT:
# This route MUST come before /{student_id}
# ============================================================

@router.get("/{student_id}/progress")
def get_student_progress(
    student_id: int,
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # STUDENT
    # --------------------------------------------------------

    student_sql = """
        SELECT
            s.*,
            g.group_name
        FROM jclg_student s
        LEFT JOIN jclg_group g
            ON g.group_id = s.group_id
        WHERE s.student_id = :student_id
          AND s.student_type = 'DS'
    """

    student = (
        db.execute(
            text(student_sql),
            {"student_id": student_id},
        )
        .mappings()
        .first()
    )

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Day Scholar student not found",
        )

    # --------------------------------------------------------
    # EXAMINATION RESULTS
    # --------------------------------------------------------

    result_sql = """
        SELECT
            r.result_id,
            r.student_id,
            r.exam_id,
            e.exam_name,
            e.exam_type,
            e.start_date,
            e.end_date,
            r.total_marks,
            r.marks_obtained,
            r.percentage,
            r.grade,
            r.result_status,
            r.rank,
            r.remarks
        FROM jclg_result r
        INNER JOIN jclg_exam e
            ON e.exam_id = r.exam_id
        WHERE r.student_id = :student_id
        ORDER BY e.start_date DESC
    """

    result_rows = (
        db.execute(
            text(result_sql),
            {"student_id": student_id},
        )
        .mappings()
        .all()
    )

    results = [dict(row) for row in result_rows]

    # --------------------------------------------------------
    # SUBJECT-WISE MARKS
    # --------------------------------------------------------

    marks_sql = """
        SELECT
            m.marks_id,
            m.student_id,
            m.exam_subject_id,
            e.exam_id,
            e.exam_name,
            e.exam_type,
            s.subject_id,
            s.subject_code,
            s.subject_name,
            es.max_marks,
            es.pass_marks,
            m.marks_obtained,
            m.grade,
            m.remarks
        FROM jclg_marks m

        INNER JOIN jclg_exam_subject es
            ON es.exam_subject_id = m.exam_subject_id

        INNER JOIN jclg_exam e
            ON e.exam_id = es.exam_id

        INNER JOIN jclg_subject s
            ON s.subject_id = es.subject_id

        WHERE m.student_id = :student_id

        ORDER BY
            e.start_date DESC,
            s.subject_name
    """

    marks_rows = (
        db.execute(
            text(marks_sql),
            {"student_id": student_id},
        )
        .mappings()
        .all()
    )

    marks = [dict(row) for row in marks_rows]

    # --------------------------------------------------------
    # ATTENDANCE
    # --------------------------------------------------------

    attendance_sql = """
        SELECT
            COUNT(*) AS attendance_records,

            COUNT(*) FILTER (
                WHERE UPPER(status) = 'PRESENT'
            ) AS present,

            COUNT(*) FILTER (
                WHERE UPPER(status) = 'ABSENT'
            ) AS absent

        FROM jclg_attendance

        WHERE student_id = :student_id

          AND academic_year_id = (
              SELECT academic_year_id
              FROM jclg_student
              WHERE student_id = :student_id
          )
    """

    attendance = (
        db.execute(
            text(attendance_sql),
            {"student_id": student_id},
        )
        .mappings()
        .first()
    )

    total_attendance = int(
        attendance["attendance_records"]
        if attendance
        else 0
    )

    present_count = int(
        attendance["present"]
        if attendance
        else 0
    )

    absent_count = int(
        attendance["absent"]
        if attendance
        else 0
    )

    attendance_percentage = (
        round(
            (present_count / total_attendance) * 100,
            2,
        )
        if total_attendance > 0
        else 0
    )

    # --------------------------------------------------------
    # SUBJECT SUMMARY
    # --------------------------------------------------------

    subject_summary_sql = """
        SELECT
            s.subject_id,
            s.subject_code,
            s.subject_name,

            COUNT(m.marks_id) AS exam_count,

            ROUND(
                AVG(
                    CASE
                        WHEN es.max_marks > 0
                        THEN
                            (m.marks_obtained / es.max_marks) * 100
                        ELSE 0
                    END
                ),
                2
            ) AS average_percentage,

            MAX(
                CASE
                    WHEN es.max_marks > 0
                    THEN
                        (m.marks_obtained / es.max_marks) * 100
                    ELSE 0
                END
            ) AS highest_percentage,

            MIN(
                CASE
                    WHEN es.max_marks > 0
                    THEN
                        (m.marks_obtained / es.max_marks) * 100
                    ELSE 0
                END
            ) AS lowest_percentage

        FROM jclg_marks m

        INNER JOIN jclg_exam_subject es
            ON es.exam_subject_id = m.exam_subject_id

        INNER JOIN jclg_subject s
            ON s.subject_id = es.subject_id

        WHERE m.student_id = :student_id

        GROUP BY
            s.subject_id,
            s.subject_code,
            s.subject_name

        ORDER BY s.subject_name
    """

    subject_rows = (
        db.execute(
            text(subject_summary_sql),
            {"student_id": student_id},
        )
        .mappings()
        .all()
    )

    subject_summary = [
        dict(row)
        for row in subject_rows
    ]

    # --------------------------------------------------------
    # OVERALL PERFORMANCE
    # --------------------------------------------------------

    total_marks = sum(
        float(row["total_marks"] or 0)
        for row in results
    )

    marks_obtained = sum(
        float(row["marks_obtained"] or 0)
        for row in results
    )

    overall_percentage = (
        round(
            (marks_obtained / total_marks) * 100,
            2,
        )
        if total_marks > 0
        else 0
    )

    # --------------------------------------------------------
    # RETURN
    # --------------------------------------------------------

    return {
        "success": True,

        "data": {
            "student": dict(student),

            "results": results,

            "marks": marks,

            "subject_summary": subject_summary,

            "attendance": {
                "attendance_records": total_attendance,
                "present": present_count,
                "absent": absent_count,
                "attendance_percentage": attendance_percentage,
            },

            "overall": {
                "total_marks": total_marks,
                "marks_obtained": marks_obtained,
                "percentage": overall_percentage,
                "exam_count": len(results),
            },
        },
    }


# ============================================================
# AI ANALYSIS
# ============================================================

@router.get("/{student_id}/ai-analysis")
def get_student_ai_analysis(
    student_id: int,
    db: Session = Depends(get_db),
):

    student_sql = """
        SELECT
            s.student_id,
            s.student_code,
            s.first_name,
            s.last_name,
            s.group_id,
            g.group_name
        FROM jclg_student s
        LEFT JOIN jclg_group g
            ON g.group_id = s.group_id
        WHERE s.student_id = :student_id
          AND s.student_type = 'DS'
    """

    student = (
        db.execute(
            text(student_sql),
            {"student_id": student_id},
        )
        .mappings()
        .first()
    )

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found",
        )

    # --------------------------------------------------------
    # AI INSIGHTS
    # --------------------------------------------------------

    insight_sql = """
        SELECT
            insight_id,
            campus_id,
            student_id,
            faculty_id,
            insight_type,
            title,
            description,
            recommendation,
            confidence_score,
            generated_by,
            metadata,
            created_at
        FROM jclg_ai_insight
        WHERE student_id = :student_id
        ORDER BY created_at DESC
    """

    insight_rows = (
        db.execute(
            text(insight_sql),
            {"student_id": student_id},
        )
        .mappings()
        .all()
    )

    insights = [
        dict(row)
        for row in insight_rows
    ]

    # --------------------------------------------------------
    # PERFORMANCE SUMMARY FOR AI SCREEN
    # --------------------------------------------------------

    performance_sql = """
        SELECT
            COUNT(*) AS exam_count,

            ROUND(
                AVG(percentage),
                2
            ) AS average_percentage,

            MAX(percentage) AS highest_percentage,

            MIN(percentage) AS lowest_percentage,

            COUNT(*) FILTER (
                WHERE result_status = 'PASS'
            ) AS passed_exams,

            COUNT(*) FILTER (
                WHERE result_status = 'FAIL'
            ) AS failed_exams

        FROM jclg_result

        WHERE student_id = :student_id
    """

    performance = (
        db.execute(
            text(performance_sql),
            {"student_id": student_id},
        )
        .mappings()
        .first()
    )

    return {
        "success": True,

        "data": {
            "student": dict(student),

            "insights": insights,

            "performance": (
                dict(performance)
                if performance
                else {
                    "exam_count": 0,
                    "average_percentage": 0,
                    "highest_percentage": 0,
                    "lowest_percentage": 0,
                    "passed_exams": 0,
                    "failed_exams": 0,
                }
            ),
        },
    }


# ============================================================
# SINGLE STUDENT
# ============================================================

@router.get("/{student_id}")
def get_student(
    student_id: int,
    db: Session = Depends(get_db),
):

    sql = """
        SELECT
            s.*,
            g.group_name
        FROM jclg_student s
        LEFT JOIN jclg_group g
            ON g.group_id = s.group_id
        WHERE s.student_id = :student_id
          AND s.student_type = 'DS'
    """

    result = (
        db.execute(
            text(sql),
            {"student_id": student_id},
        )
        .mappings()
        .first()
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Day Scholar student not found",
        )

    return {
        "success": True,
        "data": dict(result),
    }


# ============================================================
# ADMISSION
# ============================================================

@router.get("/{student_id}/admission")
def get_student_admission(
    student_id: int,
    db: Session = Depends(get_db),
):

    sql = """
        SELECT a.*
        FROM jclg_admission a

        INNER JOIN jclg_student s
            ON s.admission_id = a.admission_id

        WHERE s.student_id = :student_id
    """

    result = (
        db.execute(
            text(sql),
            {"student_id": student_id},
        )
        .mappings()
        .first()
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Admission details not found",
        )

    return {
        "success": True,
        "data": dict(result),
    }


# ============================================================
# PARENTS
# ============================================================

@router.get("/{student_id}/parents")
def get_student_parents(
    student_id: int,
    db: Session = Depends(get_db),
):

    sql = """
        SELECT
            p.*,
            sp.relationship,
            sp.is_primary

        FROM jclg_student_parent sp

        INNER JOIN jclg_parent p
            ON p.parent_id = sp.parent_id

        WHERE sp.student_id = :student_id

        ORDER BY
            sp.is_primary DESC,
            p.parent_id
    """

    result = (
        db.execute(
            text(sql),
            {"student_id": student_id},
        )
        .mappings()
        .all()
    )

    return {
        "success": True,
        "data": [
            dict(row)
            for row in result
        ],
    }


# ============================================================
# FACULTY
# ============================================================

@router.get("/{student_id}/faculty")
def get_student_faculty(
    student_id: int,
    db: Session = Depends(get_db),
):

    sql = """
        SELECT f.*
        FROM jclg_faculty f

        INNER JOIN jclg_student s
            ON s.campus_id = f.campus_id

        WHERE s.student_id = :student_id
          AND f.status = TRUE

        ORDER BY
            f.first_name,
            f.last_name
    """

    result = (
        db.execute(
            text(sql),
            {"student_id": student_id},
        )
        .mappings()
        .all()
    )

    return {
        "success": True,
        "data": [
            dict(row)
            for row in result
        ],
    }


# ============================================================
# COMPLETE STUDENT DASHBOARD
# ============================================================

@router.get("/{student_id}/dashboard")
def get_student_dashboard(
    student_id: int,
    db: Session = Depends(get_db),
):

    student_sql = """
        SELECT
            s.*,
            g.group_name
        FROM jclg_student s

        LEFT JOIN jclg_group g
            ON g.group_id = s.group_id

        WHERE s.student_id = :student_id
          AND s.student_type = 'DS'
    """

    student = (
        db.execute(
            text(student_sql),
            {"student_id": student_id},
        )
        .mappings()
        .first()
    )

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Day Scholar student not found",
        )

    admission_sql = """
        SELECT a.*
        FROM jclg_admission a

        INNER JOIN jclg_student s
            ON s.admission_id = a.admission_id

        WHERE s.student_id = :student_id
    """

    admission = (
        db.execute(
            text(admission_sql),
            {"student_id": student_id},
        )
        .mappings()
        .first()
    )

    parent_sql = """
        SELECT
            p.*,
            sp.relationship,
            sp.is_primary

        FROM jclg_student_parent sp

        INNER JOIN jclg_parent p
            ON p.parent_id = sp.parent_id

        WHERE sp.student_id = :student_id

        ORDER BY
            sp.is_primary DESC,
            p.parent_id
    """

    parents = (
        db.execute(
            text(parent_sql),
            {"student_id": student_id},
        )
        .mappings()
        .all()
    )

    faculty_sql = """
        SELECT f.*
        FROM jclg_faculty f

        INNER JOIN jclg_student s
            ON s.campus_id = f.campus_id

        WHERE s.student_id = :student_id
          AND f.status = TRUE

        ORDER BY
            f.first_name,
            f.last_name
    """

    faculty = (
        db.execute(
            text(faculty_sql),
            {"student_id": student_id},
        )
        .mappings()
        .all()
    )

    return {
        "success": True,

        "data": {
            "student": dict(student),

            "admission": (
                dict(admission)
                if admission
                else None
            ),

            "parents": [
                dict(row)
                for row in parents
            ],

            "faculty": [
                dict(row)
                for row in faculty
            ],
        },
    }