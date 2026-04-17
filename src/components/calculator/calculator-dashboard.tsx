"use client";

import { useEffect, useRef, useState } from "react";
import {
  calculateProfit,
  calculatorFieldGroups,
  emptyCalculatorValues,
  exampleCalculatorValues,
  formatCurrency,
  formatPercent,
  getStatusLabel,
  hydrateStoredValues,
  isNegative,
  sanitizeFieldValue,
  type CalculatorFieldKey,
  type CalculatorFieldMode,
  type CalculatorFormValues,
} from "@/lib/profit-calculator";
import { CalculatorField } from "./calculator-field";
import { FormulaAccordion } from "./formula-accordion";
import { ResultMetricCard } from "./result-metric-card";
import { ThemeToggle } from "./theme-toggle";
import { VatBreakdownBoard } from "./vat-breakdown-board";
import { PrintCostDashboard } from "@/components/print-calculator/print-cost-dashboard";

const STORAGE_KEY = "trendyol-profit-calculator-values";
const THEME_KEY = "trendyol-profit-calculator-theme";
const TAB_KEY = "maliyet-active-tab";

type ThemePreference = "light" | "dark";
type ActiveTab = "sales" | "print";

export function CalculatorDashboard() {
  const [values, setValues] =
    useState<CalculatorFormValues>(emptyCalculatorValues);
  const [theme, setTheme] = useState<ThemePreference>("light");
  const [activeTab, setActiveTab] = useState<ActiveTab>("sales");
  const [announcement, setAnnouncement] = useState(
    "Canlı hesaplama kullanıma hazır.",
  );
  const [pulseResults, setPulseResults] = useState(false);
  const resultsRef = useRef<HTMLElement | null>(null);
  const pulseTimeoutRef = useRef<number | null>(null);
  const hasHydratedRef = useRef(false);

  const result = calculateProfit(values);

  useEffect(() => {
    window.queueMicrotask(() => {
      try {
        const savedValues = window.localStorage.getItem(STORAGE_KEY);

        if (savedValues) {
          const hydratedValues = hydrateStoredValues(JSON.parse(savedValues));

          if (hydratedValues) {
            setValues(hydratedValues);
          }
        }

        const savedTheme = window.localStorage.getItem(THEME_KEY);
        const resolvedTheme: ThemePreference =
          savedTheme === "dark" || savedTheme === "light"
            ? savedTheme
            : window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "dark"
              : "light";

        const savedTab = window.localStorage.getItem(TAB_KEY);
        if (savedTab === "print" || savedTab === "sales") {
          setActiveTab(savedTab);
        }

        hasHydratedRef.current = true;
        document.documentElement.dataset.theme = resolvedTheme;
        setTheme(resolvedTheme);
      } catch {
        hasHydratedRef.current = true;
        document.documentElement.dataset.theme = "light";
      }
    });

    return () => {
      if (pulseTimeoutRef.current) {
        window.clearTimeout(pulseTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!hasHydratedRef.current) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  }, [values]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    if (!hasHydratedRef.current) {
      return;
    }

    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (!hasHydratedRef.current) return;
    window.localStorage.setItem(TAB_KEY, activeTab);
  }, [activeTab]);

  function triggerResultPulse() {
    setPulseResults(true);

    if (pulseTimeoutRef.current) {
      window.clearTimeout(pulseTimeoutRef.current);
    }

    pulseTimeoutRef.current = window.setTimeout(() => {
      setPulseResults(false);
    }, 850);
  }

  function updateField(
    fieldKey: CalculatorFieldKey,
    rawValue: string,
    mode: CalculatorFieldMode,
  ) {
    const sanitizedValue = sanitizeFieldValue(rawValue, mode);

    setValues((currentValues) => ({
      ...currentValues,
      [fieldKey]: sanitizedValue,
    }));
    setAnnouncement(
      "Değerler güncellendi. KDV mahsup edilerek sonuçlar yenilendi.",
    );
  }

  function handleCalculate() {
    triggerResultPulse();
    resultsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setAnnouncement("Sonuç kartları ve KDV özeti güncellendi.");
  }

  function handleReset() {
    setValues(emptyCalculatorValues);
    triggerResultPulse();
    setAnnouncement("Form temizlendi.");
  }

  function handleFillExample() {
    setValues(exampleCalculatorValues);
    triggerResultPulse();
    setAnnouncement("Örnek veriler form alanlarına yerleştirildi.");
  }

  // 3D baskı maliyetini satış formuna aktar
  function handleTransferToSales(cost: number) {
    const rounded = Math.round(cost * 100) / 100;
    setValues((prev) => ({
      ...prev,
      productCost: String(rounded),
    }));
    setActiveTab("sales");
    setAnnouncement(
      `3D baskı maliyeti (${rounded.toFixed(2)} ₺) ürün maliyeti alanına aktarıldı.`,
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const statusStyles = {
    profit: {
      badge:
        "border-[color:color-mix(in_srgb,var(--success)_24%,var(--border))] bg-[color:color-mix(in_srgb,var(--success)_14%,var(--surface-strong))] text-[var(--success)]",
      panel:
        "border-[color:color-mix(in_srgb,var(--success)_22%,var(--border))] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--success)_14%,var(--surface-strong)),var(--surface-strong))]",
      detail:
        "Kargo, komisyon ve hizmet bedeli KDV'leri mahsup edildikten sonra hâlâ artıdasınız.",
    },
    breakEven: {
      badge:
        "border-[color:color-mix(in_srgb,var(--accent-warm)_24%,var(--border))] bg-[var(--accent-warm-soft)] text-[var(--accent-warm)]",
      panel:
        "border-[color:color-mix(in_srgb,var(--accent-warm)_22%,var(--border))] bg-[linear-gradient(145deg,var(--accent-warm-soft),var(--surface-strong))]",
      detail:
        "Mahsup sonrası başa baş noktasındasınız. Küçük gider değişimleri sonucu hızla etkileyebilir.",
    },
    loss: {
      badge:
        "border-[color:color-mix(in_srgb,var(--danger)_24%,var(--border))] bg-[color:color-mix(in_srgb,var(--danger)_10%,var(--surface-strong))] text-[var(--danger)]",
      panel:
        "border-[color:color-mix(in_srgb,var(--danger)_22%,var(--border))] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--danger)_12%,var(--surface-strong)),var(--surface-strong))]",
      detail:
        "KDV mahsuplaşması sonrası zarardasınız. Fiyat, komisyon veya platform giderlerini gözden geçirin.",
    },
  }[result.status];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_var(--accent-soft),_transparent_58%)]" />
      <div className="absolute right-0 top-20 h-56 w-56 rounded-full bg-[var(--accent-warm-soft)] blur-3xl" />

      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-16 lg:pt-8">
        {/* Header */}
        <header className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]">
          <section className="surface-panel rounded-[36px] p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                Canlı Hesaplama
              </span>
              <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                KDV Mahsuplu
              </span>
              <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                3D Baskı Destekli
              </span>
            </div>

            <div className="mt-5 max-w-3xl space-y-4">
              <h1 className="text-4xl font-semibold leading-none text-[var(--foreground)] sm:text-5xl">
                Maliyet Hesaplayıcı
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                3D baskı üretim maliyetini hesapla, Trendyol satış karlılığına aktar. Gerçek net kazancını öğren.
              </p>
            </div>
          </section>

          <aside className="surface-panel rounded-[36px] p-5 sm:p-6">
            <div className="flex h-full flex-col justify-between gap-5">
              <div>
                <p className="text-sm font-semibold text-[var(--muted)]">Tema</p>
                <p className="mt-2 max-w-xs text-sm leading-6 text-[var(--muted)]">
                  Açık ve koyu görünüm arasında geçiş yapın.
                </p>
              </div>
              <ThemeToggle theme={theme} onChange={setTheme} />
            </div>
          </aside>
        </header>

        {/* Sekme Navigasyonu */}
        <nav
          className="surface-panel flex rounded-[28px] p-2"
          aria-label="Hesaplayıcı sekmeleri"
        >
          <button
            type="button"
            id="tab-sales"
            role="tab"
            aria-selected={activeTab === "sales"}
            onClick={() => setActiveTab("sales")}
            className={`flex flex-1 items-center justify-center gap-2.5 rounded-[22px] px-5 py-3.5 text-sm font-semibold transition-all duration-200 ${
              activeTab === "sales"
                ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-soft)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <span className="text-base">🛒</span>
            Satış Karlılık Hesaplayıcı
          </button>
          <button
            type="button"
            id="tab-print"
            role="tab"
            aria-selected={activeTab === "print"}
            onClick={() => setActiveTab("print")}
            className={`flex flex-1 items-center justify-center gap-2.5 rounded-[22px] px-5 py-3.5 text-sm font-semibold transition-all duration-200 ${
              activeTab === "print"
                ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-soft)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <span className="text-base">🖨️</span>
            3D Baskı Maliyet Hesaplayıcı
          </button>
        </nav>

        {/* 3D Baskı Sekmesi */}
        {activeTab === "print" && (
          <PrintCostDashboard onTransferToSales={handleTransferToSales} />
        )}

        {/* Satış Karlılık Sekmesi */}
        {activeTab === "sales" && (
          <>
            {values.productCost && (
              <div className="rounded-[24px] border border-[color:color-mix(in_srgb,var(--accent)_24%,var(--border))] bg-[var(--accent-soft)] px-5 py-3.5 text-sm text-[var(--accent)]">
                <span className="font-semibold">ℹ️ Son işlem:</span>{" "}
                {announcement}
              </div>
            )}

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
              <form
                className="surface-panel rounded-[36px] p-5 sm:p-6"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleCalculate();
                }}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-semibold text-[var(--foreground)]">
                      Hesaplama Formu
                    </h2>
                    <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">
                      Alanlar değiştikçe sistem satış KDV&apos;sinden kargo, komisyon,
                      alış ve hizmet bedeli KDV&apos;lerini düşerek net sonucu hesaplar.
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm leading-6 text-[var(--muted)]">
                    <span className="font-semibold text-[var(--foreground)]">
                      Son işlem:
                    </span>{" "}
                    {announcement}
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white shadow-lg shadow-[var(--accent-soft)] transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    Hesapla
                  </button>
                  <button
                    type="button"
                    onClick={handleFillExample}
                    className="inline-flex h-12 items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--accent-warm)_24%,var(--border))] bg-[var(--accent-warm-soft)] px-5 text-sm font-semibold text-[var(--accent-warm)] transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    Örnek Veri Doldur
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-5 text-sm font-semibold text-[var(--foreground)] transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    Temizle
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("print")}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[color:color-mix(in_srgb,var(--accent)_24%,var(--border))] bg-[var(--accent-soft)] px-5 text-sm font-semibold text-[var(--accent)] transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    🖨️ 3D Baskı Maliyet
                  </button>
                </div>

                <div className="mt-6 space-y-6">
                  {calculatorFieldGroups.map((group) => (
                    <fieldset
                      key={group.title}
                      className="rounded-[30px] border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface-strong)_94%,transparent)] p-4 sm:p-5"
                    >
                      <legend className="px-3 text-lg font-semibold text-[var(--foreground)]">
                        {group.title}
                      </legend>
                      <p className="px-1 pb-4 text-sm leading-6 text-[var(--muted)]">
                        {group.description}
                      </p>
                      <div className="grid gap-4 md:grid-cols-2">
                        {group.fields.map((field) => (
                          <CalculatorField
                            key={field.key}
                            field={field}
                            value={values[field.key]}
                            onChange={(value, mode) =>
                              updateField(field.key, value, mode)
                            }
                          />
                        ))}
                      </div>
                    </fieldset>
                  ))}
                </div>
              </form>

              <section
                ref={resultsRef}
                className={`surface-panel rounded-[36px] p-5 transition-all duration-300 sm:p-6 xl:sticky xl:top-8 xl:h-fit ${
                  pulseResults
                    ? "scale-[1.01] border-[color:color-mix(in_srgb,var(--accent)_30%,var(--border))] shadow-[0_22px_52px_rgba(37,99,235,0.18)]"
                    : ""
                }`}
                aria-live="polite"
              >
                <div
                  className={`rounded-[30px] border p-5 ${statusStyles.panel} transition-colors duration-200`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${statusStyles.badge}`}
                    >
                      Durum: {getStatusLabel(result.status)}
                    </span>
                    <span className="text-sm font-medium text-[var(--muted)]">
                      Net Kar Marjı %{formatPercent(result.profitMargin)}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                    <div>
                      <p className="text-sm font-semibold text-[var(--muted)]">
                        Net Elde Kalan
                      </p>
                      <p
                        className={`metric-value mt-3 text-4xl font-semibold leading-none sm:text-5xl ${
                          isNegative(result.netRevenue)
                            ? "text-[var(--danger)]"
                            : "text-[var(--foreground)]"
                        }`}
                      >
                        {formatCurrency(result.netRevenue)}
                      </p>
                    </div>
                    <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm leading-6 text-[var(--muted)]">
                      {statusStyles.detail}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <ResultMetricCard
                    title="Komisyon Tutarı"
                    value={formatCurrency(result.commissionAmount)}
                    description="Satış fiyatı üzerinden hesaplanan toplam komisyon."
                    tone="neutral"
                  />
                  <ResultMetricCard
                    title="Hizmet Bedeli"
                    value={formatCurrency(result.numericValues.serviceFee)}
                    description="Platform veya operasyon için girilen sabit bedel."
                    tone="neutral"
                  />
                  <ResultMetricCard
                    title="Satıştan Oluşan KDV"
                    value={formatCurrency(result.saleVatAmount)}
                    description="Satış tutarının içinden ayrıştırılan KDV payı."
                    tone="accent"
                  />
                  <ResultMetricCard
                    title="Ödenecek KDV"
                    value={formatCurrency(result.payableVatAmount)}
                    description="Kargo, komisyon ve diğer mahsuplar sonrası kalan KDV."
                    tone={isNegative(result.payableVatAmount) ? "positive" : "warm"}
                  />
                  <ResultMetricCard
                    title="Toplam Gider"
                    value={formatCurrency(result.totalExpenses)}
                    description="Mahsup sonrası ödenecek KDV dahil toplam maliyet."
                    tone="warm"
                  />
                  <ResultMetricCard
                    title="Net Kar"
                    value={formatCurrency(result.netProfit)}
                    description="Tüm giderler ve KDV netleştirmesi sonrası kalan tutar."
                    tone={isNegative(result.netProfit) ? "negative" : "positive"}
                    emphasize
                  />
                  <ResultMetricCard
                    title="Net Elde Kalan"
                    value={formatCurrency(result.netRevenue)}
                    description="Satış sonrası hesabınıza kalan net bakiye."
                    tone={isNegative(result.netRevenue) ? "negative" : "accent"}
                  />
                  <ResultMetricCard
                    title="Kar Marjı"
                    value={`%${formatPercent(result.profitMargin)}`}
                    description="Net karın satış fiyatına oranı."
                    tone={isNegative(result.profitMargin) ? "negative" : "accent"}
                  />
                </div>
              </section>
            </section>

            <VatBreakdownBoard result={result} />

            <FormulaAccordion result={result} />

            <section className="surface-panel rounded-[32px] p-5 sm:p-6">
              <h2 className="text-2xl font-semibold text-[var(--foreground)]">
                Bilgilendirme
              </h2>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                Bu hesaplama tahmini amaçlıdır, resmi muhasebe sonucu yerine geçmez.
                KDV mahsupları fatura tipine, kategoriye ve muhasebe politikanıza göre
                değişebilir. Nihai kararlar için güncel sözleşme ve muhasebe
                kayıtlarınızı esas alın.
              </p>
            </section>
          </>
        )}
      </main>

      {/* Mobil alt bar — sadece satış sekmesinde */}
      {activeTab === "sales" && (
        <div className="fixed inset-x-4 bottom-4 z-40 xl:hidden">
          <button
            type="button"
            onClick={handleCalculate}
            className="surface-panel-strong flex w-full items-center justify-between gap-4 rounded-[28px] px-5 py-4 text-left"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Hızlı Özet
              </p>
              <p className="metric-value mt-2 text-2xl font-semibold text-[var(--foreground)]">
                {formatCurrency(result.netProfit)}
              </p>
            </div>
            <div className="text-right">
              <p
                className={`text-sm font-semibold ${
                  result.status === "loss"
                    ? "text-[var(--danger)]"
                    : "text-[var(--accent)]"
                }`}
              >
                {getStatusLabel(result.status)}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                KDV özeti ve sonuçlar
              </p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
