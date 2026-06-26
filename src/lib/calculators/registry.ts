import type { ComponentType } from "react";
import AdjustableRateMortgageCalculator from "@/components/calculators/AdjustableRateMortgageCalculator";
import AnnuityTaxCalculator from "@/components/calculators/AnnuityTaxCalculator";
import CapitalGainsCalculator from "@/components/calculators/CapitalGainsCalculator";
import FederalTaxRefundCalculator from "@/components/calculators/FederalTaxRefundCalculator";
import FourOhOneKCalculator from "@/components/calculators/FourOhOneKCalculator";
import InvestmentGrowthCalculator from "@/components/calculators/InvestmentGrowthCalculator";
import IRARMDCalculator from "@/components/calculators/IRARMDCalculator";
import MarginalEffectiveTaxCalculator from "@/components/calculators/MarginalEffectiveTaxCalculator";
import MortgageCalculator from "@/components/calculators/MortgageCalculator";
import SelfEmploymentTaxCalculator from "@/components/calculators/SelfEmploymentTaxCalculator";
import SocialSecurityCalculator from "@/components/calculators/SocialSecurityCalculator";
import StandardVsItemizedCalculator from "@/components/calculators/StandardVsItemizedCalculator";
import TaxCreditVsDeductionCalculator from "@/components/calculators/TaxCreditVsDeductionCalculator";

export const calculatorComponents: Record<string, ComponentType> = {
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
