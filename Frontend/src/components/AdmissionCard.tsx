import InfoItem from "./InfoItem";

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

interface AdmissionCardProps {
  admission: Admission | null;
}

export default function AdmissionCard({
  admission,
}: AdmissionCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6">

        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Admission
        </p>

        <h2 className="mt-1 text-lg font-bold text-slate-900">
          Admission Details
        </h2>

      </div>

      {!admission ? (

        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">

          <p className="text-sm font-semibold text-slate-600">
            No admission information available
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Admission details have not been linked to this student.
          </p>

        </div>

      ) : (

        <div className="space-y-5">

          <div className="flex items-center justify-between">

            <span className="text-sm font-semibold text-slate-500">
              Admission Status
            </span>

            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
              {admission.admission_status}
            </span>

          </div>

          <div className="grid gap-5 sm:grid-cols-2">

            <InfoItem
              label="Application Number"
              value={admission.application_no}
            />

            <InfoItem
              label="Student Name"
              value={admission.student_name}
            />

            <InfoItem
              label="Date of Birth"
              value={admission.date_of_birth}
            />

            <InfoItem
              label="Gender"
              value={admission.gender}
            />

            <InfoItem
              label="Phone"
              value={admission.phone}
            />

            <InfoItem
              label="Email"
              value={admission.email}
            />

            <InfoItem
              label="Previous School"
              value={admission.previous_school}
            />

            <InfoItem
              label="Stream ID"
              value={admission.stream_id}
            />

            <InfoItem
              label="Group ID"
              value={admission.group_id}
            />

            <InfoItem
              label="Application Date"
              value={admission.application_date}
            />

            <InfoItem
              label="Admission Date"
              value={admission.admission_date}
            />

            <InfoItem
              label="Documents"
              value={admission.documents_status}
            />

          </div>

        </div>

      )}

    </section>
  );
}