// ─── Tip Tanımları ───────────────────────────────────────────────────────────

export type ExtraCostRow = {
  id: string;
  label: string;
  amount: string;
};

export type PrintCostFormValues = {
  // Filament
  filamentPrice: string;
  spoolWeightGr: string;
  printWeightGr: string;
  supportWeightGr: string;
  wasteRate: string;

  // Elektrik
  printHours: string;
  preheatHours: string;
  printerPowerW: string;
  electricityUnitPrice: string;

  // Makine
  printerPurchasePrice: string;
  printerLifetimeHours: string;
  maintenanceCostPerPrint: string;

  // İşçilik
  designMinutes: string;
  prepMinutes: string;
  cleanupMinutes: string;
  assemblyMinutes: string;
  packagingMinutes: string;
  hourlyLaborRate: string;

  // Paketleme
  boxCost: string;
  wrappingCost: string;
  labelCost: string;
  tapeCost: string;
  packagingOtherCost: string;

  // Ek
  adCost: string;
  failedPrintRate: string;
  generalOverhead: string;
  testPrintCost: string;

  // Hedef kar
  targetMarginRate: string;
};

export type PrintCostResult = {
  // Ara sonuçlar
  gramCost: number;
  correctedGrams: number;
  filamentCost: number;
  totalPrintHours: number;
  electricityKwh: number;
  electricityCost: number;
  hourlyAmortization: number;
  machineCost: number;
  totalLaborMinutes: number;
  laborCost: number;
  packagingCost: number;
  extraCostsTotal: number;

  // Temel toplam
  baseTotalCost: number;

  // Fire payı uygulanmış toplam
  totalProductionCost: number;

  // Önerilen fiyat
  suggestedSalePrice: number;
};

// ─── Sabitler ────────────────────────────────────────────────────────────────

export const emptyPrintCostValues: PrintCostFormValues = {
  filamentPrice: "",
  spoolWeightGr: "",
  printWeightGr: "",
  supportWeightGr: "",
  wasteRate: "",
  printHours: "",
  preheatHours: "",
  printerPowerW: "",
  electricityUnitPrice: "",
  printerPurchasePrice: "",
  printerLifetimeHours: "",
  maintenanceCostPerPrint: "",
  designMinutes: "",
  prepMinutes: "",
  cleanupMinutes: "",
  assemblyMinutes: "",
  packagingMinutes: "",
  hourlyLaborRate: "",
  boxCost: "",
  wrappingCost: "",
  labelCost: "",
  tapeCost: "",
  packagingOtherCost: "",
  adCost: "",
  failedPrintRate: "",
  generalOverhead: "",
  testPrintCost: "",
  targetMarginRate: "",
};

export const examplePrintCostValues: PrintCostFormValues = {
  filamentPrice: "550",
  spoolWeightGr: "1000",
  printWeightGr: "85",
  supportWeightGr: "12",
  wasteRate: "3",
  printHours: "4.5",
  preheatHours: "0.25",
  printerPowerW: "200",
  electricityUnitPrice: "6.5",
  printerPurchasePrice: "15000",
  printerLifetimeHours: "5000",
  maintenanceCostPerPrint: "8",
  designMinutes: "20",
  prepMinutes: "10",
  cleanupMinutes: "15",
  assemblyMinutes: "0",
  packagingMinutes: "10",
  hourlyLaborRate: "150",
  boxCost: "8",
  wrappingCost: "3",
  labelCost: "1.5",
  tapeCost: "0.5",
  packagingOtherCost: "2",
  adCost: "20",
  failedPrintRate: "5",
  generalOverhead: "10",
  testPrintCost: "0",
  targetMarginRate: "30",
};

// ─── Yardımcı Fonksiyonlar ───────────────────────────────────────────────────

export function parsePositive(value: string): number {
  const parsed = parseFloat(value.replace(",", "."));
  if (!isFinite(parsed) || parsed < 0) return 0;
  return parsed;
}

export function sanitizePrintValue(
  rawValue: string,
  isPercent = false,
): string {
  const normalized = rawValue.replace(",", ".").replace(/[^\d.]/g, "");
  const firstDot = normalized.indexOf(".");
  const cleaned =
    firstDot === -1
      ? normalized
      : `${normalized.slice(0, firstDot + 1)}${normalized.slice(firstDot + 1).replace(/\./g, "")}`;

  if (!cleaned) return "";
  const num = parseFloat(cleaned);
  if (!isFinite(num)) return "";
  if (isPercent) return String(Math.min(Math.max(num, 0), 100));
  return num < 0 ? "0" : cleaned;
}

export function hydratePrintCostValues(
  stored: unknown,
): PrintCostFormValues | null {
  if (!stored || typeof stored !== "object") return null;
  const merged = { ...emptyPrintCostValues };
  const percentKeys: (keyof PrintCostFormValues)[] = [
    "wasteRate",
    "failedPrintRate",
    "targetMarginRate",
  ];
  for (const key of Object.keys(emptyPrintCostValues) as (keyof PrintCostFormValues)[]) {
    const raw = (stored as Record<string, unknown>)[key];
    if (typeof raw === "string") {
      merged[key] = sanitizePrintValue(raw, percentKeys.includes(key));
    }
  }
  return merged;
}

// ─── Hesaplama Fonksiyonları ─────────────────────────────────────────────────

export function calculateFilamentCost(values: PrintCostFormValues) {
  const filamentPrice = parsePositive(values.filamentPrice);
  const spoolWeight = parsePositive(values.spoolWeightGr);
  const printWeight = parsePositive(values.printWeightGr);
  const supportWeight = parsePositive(values.supportWeightGr);
  const wasteRate = parsePositive(values.wasteRate);

  const gramCost = spoolWeight > 0 ? filamentPrice / spoolWeight : 0;
  const totalGrams = printWeight + supportWeight;
  const correctedGrams = totalGrams * (1 + wasteRate / 100);
  const filamentCost = correctedGrams * gramCost;

  return { gramCost, correctedGrams, filamentCost };
}

export function calculateElectricityCost(values: PrintCostFormValues) {
  const printHours = parsePositive(values.printHours);
  const preheatHours = parsePositive(values.preheatHours);
  const printerPowerW = parsePositive(values.printerPowerW);
  const electricityUnitPrice = parsePositive(values.electricityUnitPrice);

  const totalPrintHours = printHours + preheatHours;
  const kw = printerPowerW / 1000;
  const electricityKwh = kw * totalPrintHours;
  const electricityCost = electricityKwh * electricityUnitPrice;

  return { totalPrintHours, electricityKwh, electricityCost };
}

export function calculateMachineCost(values: PrintCostFormValues) {
  const printerPurchasePrice = parsePositive(values.printerPurchasePrice);
  const printerLifetimeHours = parsePositive(values.printerLifetimeHours);
  const maintenanceCostPerPrint = parsePositive(values.maintenanceCostPerPrint);
  const printHours = parsePositive(values.printHours);
  const preheatHours = parsePositive(values.preheatHours);

  const hourlyAmortization =
    printerLifetimeHours > 0 ? printerPurchasePrice / printerLifetimeHours : 0;
  const totalHours = printHours + preheatHours;
  const amortizationCost = hourlyAmortization * totalHours;
  const machineCost = amortizationCost + maintenanceCostPerPrint;

  return { hourlyAmortization, machineCost };
}

export function calculateLaborCost(values: PrintCostFormValues) {
  const designMinutes = parsePositive(values.designMinutes);
  const prepMinutes = parsePositive(values.prepMinutes);
  const cleanupMinutes = parsePositive(values.cleanupMinutes);
  const assemblyMinutes = parsePositive(values.assemblyMinutes);
  const packagingMinutes = parsePositive(values.packagingMinutes);
  const hourlyLaborRate = parsePositive(values.hourlyLaborRate);

  const totalLaborMinutes =
    designMinutes +
    prepMinutes +
    cleanupMinutes +
    assemblyMinutes +
    packagingMinutes;
  const laborCost = (totalLaborMinutes / 60) * hourlyLaborRate;

  return { totalLaborMinutes, laborCost };
}

export function calculatePackagingCost(values: PrintCostFormValues) {
  const boxCost = parsePositive(values.boxCost);
  const wrappingCost = parsePositive(values.wrappingCost);
  const labelCost = parsePositive(values.labelCost);
  const tapeCost = parsePositive(values.tapeCost);
  const packagingOtherCost = parsePositive(values.packagingOtherCost);

  return {
    packagingCost:
      boxCost + wrappingCost + labelCost + tapeCost + packagingOtherCost,
  };
}

export function calculateExtraCosts(
  values: PrintCostFormValues,
  extraRows: ExtraCostRow[],
) {
  const adCost = parsePositive(values.adCost);
  const generalOverhead = parsePositive(values.generalOverhead);
  const testPrintCost = parsePositive(values.testPrintCost);
  const dynamicTotal = extraRows.reduce(
    (sum, row) => sum + parsePositive(row.amount),
    0,
  );

  return {
    extraCostsTotal: adCost + generalOverhead + testPrintCost + dynamicTotal,
  };
}

export function calculateFailedPrintBuffer(
  baseCost: number,
  failedPrintRate: string,
) {
  const rate = parsePositive(failedPrintRate);
  return baseCost * (rate / 100);
}

export function calculateTotalProductionCost(
  values: PrintCostFormValues,
  extraRows: ExtraCostRow[],
): PrintCostResult {
  const { gramCost, correctedGrams, filamentCost } =
    calculateFilamentCost(values);
  const { totalPrintHours, electricityKwh, electricityCost } =
    calculateElectricityCost(values);
  const { hourlyAmortization, machineCost } = calculateMachineCost(values);
  const { totalLaborMinutes, laborCost } = calculateLaborCost(values);
  const { packagingCost } = calculatePackagingCost(values);
  const { extraCostsTotal } = calculateExtraCosts(values, extraRows);

  const baseTotalCost =
    filamentCost +
    electricityCost +
    machineCost +
    laborCost +
    packagingCost +
    extraCostsTotal;

  const failedBuffer = calculateFailedPrintBuffer(
    baseTotalCost,
    values.failedPrintRate,
  );
  const totalProductionCost = baseTotalCost + failedBuffer;

  return {
    gramCost,
    correctedGrams,
    filamentCost,
    totalPrintHours,
    electricityKwh,
    electricityCost,
    hourlyAmortization,
    machineCost,
    totalLaborMinutes,
    laborCost,
    packagingCost,
    extraCostsTotal,
    baseTotalCost,
    totalProductionCost,
    suggestedSalePrice: calculateSuggestedSalePrice(
      totalProductionCost,
      values.targetMarginRate,
    ),
  };
}

export function calculateSuggestedSalePrice(
  totalCost: number,
  targetMarginRate: string,
): number {
  const margin = parsePositive(targetMarginRate);
  if (margin >= 100) return totalCost * 10;
  if (margin <= 0) return totalCost;
  return totalCost / (1 - margin / 100);
}

// ─── Format Yardımcıları ─────────────────────────────────────────────────────

export function formatTL(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatGram(value: number): string {
  return `${new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2 }).format(value)} g`;
}

export function formatHour(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m} dk`;
  if (m === 0) return `${h} sa`;
  return `${h} sa ${m} dk`;
}
