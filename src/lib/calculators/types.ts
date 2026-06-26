export type CalculatorCategory =
  | "automobile"
  | "business"
  | "credit-cards"
  | "mortgage"
  | "retirement"
  | "insurance"
  | "kids"
  | "investment"
  | "loans"
  | "paycheck"
  | "real-estate"
  | "savings"
  | "tax"
  | "young-adults";

export type ResultFormat = "currency" | "currency-detailed" | "percent" | "number" | "text" | "months" | "years";

export type CalcFieldType = "number" | "select";

export type CalcFieldDef = {
  id: string;
  label: string;
  defaultValue: string;
  suffix?: string;
  step?: string;
  type?: CalcFieldType;
  options?: { value: string; label: string }[];
};

export type CalcResultDef = {
  id: string;
  label: string;
  format: ResultFormat;
  highlight?: boolean;
};

export type CalculatorMeta = {
  slug: string;
  category: CalculatorCategory;
  title: string;
  description: string;
  custom?: boolean;
};

export type CalculatorDefinition = CalculatorMeta & {
  fields: CalcFieldDef[];
  results: CalcResultDef[];
};

export type CalcValues = Record<string, number>;

export type CalcOutput = Record<string, number | string>;

export type ComputeFn = (values: CalcValues) => CalcOutput;
