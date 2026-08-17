export default function DisplayField({
  label,
  value,
  className = '',
  emptyText = '---',
}) {
  const base =
    'w-full min-w-[130px] rounded-xl border border-slate-300 ' +
    'bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm';

  return (
    <div className={className}>
      {label && (
        <label className="mb-1 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <div className={base}>{value ?? emptyText}</div>
    </div>
  );
}
