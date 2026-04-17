"use client";

import { useEffect, useRef, useState } from "react";
import {
  emptyPrintCostValues,
  examplePrintCostValues,
  hydratePrintCostValues,
  sanitizePrintValue,
  calculateTotalProductionCost,
  type ExtraCostRow,
  type PrintCostFormValues,
} from "@/lib/print-cost-calculator";
import { PrintCostSection, PrintInput } from "./print-cost-section";
import { DynamicCostRows } from "./dynamic-cost-rows";
import { PrintCostResultPanel } from "./print-cost-result";

const PRINT_STORAGE_KEY = "print-cost-calculator-values";
const PERCENT_KEYS: (keyof PrintCostFormValues)[] = [
  "wasteRate",
  "failedPrintRate",
  "targetMarginRate",
];

type PrintCostDashboardProps = {
  onTransferToSales: (cost: number) => void;
};

export function PrintCostDashboard({ onTransferToSales }: PrintCostDashboardProps) {
  const [values, setValues] =
    useState<PrintCostFormValues>(emptyPrintCostValues);
  const [extraRows, setExtraRows] = useState<ExtraCostRow[]>([]);
  const hasHydratedRef = useRef(false);

  const result = calculateTotalProductionCost(values, extraRows);

  // LocalStorage yükleme
  useEffect(() => {
    window.queueMicrotask(() => {
      try {
        const saved = window.localStorage.getItem(PRINT_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          const hydrated = hydratePrintCostValues(parsed.values);
          if (hydrated) setValues(hydrated);
          if (Array.isArray(parsed.extraRows)) setExtraRows(parsed.extraRows);
        }
      } catch {
        // sessizce geç
      }
      hasHydratedRef.current = true;
    });
  }, []);

  // LocalStorage kaydetme
  useEffect(() => {
    if (!hasHydratedRef.current) return;
    window.localStorage.setItem(
      PRINT_STORAGE_KEY,
      JSON.stringify({ values, extraRows }),
    );
  }, [values, extraRows]);

  function updateField(key: keyof PrintCostFormValues, raw: string) {
    const isPercent = PERCENT_KEYS.includes(key);
    setValues((prev) => ({
      ...prev,
      [key]: sanitizePrintValue(raw, isPercent),
    }));
  }

  function handleReset() {
    setValues(emptyPrintCostValues);
    setExtraRows([]);
  }

  function handleFillExample() {
    setValues(examplePrintCostValues);
    setExtraRows([]);
  }

  function inp(
    id: keyof PrintCostFormValues,
    label: string,
    placeholder = "0",
    suffix?: string,
    hint?: string,
    isPercent = false,
  ) {
    return (
      <PrintInput
        key={id}
        id={id}
        label={label}
        placeholder={placeholder}
        value={values[id]}
        suffix={suffix}
        hint={hint}
        isPercent={isPercent}
        onChange={(v) => updateField(id, v)}
      />
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
      {/* Sol: Form */}
      <div className="surface-panel rounded-[36px] p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold text-[var(--foreground)]">
              Maliyet Formu
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-6 text-[var(--muted)]">
              İstediğiniz kalemleri doldurun. Boş bıraktığınız alanlar 0 kabul edilir.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleFillExample}
              className="inline-flex h-10 items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--accent-warm)_24%,var(--border))] bg-[var(--accent-warm-soft)] px-4 text-sm font-semibold text-[var(--accent-warm)] transition-transform hover:-translate-y-0.5"
            >
              Örnek Veri
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex h-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 text-sm font-semibold text-[var(--foreground)] transition-transform hover:-translate-y-0.5"
            >
              Temizle
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* A — Filament */}
          <PrintCostSection
            title="Filament Bilgileri"
            description="Makara fiyatı, ağırlık ve baskı gramajını girin."
            icon="🧵"
          >
            {inp("filamentPrice", "Makara Fiyatı", "550")}
            {inp("spoolWeightGr", "Makara Ağırlığı", "1000", "g")}
            {inp("printWeightGr", "Baskı Gramajı", "85", "g")}
            {inp("supportWeightGr", "Destek / Fire Gramajı", "0", "g", "Baskı sonrası atılan destek yapısı")}
            {inp("wasteRate", "Fire Oranı", "3", undefined, "Bozulma ve sızdırma payı (%)", true)}
          </PrintCostSection>

          {/* B — Elektrik */}
          <PrintCostSection
            title="Elektrik Bilgileri"
            description="Baskı süresi ve güç tüketimini girin."
            icon="⚡"
          >
            {inp("printHours", "Baskı Süresi", "4.5", "sa")}
            {inp("printerPowerW", "Yazıcı Gücü", "200", "W")}
            {inp("electricityUnitPrice", "Elektrik Birim Fiyatı", "6.5", "₺/kWh")}
            {inp("preheatHours", "Ön Isıtma / Ek Süre", "0.25", "sa", "Isınma ve bekleme süresi")}
          </PrintCostSection>

          {/* C — Makine (Gelişmiş) */}
          <PrintCostSection
            title="Makine Giderleri"
            description="Amortisman ve bakım giderlerini dahil edin."
            icon="🖨️"
            advanced
            defaultOpen={false}
          >
            {inp("printerPurchasePrice", "Yazıcı Alış Fiyatı", "15000")}
            {inp("printerLifetimeHours", "Hedef Kullanım Ömrü", "5000", "sa")}
            {inp("maintenanceCostPerPrint", "Bakım Gideri (baskı başı)", "8", undefined, "Nozzle, PTFE, tabla yüzeyi vb.")}
          </PrintCostSection>

          {/* D — İşçilik */}
          <PrintCostSection
            title="İşçilik Bilgileri"
            description="Her iş adımı için harcanan süreyi dakika olarak girin."
            icon="👐"
          >
            {inp("hourlyLaborRate", "Saatlik Ücret", "150")}
            {inp("designMinutes", "Tasarım Süresi", "20", "dk")}
            {inp("prepMinutes", "Hazırlık Süresi", "10", "dk")}
            {inp("cleanupMinutes", "Temizlik Süresi", "15", "dk")}
            {inp("assemblyMinutes", "Montaj / Boya Süresi", "0", "dk")}
            {inp("packagingMinutes", "Paketleme Süresi", "10", "dk")}
          </PrintCostSection>

          {/* E — Paketleme */}
          <PrintCostSection
            title="Paketleme & Ek Giderler"
            description="Ambalaj malzemeleri, reklam ve özel giderler."
            icon="📦"
          >
            {inp("boxCost", "Kutu", "8")}
            {inp("wrappingCost", "Balonlu Naylon / Koruyucu", "3")}
            {inp("labelCost", "Etiket / Baskı", "1.5")}
            {inp("tapeCost", "Bant / Sarf", "0.5")}
            {inp("packagingOtherCost", "Diğer Ambalaj", "0")}
            {inp("adCost", "Reklam Gideri", "20")}
            {inp("generalOverhead", "Genel Gider Payı (atölye kira vb.)", "10")}
            {inp("testPrintCost", "Test Baskısı Gideri", "0")}
            <DynamicCostRows rows={extraRows} onChange={setExtraRows} />
          </PrintCostSection>

          {/* F — Fire / Hata (Gelişmiş) */}
          <PrintCostSection
            title="Hatalı Baskı / Fire Payı"
            description="Olası hata ve iade riskini maliyete ekleyin."
            icon="⚠️"
            advanced
            defaultOpen={false}
          >
            {inp("failedPrintRate", "Hatalı Baskı Oranı", "5", undefined, "Toplam maliyetin yüzdesi olarak güvenlik payı", true)}
          </PrintCostSection>

          {/* G — Hedef Kar */}
          <PrintCostSection
            title="Hedef Kar & Önerilen Fiyat"
            description="Girdiğiniz kar marjına göre minimum satış fiyatı hesaplanır."
            icon="🎯"
          >
            {inp("targetMarginRate", "Hedef Kar Marjı", "30", undefined, "Satış fiyatının yüzdesi olarak istenen kar", true)}
          </PrintCostSection>
        </div>
      </div>

      {/* Sağ: Sonuç */}
      <div className="surface-panel rounded-[36px] p-5 sm:p-6 xl:sticky xl:top-8 xl:h-fit">
        <h2 className="mb-4 text-2xl font-semibold text-[var(--foreground)]">
          Sonuç Özeti
        </h2>
        <PrintCostResultPanel
          result={result}
          onTransferToSales={onTransferToSales}
          targetMarginRate={values.targetMarginRate}
        />
      </div>
    </div>
  );
}
