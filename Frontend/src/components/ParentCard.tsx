import InfoItem from "./InfoItem";

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

interface ParentCardProps {
  parents: Parent[];
}

export default function ParentCard({
  parents,
}: ParentCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Family Information
        </p>

        <h2 className="mt-1 text-lg font-bold text-slate-900">
          Parent / Guardian Information
        </h2>
      </div>

      {parents.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">

          <p className="text-sm font-semibold text-slate-600">
            No parent or guardian information available
          </p>

        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">

          {parents.map((parent) => {
            const parentName =
              parent.father_name ||
              parent.mother_name ||
              parent.guardian_name ||
              "Parent / Guardian";

            return (
              <div
                key={parent.parent_id}
                className="rounded-2xl border border-slate-200 p-5"
              >

                <div className="mb-5 flex items-center justify-between">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {parent.relationship}
                    </p>

                    <h3 className="mt-1 text-lg font-bold text-slate-900">
                      {parentName}
                    </h3>
                  </div>

                  {parent.is_primary && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-[10px] font-bold text-blue-700">
                      PRIMARY
                    </span>
                  )}

                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  <InfoItem
                    label="Parent Code"
                    value={parent.parent_code}
                  />

                  <InfoItem
                    label="Relationship"
                    value={parent.relationship}
                  />

                  <InfoItem
                    label="Father"
                    value={parent.father_name}
                  />

                  <InfoItem
                    label="Mother"
                    value={parent.mother_name}
                  />

                  <InfoItem
                    label="Guardian"
                    value={parent.guardian_name}
                  />

                  <InfoItem
                    label="Phone"
                    value={parent.phone}
                  />

                  <InfoItem
                    label="Alternate Phone"
                    value={parent.alternate_phone}
                  />

                  <InfoItem
                    label="Email"
                    value={parent.email}
                  />

                  <InfoItem
                    label="Occupation"
                    value={parent.occupation}
                  />

                  <InfoItem
                    label="Address"
                    value={parent.address}
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