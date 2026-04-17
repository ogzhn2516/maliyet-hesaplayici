"use client";

import {
  formatTL,
  formatGram,
  formatHour,
  type PrintCostResult,
} from "@/lib/print-cost-calculator";

type RowProps = {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  muted?: boolean;
};

function CostRow({ label, value, sub, accent, muted }: RowProps) {
  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-2xl px-4 py-3 ${
        accent
          ? "bg-[var(--accent-soft)]"
          : muted
            ? "bg-[color:color-mix(in_srgb,var(--surface-strong)_80%,transparent)]"
            : "bg-[color:color-mix(in_srgb,var(--surface-strong)_60%,transparent)]"
      }`}
    >
      <div className="min-w-0">
        <p
          className={`text-sm font-semibold ${accent ? "text-[var(--accent)]" : "text-[var(--foreground)]"}`}
        >
          {label}
        </p>
        {sub && (
          <p className="mt-0.5 text-xs text-[var(--muted)]">{sub}</p>
        )}
      </div>
      <p
        className={`metric-value flex-shrink-0 text-base font-semibold ${
          accent ? "text-[var(--accent)]" : "text-[var(--foreground)]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

type PrintCostResultPanelProps = {
  result: PrintCostResult;
  onTransferToSales: (cost: number) => void;
  targetMarginRate: string;
};

export function PrintCostResultPanel({
  result,
  onTransferToSales,
  targetMarginRate,
}: PrintCostResultPanelProps) {
  const hasMargin = parseFloat(targetMarginRate) > 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Ana Toplam Kartı */}
      <div className="rounded-[30px] border border-[color:color-mix(in_srgb,var(--accent)_22%,var(--border))] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--accent)_12%,var(--surface-strong)),var(--surface-strong))] p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          Toplam Üretim Maliyeti
        </p>
        <p className="metric-value mt-3 text-5xl font-semibold leading-none text-[var(--foreground)]">
          {formatTL(result.totalProductionCost)}
        </p>
        {result.filamentCost > 0 && (
          <p className="mt-2 text-sm text-[var(--muted)]">
            {formatGram(result.correctedGrams)} filament ·{" "}
            {formatTL(result.gramCost)}/g
          </p>
        )}
      </div>

      {/* Maliyet Kırılımı */}
      <div className="flex flex-col gap-2">
        <p className="px-1 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          Maliyet Kırılımı
        </p>
        <CostRow
          label="🧵 Filament"
          value={formatTL(result.filamentCost)}
          sub={result.correctedGrams > 0 ? formatGram(result.correctedGrams) : undefined}
        />
        <CostRow
          label="⚡ Elektrik"
          value={formatTL(result.electricityCost)}
          sub={result.electricityKwh > 0 ? `${result.electricityKwh.toFixed(3)} kWh` : undefined}
        />
        <CostRow
          label="🖨️ Makine Payı"
          value={formatTL(result.machineCost)}
          sub={result.totalPrintHours > 0 ? `${result.totalPrintHours.toFixed(2)} sa` : undefined}
        />
        <CostRow
          label="👐 İşçilik"
          value={formatTL(result.laborCost)}
          sub={result.totalLaborMinutes > 0 ? formatHour(result.totalLaborMinutes) : undefined}
        />
        <CostRow
          label="📦 Paketleme"
          value={formatTL(result.packagingCost)}
        />
        {result.extraCostsTotal > 0 && (
          <CostRow
            label="➕ Ek Giderler"
            value={formatTL(result.extraCostsTotal)}
          />
        )}
        {result.totalProductionCost > result.baseTotalCost && (
          <CostRow
            label="⚠️ Fire / Hata Payı"
            value={formatTL(result.totalProductionCost - result.baseTotalCost)}
            muted
          />
        )}
        <div className="my-1 h-px bg-[var(--border)]" />
        <CostRow
          label="Toplam Üretim Maliyeti"
          value={formatTL(result.totalProductionCost)}
          accent
        />
      </div>

      {/* Önerilen Satış Fiyatı */}
      {hasMargin && result.suggestedSalePrice > 0 && (
        <div className="rounded-[24px] border border-[color:color-mix(in_srgb,var(--accent-warm)_24%,var(--border))] bg-[var(--accent-warm-soft)] px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-warm)]">
            %{targetMarginRate} Kar Marjı ile Önerilen Satış Fiyatı
          </p>
          <p className="metric-value mt-2 text-3xl font-semibold text-[var(--foreground)]">
            {formatTL(result.suggestedSalePrice)}
          </p>
        </div>
      )}

      {/* Satışa Aktar Butonu */}
      <button
        type="button"
        onClick={() => onTransferToSales(result.totalProductionCost)}
        disabled={result.totalProductionCost <= 0}
        className="group relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-[28px] bg-[var(--accent)] px-6 text-base font-semibold text-white shadow-lg shadow-[var(--accent-soft)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span className="text-xl">📤</span>
        Satış Hesabına Aktar
        <span className="text-sm font-normal opacity-80">
          → Ürün Maliyeti alanına
        </span>
      </button>
      {result.totalProductionCost <= 0 && (
        <p className="text-center text-xs text-[var(--muted)]">
          Aktarım için en az bir maliyet kalemi giriniz.
        </p>
      )}
    </div>
  );
}
