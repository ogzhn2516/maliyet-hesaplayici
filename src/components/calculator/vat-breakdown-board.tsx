import {
  formatCurrency,
  getStatusLabel,
  isNegative,
  type CalculatorResult,
} from "@/lib/profit-calculator";

type VatBreakdownBoardProps = {
  result: CalculatorResult;
};

export function VatBreakdownBoard({ result }: VatBreakdownBoardProps) {
  const payableVatTone = isNegative(result.payableVatAmount)
    ? "text-emerald-700"
    : "text-amber-900";
  const profitCircleClass = isNegative(result.netProfit)
    ? "bg-[#d84b60] shadow-[0_18px_40px_rgba(216,75,96,0.28)]"
    : "bg-[#f38b1a] shadow-[0_18px_40px_rgba(243,139,26,0.35)]";

  return (
    <section className="rounded-[34px] border border-[#f1d9ac] bg-[linear-gradient(180deg,#fff6e8_0%,#f8ecd6_100%)] p-4 text-[#3e311b] shadow-[0_22px_50px_rgba(171,125,45,0.18)] sm:p-6">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_140px] lg:items-start">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricTile
            title="Komisyon"
            value={formatCurrency(result.commissionAmount)}
          />
          <MetricTile
            title="Hizmet Bedeli"
            value={formatCurrency(result.numericValues.serviceFee)}
          />
          <MetricTile
            title="İndirilebilir KDV"
            value={formatCurrency(result.deductibleVatAmount)}
          />
          <MetricTile
            title="Ödenecek KDV"
            value={formatCurrency(result.payableVatAmount)}
            valueClassName={payableVatTone}
          />
        </div>

        <div
          className={`mx-auto flex h-32 w-32 flex-col items-center justify-center rounded-full text-center text-white ${profitCircleClass}`}
        >
          <span className="text-sm font-semibold tracking-[0.16em] uppercase">
            {getStatusLabel(result.status)}
          </span>
          <span className="metric-value mt-2 text-2xl font-semibold text-white">
            {formatCurrency(result.netProfit)}
          </span>
        </div>
      </div>

      <div className="mt-5 rounded-[28px] border border-[#ecd2a0] bg-[rgba(255,249,238,0.72)] p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <BreakdownTile
            title="Satıştan Oluşan KDV"
            value={formatCurrency(result.saleVatAmount)}
          />
          <BreakdownTile
            title="Alıştan Oluşan KDV"
            value={formatCurrency(result.productVatAmount)}
          />
          <BreakdownTile
            title="Kargodan Oluşan KDV"
            value={formatCurrency(result.shippingVatAmount)}
          />
          <BreakdownTile
            title="Komisyondan Oluşan KDV"
            value={formatCurrency(result.commissionVatAmount)}
          />
          <BreakdownTile
            title="Hizmet Bedelinden Oluşan KDV"
            value={formatCurrency(result.serviceFeeVatAmount)}
          />
          <BreakdownTile
            title="Ödenecek KDV"
            value={formatCurrency(result.payableVatAmount)}
            emphasized
          />
        </div>
      </div>
    </section>
  );
}

type MetricTileProps = {
  title: string;
  value: string;
  valueClassName?: string;
};

function MetricTile({ title, value, valueClassName }: MetricTileProps) {
  return (
    <article className="rounded-[24px] bg-[#dfe3ea] px-4 py-5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
      <p className="text-sm font-medium">{title}</p>
      <p className={`metric-value mt-3 text-3xl font-semibold ${valueClassName ?? "text-[#1f2937]"}`}>
        {value}
      </p>
    </article>
  );
}

type BreakdownTileProps = {
  title: string;
  value: string;
  emphasized?: boolean;
};

function BreakdownTile({ title, value, emphasized = false }: BreakdownTileProps) {
  return (
    <article
      className={`rounded-[22px] border px-4 py-5 text-center ${
        emphasized
          ? "border-[#ebb96a] bg-[#fff2d8]"
          : "border-[#eed8ad] bg-transparent"
      }`}
    >
      <p className="min-h-12 text-sm font-medium leading-5">{title}</p>
      <p
        className={`metric-value mt-4 text-2xl font-semibold ${
          emphasized ? "text-[#9a5b0b]" : "text-[#2f2412]"
        }`}
      >
        {value}
      </p>
    </article>
  );
}
