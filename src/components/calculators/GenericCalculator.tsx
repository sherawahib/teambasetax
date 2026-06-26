"use client";

import { useMemo, useState } from "react";
import CalculatorLayout, { CalcField, CalcResult, CalcSelect } from "@/components/calculators/CalculatorLayout";
import { computeFunctions } from "@/lib/calculators/compute/all";
import { calculatorDefinitions } from "@/lib/calculators/definitions";
import type { ResultFormat } from "@/lib/calculators/types";
import {
  formatCurrency,
  formatCurrencyDetailed,
  formatPercent,
  parseNumber,
} from "@/lib/calculators/format";

type Props = {
  slug: string;
};

function formatResult(value: number | string, format: ResultFormat): string {
  if (typeof value === "string") return value;
  switch (format) {
    case "currency":
      return formatCurrency(value);
    case "currency-detailed":
      return formatCurrencyDetailed(value);
    case "percent":
      return formatPercent(value);
    case "months":
      return `${Math.round(value)} months`;
    case "years":
      return `${value.toFixed(1)} years`;
    case "number":
      return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
    default:
      return String(value);
  }
}

export default function GenericCalculator({ slug }: Props) {
  const definition = calculatorDefinitions[slug];
  const compute = computeFunctions[slug];

  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries((definition?.fields ?? []).map((f) => [f.id, f.defaultValue])),
  );

  if (!definition || !compute) {
    return null;
  }

  const numericValues = useMemo(() => {
    const out: Record<string, number> = {};
    for (const field of definition.fields) {
      if (field.type === "select") {
        out[field.id] = parseNumber(values[field.id] ?? field.defaultValue);
      } else {
        out[field.id] = parseNumber(values[field.id] ?? field.defaultValue, parseNumber(field.defaultValue));
      }
    }
    return out;
  }, [definition.fields, values]);

  const results = useMemo(() => compute(numericValues), [compute, numericValues]);

  const setField = (id: string, v: string) => setValues((prev) => ({ ...prev, [id]: v }));

  return (
    <CalculatorLayout title={definition.title} description={definition.description}>
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {definition.fields.map((field) =>
          field.type === "select" && field.options ? (
            <CalcSelect
              key={field.id}
              label={field.label}
              id={field.id}
              value={values[field.id] ?? field.defaultValue}
              onChange={(v) => setField(field.id, v)}
              options={field.options}
            />
          ) : (
            <CalcField
              key={field.id}
              label={field.label}
              id={field.id}
              value={values[field.id] ?? field.defaultValue}
              onChange={(v) => setField(field.id, v)}
              suffix={field.suffix}
              step={field.step}
            />
          ),
        )}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {definition.results.map((result) => (
          <CalcResult
            key={result.id}
            label={result.label}
            value={formatResult(results[result.id] ?? 0, result.format)}
            highlight={result.highlight}
          />
        ))}
      </div>
    </CalculatorLayout>
  );
}
