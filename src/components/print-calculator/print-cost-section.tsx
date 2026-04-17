"use client";

import type { ReactNode } from "react";

type PrintCostSectionProps = {
  title: string;
  description: string;
  icon: string;
  children: ReactNode;
  advanced?: boolean;
  defaultOpen?: boolean;
};

export function PrintCostSection({
  title,
  description,
  icon,
  children,
  advanced = false,
  defaultOpen = true,
}: PrintCostSectionProps) {
  if (advanced) {
    return (
      <details
        className="rounded-[30px] border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface-strong)_94%,transparent)]"
        open={defaultOpen}
      >
        <summary className="flex cursor-pointer select-none items-center gap-3 p-4 sm:p-5">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent-warm-soft)] text-lg">
            {icon}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold text-[var(--foreground)]">
              {title}
            </p>
            <p className="mt-0.5 text-sm text-[var(--muted)]">{description}</p>
          </div>
          <span className="ml-2 flex-shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-warm)]">
            Gelişmiş
          </span>
        </summary>
        <div className="px-4 pb-4 pt-0 sm:px-5 sm:pb-5">
          <div className="grid gap-4 sm:grid-cols-2">{children}</div>
        </div>
      </details>
    );
  }

  return (
    <fieldset className="rounded-[30px] border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface-strong)_94%,transparent)] p-4 sm:p-5">
      <legend className="flex items-center gap-2.5 px-2">
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-base">
          {icon}
        </span>
        <span className="text-base font-semibold text-[var(--foreground)]">
          {title}
        </span>
      </legend>
      <p className="mb-4 mt-2 px-1 text-sm leading-6 text-[var(--muted)]">
        {description}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

type PrintInputProps = {
  id: string;
  label: string;
  hint?: string;
  placeholder?: string;
  value: string;
  suffix?: string;
  onChange: (value: string) => void;
  isPercent?: boolean;
};

export function PrintInput({
  id,
  label,
  hint,
  placeholder = "0",
  value,
  suffix,
  onChange,
  isPercent = false,
}: PrintInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-semibold text-[var(--foreground)]"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 pr-14 text-sm font-medium text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-colors"
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[var(--muted)]">
          {isPercent ? "%" : suffix ?? "₺"}
        </span>
      </div>
      {hint && (
        <p className="text-xs leading-5 text-[var(--muted)]">{hint}</p>
      )}
    </div>
  );
}
