interface InfoItemProps {
  label: string;
  value: unknown;
}

export default function InfoItem({
  label,
  value,
}: InfoItemProps) {
  const displayValue =
    value === null ||
    value === undefined ||
    value === ""
      ? "—"
      : String(value);

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
        {displayValue}
      </p>
    </div>
  );
}