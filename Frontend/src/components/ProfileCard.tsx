import InfoItem from "./InfoItem";

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

interface ProfileCardProps {
  student: Student;
}

export default function ProfileCard({
  student,
}: ProfileCardProps) {
  const fullName = [
    student.first_name,
    student.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  const initials = [
    student.first_name?.charAt(0),
    student.last_name?.charAt(0),
  ]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  const studentType =
    student.student_type === "DS"
      ? "Day Scholar"
      : student.student_type || "Not Available";

  return (
    <section
      id="student-profile"
      className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >

      {/* =====================================
          HEADER
          ===================================== */}

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

        <div className="flex items-center gap-4">

          {/* Avatar */}

          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-blue-600 text-xl font-bold text-white">

            {student.photo ? (
              <img
                src={student.photo}
                alt={fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              initials || "ST"
            )}

          </div>

          {/* Name */}

          <div>

            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Student Profile
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              {fullName || "Student"}
            </h2>

            <div className="mt-2 flex flex-wrap gap-2">

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                {student.student_code}
              </span>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                {studentType}
              </span>

              <span
                className={
                  student.status
                    ? "rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700"
                    : "rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700"
                }
              >
                {student.status
                  ? "Active"
                  : "Inactive"}
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================
          PERSONAL INFORMATION
          ===================================== */}

      <div className="mt-8">

        <div className="mb-5">

          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Student Information
          </p>

          <h3 className="mt-1 text-lg font-bold text-slate-900">
            Personal & Contact Information
          </h3>

        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <InfoItem
            label="Student Code"
            value={student.student_code}
          />

          <InfoItem
            label="Roll Number"
            value={student.roll_number}
          />

          {/* COURSE / GROUP */}

          <InfoItem
            label="Course / Group"
            value={
              student.group_name ||
              "Not Assigned"
            }
          />

          <InfoItem
            label="Date of Birth"
            value={student.date_of_birth}
          />

          <InfoItem
            label="Gender"
            value={student.gender}
          />

          <InfoItem
            label="Blood Group"
            value={student.blood_group}
          />

          <InfoItem
            label="Student Type"
            value={studentType}
          />

          <InfoItem
            label="Phone"
            value={student.phone}
          />

          <InfoItem
            label="Email"
            value={student.email}
          />

          <InfoItem
            label="Address"
            value={student.address}
          />

          <InfoItem
            label="City"
            value={student.city}
          />

          <InfoItem
            label="State"
            value={student.state}
          />

          <InfoItem
            label="Postal Code"
            value={student.postal_code}
          />

        </div>

      </div>

    </section>
  );
}