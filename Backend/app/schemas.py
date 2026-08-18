from typing import Any, Optional

from pydantic import BaseModel, ConfigDict


class StudentSummary(BaseModel):
    student_id: int
    student_code: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    student_type: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ParentResponse(BaseModel):
    parent_id: int
    parent_code: Optional[str] = None
    father_name: Optional[str] = None
    mother_name: Optional[str] = None
    guardian_name: Optional[str] = None
    phone: Optional[str] = None
    alternate_phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    occupation: Optional[str] = None
    relationship: Optional[str] = None
    is_primary: bool = False

    model_config = ConfigDict(from_attributes=True)


class AdmissionResponse(BaseModel):
    admission_id: int
    application_no: Optional[str] = None
    student_name: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    previous_school: Optional[str] = None
    stream_id: Optional[int] = None
    group_id: Optional[int] = None
    application_date: Optional[str] = None
    admission_date: Optional[str] = None
    admission_status: Optional[str] = None
    documents_status: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class FacultyResponse(BaseModel):
    faculty_id: int
    employee_code: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    qualification: Optional[str] = None
    designation: Optional[str] = None
    joining_date: Optional[str] = None
    department: Optional[str] = None
    status: bool = True

    model_config = ConfigDict(from_attributes=True)


class StudentDashboardResponse(BaseModel):
    student: dict[str, Any]
    admission: Optional[dict[str, Any]] = None
    parents: list[dict[str, Any]] = []
    faculty: list[dict[str, Any]] = []