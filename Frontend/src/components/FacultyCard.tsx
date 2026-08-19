import InfoItem from "./InfoItem";

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

interface FacultyCardProps {
  faculty: Faculty[];
}

export default function FacultyCard({
  faculty,
}: FacultyCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6">

        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Faculty
        </p>

        <h2 className="mt-1 text-lg font-bold text-slate-900">
          Faculty Information
        </h2>

      </div>

      {faculty.length === 0 ? (

        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">

          <p className="text-sm font-semibold text-slate-600">
            No faculty information available
          </p>

        </div>

      ) : (

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {faculty.map((member) => {

            const fullName = [
              member.first_name,
              member.last_name,
            ]
              .filter(Boolean)
              .join(" ");

            const initials =
              `${member.first_name?.charAt(0) ?? ""}${member.last_name?.charAt(0) ?? ""}`
                .toUpperCase();

            return (
              <div
                key={member.faculty_id}
                className="rounded-2xl border border-slate-200 p-5 transition hover:border-blue-300 hover:shadow-md"
              >

                <div className="mb-5 flex items-center gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
                    {initials || "FC"}
                  </div>

                  <div className="min-w-0">

                    <h3 className="truncate font-bold text-slate-900">
                      {fullName}
                    </h3>

                    <p className="text-xs text-slate-500">
                      {member.employee_code}
                    </p>

                  </div>

                </div>

                <div className="space-y-4">

                  <InfoItem
                    label="Designation"
                    value={member.designation}
                  />

                  <InfoItem
                    label="Department"
                    value={member.department}
                  />

                  <InfoItem
                    label="Qualification"
                    value={member.qualification}
                  />

                  <InfoItem
                    label="Phone"
                    value={member.phone}
                  />

                  <InfoItem
                    label="Email"
                    value={member.email}
                  />

                  <InfoItem
                    label="Joining Date"
                    value={member.joining_date}
                  />

                </div>

              </div>
            );
          })}

        </div>

      )}

    </section>
  );
}