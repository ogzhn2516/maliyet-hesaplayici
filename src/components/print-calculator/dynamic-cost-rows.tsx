"use client";

import { type ExtraCostRow, sanitizePrintValue } from "@/lib/print-cost-calculator";
import { PrintInput } from "./print-cost-section";

type DynamicCostRowsProps = {
  rows: ExtraCostRow[];
  onChange: (rows: ExtraCostRow[]) => void;
};

export function DynamicCostRows({ rows, onChange }: DynamicCostRowsProps) {
  function addRow() {
    onChange([
      ...rows,
      { id: crypto.randomUUID(), label: "", amount: "" },
    ]);
  }

  function removeRow(id: string) {
    onChange(rows.filter((r) => r.id !== id));
  }

  function updateRow(
    id: string,
    field: "label" | "amount",
    value: string,
  ) {
    onChange(
      rows.map((r) =>
        r.id === id
          ? {
              ...r,
              [field]:
                field === "amount"
                  ? sanitizePrintValue(value)
                  : value,
            }
          : r,
      ),
    );
  }

  return (
    <div className="col-span-full flex flex-col gap-3">
      {rows.length > 0 && (
        <div className="flex flex-col gap-2">
          {rows.map((row, index) => (
            <div key={row.id} className="flex items-end gap-2">
              <div className="flex-1">
                <label
                  htmlFor={`extra-label-${row.id}`}
                  className="text-xs font-semibold text-[var(--muted)]"
                >
                  Gider {index + 1} — Açıklama
                </label>
                <input
                  id={`extra-label-${row.id}`}
                  type="text"
                  placeholder="örn. Boyama malzemesi"
                  value={row.label}
                  onChange={(e) => updateRow(row.id, "label", e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 text-sm font-medium text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-colors"
                />
              </div>
              <div className="w-36 flex-shrink-0">
                <PrintInput
                  id={`extra-amount-${row.id}`}
                  label="Tutar"
                  placeholder="0"
                  value={row.amount}
                  onChange={(v) => updateRow(row.id, "amount", v)}
                />
              </div>
              <button
                type="button"
                onClick={() => removeRow(row.id)}
                aria-label="Gideri sil"
                className="mb-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-[color:color-mix(in_srgb,var(--danger)_30%,var(--border))] bg-[color:color-mix(in_srgb,var(--danger)_8%,var(--surface-strong))] text-[var(--danger)] transition-transform hover:-translate-y-0.5"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={addRow}
        className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-dashed border-[color:color-mix(in_srgb,var(--accent)_30%,var(--border))] bg-[var(--accent-soft)] px-4 text-sm font-semibold text-[var(--accent)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--accent)_20%,transparent)]"
      >
        <span className="text-lg leading-none">+</span> Gider Ekle
      </button>
    </div>
  );
}
