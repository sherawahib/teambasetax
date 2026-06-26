import { createElement, type ComponentType } from "react";
import AdjustableRateMortgageCalculator from "@/components/calculators/AdjustableRateMortgageCalculator";
import AnnuityTaxCalculator from "@/components/calculators/AnnuityTaxCalculator";
import CapitalGainsCalculator from "@/components/calculators/CapitalGainsCalculator";
import FederalTaxRefundCalculator from "@/components/calculators/FederalTaxRefundCalculator";
import FourOhOneKCalculator from "@/components/calculators/FourOhOneKCalculator";
import GenericCalculator from "@/components/calculators/GenericCalculator";
import InvestmentGrowthCalculator from "@/components/calculators/InvestmentGrowthCalculator";
import IRARMDCalculator from "@/components/calculators/IRARMDCalculator";
import MarginalEffectiveTaxCalculator from "@/components/calculators/MarginalEffectiveTaxCalculator";
import MortgageCalculator from "@/components/calculators/MortgageCalculator";
import SelfEmploymentTaxCalculator from "@/components/calculators/SelfEmploymentTaxCalculator";
import SocialSecurityCalculator from "@/components/calculators/SocialSecurityCalculator";
import StandardVsItemizedCalculator from "@/components/calculators/StandardVsItemizedCalculator";
import TaxCreditVsDeductionCalculator from "@/components/calculators/TaxCreditVsDeductionCalculator";
import { computeFunctions } from "@/lib/calculators/compute/all";
import { calculatorDefinitions } from "@/lib/calculators/definitions";

const customComponents: Record<string, ComponentType> = {
  "adjustable-rate-mortgage": AdjustableRateMortgageCalculator,
  mortgage: MortgageCalculator,
  "401k-future-value": FourOhOneKCalculator,
  "social-security-income": SocialSecurityCalculator,
  "capital-gains-loss": CapitalGainsCalculator,
  "investment-growth-comparison": InvestmentGrowthCalculator,
  "marginal-vs-effective-tax": MarginalEffectiveTaxCalculator,
  "standard-vs-itemized": StandardVsItemizedCalculator,
  "annuity-tax-advantages": AnnuityTaxCalculator,
  "tax-credit-vs-deduction": TaxCreditVsDeductionCalculator,
  "traditional-ira-rmd": IRARMDCalculator,
  "federal-tax-refund": FederalTaxRefundCalculator,
  "self-employment-tax": SelfEmploymentTaxCalculator,
};

const genericCache: Record<string, ComponentType> = {};

function getGenericComponent(slug: string): ComponentType {
  if (!genericCache[slug]) {
    genericCache[slug] = function GenericCalcWrapper() {
      return createElement(GenericCalculator, { slug });
    };
    genericCache[slug].displayName = `Calculator_${slug}`;
  }
  return genericCache[slug];
}

export function getCalculatorComponent(slug: string): ComponentType | null {
  if (customComponents[slug]) return customComponents[slug];
  if (computeFunctions[slug] && calculatorDefinitions[slug]) return getGenericComponent(slug);
  return null;
}

export const calculatorComponents: Record<string, ComponentType> = new Proxy({} as Record<string, ComponentType>, {
  get(_target, prop: string) {
    return getCalculatorComponent(prop) ?? undefined;
  },
  has(_target, prop: string) {
    return getCalculatorComponent(prop) !== null;
  },
  ownKeys() {
    return [...Object.keys(customComponents), ...Object.keys(computeFunctions)];
  },
});
