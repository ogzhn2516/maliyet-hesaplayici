type ResultMetricCardProps = {
  title: string;
  value: string;
  description: string;
  tone?: "neutral" | "accent" | "warm" | "positive" | "negative";
  emphasize?: boolean;
};

const toneClasses: Record<NonNullable<ResultMetricCardProps["tone"]>, string> = {
  neutral:
    "border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface-strong)_88%,transparent)] text-[var(--foreground)]",
  accent:
    "border-[color:color-mix(in_srgb,var(--accent)_16%,var(--border))] bg-[var(--accent-soft)] text-[var(--foreground)]",
  warm: "border-[color:color-mix(in_srgb,var(--accent-warm)_24%,var(--border))] bg-[var(--accent-warm-soft)] text-[var(--foreground)]",
  positive:
    "border-[color:color-mix(in_srgb,var(--success)_22%,var(--border))] bg-[color:color-mix(in_srgb,var(--success)_12%,var(--surface-strong))] text-[var(--foreground)]",
  negative:
    "border-[color:color-mix(in_srgb,var(--danger)_24%,var(--border))] bg-[color:color-mix(in_srgb,var(--danger)_10%,var(--surface-strong))] text-[var(--foreground)]",
};

export function ResultMetricCard({
  title,
  value,
  description,
  tone = "neutral",
  emphasize = false,
}: ResultMetricCardProps) {
  return (
    <article
      className={`rounded-[28px] border p-5 ${toneClasses[tone]} transition-transform duration-200 hover:-translate-y-0.5`}
    >
      <p className="text-sm font-medium text-[var(--muted)]">{title}</p>
      <p
        className={`metric-value mt-3 ${
          emphasize ? "text-3xl sm:text-4xl" : "text-2xl"
        } font-semibold leading-none`}
      >
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{description}</p>
    </article>
  );
}
