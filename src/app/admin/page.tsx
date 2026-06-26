import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import AdminPortalApp from "@/components/admin/AdminPortalApp";

export const metadata: Metadata = {
  title: "Admin Portal",
  description: "Admin portal for TEAMBASED Tax Services — manage client feedback, documents, messages, and portal data.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <>
      <PageHeader
        title="Admin Portal"
        subtitle="Manage client portal data, feedback, documents, messages, billing, and IRS cases."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Admin Portal" },
        ]}
      />
      <AdminPortalApp />
    </>
  );
}
