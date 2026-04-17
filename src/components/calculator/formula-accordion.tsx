import {
  formatCurrency,
  formatPercent,
  getStatusLabel,
  type CalculatorResult,
} from "@/lib/profit-calculator";

type FormulaAccordionProps = {
  result: CalculatorResult;
};

export function FormulaAccordion({ result }: FormulaAccordionProps) {
  const { numericValues } = result;

  return (
    <details className="surface-panel rounded-[32px] p-5 sm:p-6">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-2xl font-semibold text-[var(--foreground)]">
        <span>Hesaplama Formülü</span>
        <span className="rounded-full border border-[var(--border)] px-3 py-1 text-sm font-medium text-[var(--muted)]">
          Aç / Kapat
        </span>
      </summary>

      <div className="mt-6 grid gap-6 border-t border-[var(--border)] pt-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
            <p className="text-sm font-semibold text-[var(--muted)]">
              Canlı formül dökümü
            </p>
            <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--foreground)]">
              <p>
                Komisyon Tutarı = {formatCurrency(numericValues.salePrice)} x %
                {formatPercent(numericValues.commissionRate)} ={" "}
                <strong>{formatCurrency(result.commissionAmount)}</strong>
              </p>
              <p>
                Satıştan Oluşan KDV = {formatCurrency(numericValues.salePrice)} x %
                {formatPercent(numericValues.vatRate)} / (100 + %
                {formatPercent(numericValues.vatRate)}) ={" "}
                <strong>{formatCurrency(result.saleVatAmount)}</strong>
              </p>
              <p>
                Kargodan Oluşan KDV ={" "}
                {formatCurrency(numericValues.shippingCost)} x %
                {formatPercent(numericValues.vatRate)} / (100 + %
                {formatPercent(numericValues.vatRate)}) ={" "}
                <strong>{formatCurrency(result.shippingVatAmount)}</strong>
              </p>
              <p>
                Komisyondan Oluşan KDV ={" "}
                {formatCurrency(result.commissionAmount)} x %
                {formatPercent(numericValues.vatRate)} / (100 + %
                {formatPercent(numericValues.vatRate)}) ={" "}
                <strong>{formatCurrency(result.commissionVatAmount)}</strong>
              </p>
              <p>
                Hizmet Bedelinden Oluşan KDV ={" "}
                {formatCurrency(numericValues.serviceFee)} x %
                {formatPercent(numericValues.vatRate)} / (100 + %
                {formatPercent(numericValues.vatRate)}) ={" "}
                <strong>{formatCurrency(result.serviceFeeVatAmount)}</strong>
              </p>
              <p>
                Ödenecek KDV = {formatCurrency(result.saleVatAmount)} - (
                {formatCurrency(result.productVatAmount)} +{" "}
                {formatCurrency(result.shippingVatAmount)} +{" "}
                {formatCurrency(result.commissionVatAmount)} +{" "}
                {formatCurrency(result.serviceFeeVatAmount)}) ={" "}
                <strong>{formatCurrency(result.payableVatAmount)}</strong>
              </p>
              <p>
                Toplam Gider = {formatCurrency(numericValues.productCost)} +{" "}
                {formatCurrency(numericValues.shippingCost)} +{" "}
                {formatCurrency(result.commissionAmount)} +{" "}
                {formatCurrency(numericValues.serviceFee)} +{" "}
                {formatCurrency(numericValues.extraCosts)} +{" "}
                {formatCurrency(numericValues.adCost)} +{" "}
                {formatCurrency(numericValues.discountAmount)} +{" "}
                {formatCurrency(result.payableVatAmount)} ={" "}
                <strong>{formatCurrency(result.totalExpenses)}</strong>
              </p>
              <p>
                Net Elde Kalan = {formatCurrency(numericValues.salePrice)} -{" "}
                {formatCurrency(result.totalExpenses)} ={" "}
                <strong>{formatCurrency(result.netRevenue)}</strong>
              </p>
              <p>
                Kar Marjı ={" "}
                {numericValues.salePrice > 0
                  ? `${formatCurrency(result.netProfit)} / ${formatCurrency(
                      numericValues.salePrice,
                    )} x 100`
                  : "Satış fiyatı 0 olduğu için 0"}{" "}
                = <strong>%{formatPercent(result.profitMargin)}</strong>
              </p>
            </div>
          </div>

          <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
            <p className="text-sm font-semibold text-[var(--muted)]">Notlar</p>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-[var(--foreground)]">
              <li>KDV artık tutarların üstüne eklenmiyor, içinden ayrıştırılıyor.</li>
              <li>
                Ödenecek KDV; satıştan oluşan KDV’den alış, kargo, komisyon ve
                hizmet bedeli KDV’leri düşülerek hesaplanır.
              </li>
              <li>Boş kalan alanlar 0 olarak değerlendirilir.</li>
              <li>
                Satış fiyatı 0 ise kar marjı hata vermeden otomatik olarak 0
                gösterilir.
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
          <p className="text-sm font-semibold text-[var(--muted)]">Anlık özet</p>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm text-[var(--muted)]">Durum</p>
              <p className="metric-value mt-2 text-3xl font-semibold">
                {getStatusLabel(result.status)}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--muted)]">Ödenecek KDV</p>
              <p className="metric-value mt-2 text-3xl font-semibold">
                {formatCurrency(result.payableVatAmount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--muted)]">Net Kar</p>
              <p className="metric-value mt-2 text-3xl font-semibold">
                {formatCurrency(result.netProfit)}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--muted)]">Kar Marjı</p>
              <p className="metric-value mt-2 text-3xl font-semibold">
                %{formatPercent(result.profitMargin)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </details>
  );
}
