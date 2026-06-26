export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCurrencyDetailed(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function parseNumber(value: string, fallback = 0): number {
  const parsed = parseFloat(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const CALCULATOR_DISCLAIMER =
  "Information and interactive calculators are made available as self-help tools for your independent use and are not intended to provide investment or tax advice. We cannot and do not guarantee their applicability or accuracy in regards to your individual circumstances. All examples are hypothetical and for illustrative purposes. We encourage you to seek personalized advice from qualified professionals regarding all personal finance issues.";

export const LOCAL_CALCULATOR_NOTE =
  "All calculations run locally in your browser using standard financial formulas. No external APIs, iframes, or third-party services are used.";
