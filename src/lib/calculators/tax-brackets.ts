export type FilingStatus = "single" | "married_joint" | "married_separate" | "head_of_household";

/** 2026 values aligned with CalcXML inc02/inc10/inc12 */
export const STANDARD_DEDUCTION: Record<FilingStatus, number> = {
  single: 16100,
  married_joint: 32200,
  married_separate: 16100,
  head_of_household: 24150,
};

/** 2026 ordinary income tax brackets */
export const ORDINARY_BRACKETS: Record<FilingStatus, { rate: number; max: number }[]> = {
  single: [
    { rate: 0.1, max: 12400 },
    { rate: 0.12, max: 50400 },
    { rate: 0.22, max: 105700 },
    { rate: 0.24, max: 201775 },
    { rate: 0.32, max: 256225 },
    { rate: 0.35, max: 640600 },
    { rate: 0.37, max: Infinity },
  ],
  married_joint: [
    { rate: 0.1, max: 24800 },
    { rate: 0.12, max: 100800 },
    { rate: 0.22, max: 211400 },
    { rate: 0.24, max: 403550 },
    { rate: 0.32, max: 512450 },
    { rate: 0.35, max: 768700 },
    { rate: 0.37, max: Infinity },
  ],
  married_separate: [
    { rate: 0.1, max: 12400 },
    { rate: 0.12, max: 50400 },
    { rate: 0.22, max: 105700 },
    { rate: 0.24, max: 201775 },
    { rate: 0.32, max: 256225 },
    { rate: 0.35, max: 384350 },
    { rate: 0.37, max: Infinity },
  ],
  head_of_household: [
    { rate: 0.1, max: 17700 },
    { rate: 0.12, max: 67450 },
    { rate: 0.22, max: 105700 },
    { rate: 0.24, max: 201775 },
    { rate: 0.32, max: 256225 },
    { rate: 0.35, max: 640600 },
    { rate: 0.37, max: Infinity },
  ],
};

/** 2026 long-term capital gains thresholds */
export const LTCG_BRACKETS: Record<FilingStatus, { rate: number; max: number }[]> = {
  single: [
    { rate: 0, max: 48350 },
    { rate: 0.15, max: 533400 },
    { rate: 0.2, max: Infinity },
  ],
  married_joint: [
    { rate: 0, max: 96700 },
    { rate: 0.15, max: 600050 },
    { rate: 0.2, max: Infinity },
  ],
  married_separate: [
    { rate: 0, max: 48350 },
    { rate: 0.15, max: 300000 },
    { rate: 0.2, max: Infinity },
  ],
  head_of_household: [
    { rate: 0, max: 64750 },
    { rate: 0.15, max: 566700 },
    { rate: 0.2, max: Infinity },
  ],
};

/** 2026 Social Security bend points */
export const SS_BEND_POINTS = { first: 1226, second: 7391 };

/** 2026 Social Security wage base */
export const SS_WAGE_BASE = 184500;

/** 2026 Medicare additional tax threshold */
export const MEDICARE_SURCHARGE: Record<FilingStatus, number> = {
  single: 200000,
  married_joint: 250000,
  married_separate: 125000,
  head_of_household: 200000,
};

/** IRS Uniform Lifetime Table (SECURE 2.0) */
export const RMD_DIVISORS: Record<number, number> = {
  72: 27.4, 73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0, 79: 21.1, 80: 20.2,
  81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8, 85: 16.0, 86: 15.2, 87: 14.4, 88: 13.7, 89: 12.9,
  90: 12.2, 91: 11.5, 92: 10.8, 93: 10.1, 94: 9.5, 95: 8.9, 96: 8.4, 97: 7.8, 98: 7.3, 99: 6.8,
  100: 6.4, 101: 6.0, 102: 5.6, 103: 5.2, 104: 4.9, 105: 4.6, 106: 4.3, 107: 4.1, 108: 3.9,
  109: 3.7, 110: 3.5, 111: 3.4, 112: 3.3, 113: 3.1, 114: 3.0, 115: 2.9,
};

export const SALT_CAP = 10000;
export const MEDICAL_AGI_FLOOR = 0.075;
export const CHILD_TAX_CREDIT = 2000;
