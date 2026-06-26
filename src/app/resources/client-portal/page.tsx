import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ClientPortalApp from "@/components/client-portal/ClientPortalApp";

export const metadata: Metadata = {
  title: "Client Portal",
  description:
    "Secure client portal for TEAMBASED Tax Services — documents, tax returns, messaging, billing, IRS tracking, and financial advisory tools.",
};

export default function ClientPortalPage() {
  return (
    <>
      <PageHeader
        title="Secure Client Portal"
        subtitle="Manage documents, track returns, communicate with your tax team, and access advisory & legal resources."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources/financial-calculators" },
          { label: "Client Portal" },
        ]}
      />
      <ClientPortalApp />
    </>
  );
}
