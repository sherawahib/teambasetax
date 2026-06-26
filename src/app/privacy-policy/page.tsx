import type { Metadata } from "next";
import LegalDocumentLayout from "@/components/LegalDocumentLayout";
import { privacyPolicyMeta, privacyPolicySections } from "@/data/legal/privacy-policy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "TEAMBASED Tax Services Privacy Policy — how we collect, use, protect, and retain your personal and tax information.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalDocumentLayout
      title={privacyPolicyMeta.title}
      subtitle={privacyPolicyMeta.subtitle}
      lastUpdated={privacyPolicyMeta.lastUpdated}
      effectiveDate={privacyPolicyMeta.effectiveDate}
      summary={privacyPolicyMeta.summary}
      sections={privacyPolicySections}
      relatedLinks={privacyPolicyMeta.relatedLinks}
    />
  );
}
