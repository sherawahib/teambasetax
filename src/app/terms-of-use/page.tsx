import type { Metadata } from "next";
import LegalDocumentLayout from "@/components/LegalDocumentLayout";
import { termsOfUseMeta, termsOfUseSections } from "@/data/legal/terms-of-use";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms and conditions for using the TEAMBASED Tax Services website, calculators, forms, and online resources.",
};

export default function TermsOfUsePage() {
  return (
    <LegalDocumentLayout
      title={termsOfUseMeta.title}
      subtitle={termsOfUseMeta.subtitle}
      lastUpdated={termsOfUseMeta.lastUpdated}
      effectiveDate={termsOfUseMeta.effectiveDate}
      summary={termsOfUseMeta.summary}
      sections={termsOfUseSections}
      relatedLinks={termsOfUseMeta.relatedLinks}
    />
  );
}
