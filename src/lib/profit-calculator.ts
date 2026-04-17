export type CalculatorFieldKey =
  | "salePrice"
  | "productCost"
  | "shippingCost"
  | "commissionRate"
  | "vatRate"
  | "serviceFee"
  | "extraCosts"
  | "adCost"
  | "discountAmount";

export type CalculatorFieldMode = "currency" | "percent";

export type CalculatorFormValues = Record<CalculatorFieldKey, string>;

export type CalculatorStatus = "profit" | "breakEven" | "loss";

export type CalculatorResult = {
  commissionAmount: number;
  saleVatAmount: number;
  productVatAmount: number;
  shippingVatAmount: number;
  commissionVatAmount: number;
  serviceFeeVatAmount: number;
  deductibleVatAmount: number;
  payableVatAmount: number;
  totalExpenses: number;
  netRevenue: number;
  netProfit: number;
  profitMargin: number;
  status: CalculatorStatus;
  numericValues: Record<CalculatorFieldKey, number>;
};

export type CalculatorFieldDefinition = {
  key: CalculatorFieldKey;
  label: string;
  hint: string;
  placeholder: string;
  mode: CalculatorFieldMode;
  required?: boolean;
};

export type CalculatorFieldGroup = {
  title: string;
  description: string;
  fields: CalculatorFieldDefinition[];
};

const percentFields: CalculatorFieldKey[] = ["commissionRate", "vatRate"];

export const emptyCalculatorValues: CalculatorFormValues = {
  salePrice: "",
  productCost: "",
  shippingCost: "",
  commissionRate: "",
  vatRate: "",
  serviceFee: "",
  extraCosts: "",
  adCost: "",
  discountAmount: "",
};

export const exampleCalculatorValues: CalculatorFormValues = {
  salePrice: "500",
  productCost: "180",
  shippingCost: "45",
  commissionRate: "21",
  vatRate: "20",
  serviceFee: "13.19",
  extraCosts: "10",
  adCost: "15",
  discountAmount: "0",
};

export const calculatorFieldGroups: CalculatorFieldGroup[] = [
  {
    title: "Temel Değerler",
    description: "Satış tutarı ve zorunlu maliyet kalemlerini girin.",
    fields: [
      {
        key: "salePrice",
        label: "Satış Fiyatı",
        hint: "Müşteriden tahsil edilen satış tutarı.",
        placeholder: "500",
        mode: "currency",
        required: true,
      },
      {
        key: "productCost",
        label: "Ürün Maliyeti",
        hint: "Ürünü size kaça mal ettiğini girin.",
        placeholder: "180",
        mode: "currency",
        required: true,
      },
      {
        key: "shippingCost",
        label: "Kargo Maliyeti",
        hint: "Paketleme ve taşıma dahil kargo gideri.",
        placeholder: "45",
        mode: "currency",
        required: true,
      },
      {
        key: "commissionRate",
        label: "Trendyol Komisyon Oranı",
        hint: "Yüzde alanları otomatik olarak 0-100 arasında tutulur.",
        placeholder: "21",
        mode: "percent",
        required: true,
      },
      {
        key: "vatRate",
        label: "KDV Oranı",
        hint: "KDV payı tutarların içinden ayrıştırılır.",
        placeholder: "20",
        mode: "percent",
        required: true,
      },
    ],
  },
  {
    title: "Pazar Yeri Giderleri",
    description:
      "Hizmet bedeli ve diğer masraflar toplam gider ile ödenecek KDV hesabına etki eder.",
    fields: [
      {
        key: "serviceFee",
        label: "Hizmet Bedeli",
        hint: "Panel, operasyon veya sabit platform bedeli.",
        placeholder: "13.19",
        mode: "currency",
      },
      {
        key: "extraCosts",
        label: "Ek Giderler",
        hint: "Paket, etiket, operasyon gibi ilave masraflar.",
        placeholder: "10",
        mode: "currency",
      },
      {
        key: "adCost",
        label: "Reklam Gideri",
        hint: "Sponsorlu ürün ve kampanya maliyeti.",
        placeholder: "15",
        mode: "currency",
      },
      {
        key: "discountAmount",
        label: "İndirim Tutarı",
        hint: "Kupon veya kampanya nedeniyle üstlenilen indirim.",
        placeholder: "0",
        mode: "currency",
      },
    ],
  },
];

export function sanitizeFieldValue(
  rawValue: string,
  mode: CalculatorFieldMode,
): string {
  const normalized = rawValue.replace(",", ".").replace(/[^\d.]/g, "");

  const firstDotIndex = normalized.indexOf(".");
  const cleaned =
    firstDotIndex === -1
      ? normalized
      : `${normalized.slice(0, firstDotIndex + 1)}${normalized
          .slice(firstDotIndex + 1)
          .replace(/\./g, "")}`;

  if (!cleaned) {
    return "";
  }

  const numericValue = Number.parseFloat(cleaned);

  if (!Number.isFinite(numericValue)) {
    return "";
  }

  if (mode === "percent") {
    return String(Math.min(Math.max(numericValue, 0), 100));
  }

  return numericValue < 0 ? "0" : cleaned;
}

export function hydrateStoredValues(
  storedValues: unknown,
): CalculatorFormValues | null {
  if (!storedValues || typeof storedValues !== "object") {
    return null;
  }

  const mergedValues = { ...emptyCalculatorValues };

  for (const key of Object.keys(emptyCalculatorValues) as CalculatorFieldKey[]) {
    const rawValue = (storedValues as Record<string, unknown>)[key];

    if (typeof rawValue === "string") {
      mergedValues[key] = sanitizeFieldValue(
        rawValue,
        percentFields.includes(key) ? "percent" : "currency",
      );
    }
  }

  return mergedValues;
}

export function parseNumericValue(value: string): number {
  const parsed = Number.parseFloat(value.replace(",", "."));

  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return parsed;
}

export function extractIncludedVat(amount: number, vatRate: number): number {
  if (amount <= 0 || vatRate <= 0) {
    return 0;
  }

  return amount * (vatRate / (100 + vatRate));
}

export function calculateProfit(
  formValues: CalculatorFormValues,
): CalculatorResult {
  const numericValues = {
    salePrice: parseNumericValue(formValues.salePrice),
    productCost: parseNumericValue(formValues.productCost),
    shippingCost: parseNumericValue(formValues.shippingCost),
    commissionRate: parseNumericValue(formValues.commissionRate),
    vatRate: parseNumericValue(formValues.vatRate),
    serviceFee: parseNumericValue(formValues.serviceFee),
    extraCosts: parseNumericValue(formValues.extraCosts),
    adCost: parseNumericValue(formValues.adCost),
    discountAmount: parseNumericValue(formValues.discountAmount),
  };

  const commissionAmount =
    numericValues.salePrice * (numericValues.commissionRate / 100);
  const saleVatAmount = extractIncludedVat(
    numericValues.salePrice,
    numericValues.vatRate,
  );
  const productVatAmount = extractIncludedVat(
    numericValues.productCost,
    numericValues.vatRate,
  );
  const shippingVatAmount = extractIncludedVat(
    numericValues.shippingCost,
    numericValues.vatRate,
  );
  const commissionVatAmount = extractIncludedVat(
    commissionAmount,
    numericValues.vatRate,
  );
  const serviceFeeVatAmount = extractIncludedVat(
    numericValues.serviceFee,
    numericValues.vatRate,
  );
  const deductibleVatAmount =
    productVatAmount +
    shippingVatAmount +
    commissionVatAmount +
    serviceFeeVatAmount;
  const payableVatAmount = saleVatAmount - deductibleVatAmount;
  const totalExpenses =
    numericValues.productCost +
    numericValues.shippingCost +
    commissionAmount +
    numericValues.serviceFee +
    numericValues.extraCosts +
    numericValues.adCost +
    numericValues.discountAmount +
    payableVatAmount;
  const netRevenue = numericValues.salePrice - totalExpenses;
  const netProfit = netRevenue;
  const profitMargin =
    numericValues.salePrice > 0
      ? (netProfit / numericValues.salePrice) * 100
      : 0;

  const epsilon = 0.005;
  const status: CalculatorStatus =
    netProfit > epsilon ? "profit" : netProfit < -epsilon ? "loss" : "breakEven";

  return {
    commissionAmount,
    saleVatAmount,
    productVatAmount,
    shippingVatAmount,
    commissionVatAmount,
    serviceFeeVatAmount,
    deductibleVatAmount,
    payableVatAmount,
    totalExpenses,
    netRevenue,
    netProfit,
    profitMargin,
    status,
    numericValues,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function getStatusLabel(status: CalculatorStatus): string {
  switch (status) {
    case "profit":
      return "Karlı";
    case "loss":
      return "Zararda";
    default:
      return "Başa Baş";
  }
}

export function isNegative(value: number): boolean {
  return value < -0.005;
}
