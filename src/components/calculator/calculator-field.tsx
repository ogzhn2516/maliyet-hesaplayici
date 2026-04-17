import type {
  CalculatorFieldDefinition,
  CalculatorFieldMode,
} from "@/lib/profit-calculator";

type CalculatorFieldProps = {
  field: CalculatorFieldDefinition;
  value: string;
  onChange: (value: string, mode: CalculatorFieldMode) => void;
};

export function CalculatorField({
  field,
  value,
  onChange,
}: CalculatorFieldProps) {
  const suffix = field.mode === "percent" ? "%" : "TL";

  return (
    <label
      htmlFor={field.key}
      className="surface-panel-strong group flex flex-col gap-3 rounded-[28px] p-4 transition-transform duration-200 hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <span className="text-sm font-semibold text-[var(--foreground)]">
            {field.label}
          </span>
          {field.required ? (
            <p className="text-xs font-medium text-[var(--accent)]">
              Zorunlu alan
            </p>
          ) : (
            <p className="text-xs font-medium text-[var(--muted)]">
              Opsiyonel alan
            </p>
          )}
        </div>
        <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
          {suffix}
        </span>
      </div>

      <input
        id={field.key}
        name={field.key}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        enterKeyHint="next"
        placeholder={field.placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value, field.mode)}
        className="h-14 rounded-2xl border border-[var(--border)] bg-transparent px-4 text-lg font-semibold tracking-tight text-[var(--foreground)] outline-none transition-colors placeholder:text-[color:color-mix(in_srgb,var(--muted)_70%,transparent)] focus:border-[var(--accent)]"
      />

      <p className="text-sm leading-6 text-[var(--muted)]">{field.hint}</p>
    </label>
  );
}
