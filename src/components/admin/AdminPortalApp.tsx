"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  CreditCard,
  FileCheck,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Scale,
  Star,
  Users,
  X,
} from "lucide-react";
import { ADMIN_NAV } from "@/data/admin";
import { adminLogout, getAdminSession } from "@/lib/admin-store";
import type { AdminSection, AdminSession } from "@/types/admin";
import AdminLogin from "./AdminLogin";
import {
  AdminAppointmentsView,
  AdminBillingView,
  AdminClientsView,
  AdminDashboardView,
  AdminDocumentsView,
  AdminFeedbackView,
  AdminIrsLegalView,
  AdminMessagesView,
  AdminTaxReturnsView,
} from "./admin-views";

const ICONS: Record<AdminSection, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  feedback: Star,
  messages: MessageSquare,
  documents: FileText,
  "tax-returns": FileCheck,
  appointments: CalendarDays,
  billing: CreditCard,
  "irs-legal": Scale,
  clients: Users,
};

export default function AdminPortalApp() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [section, setSection] = useState<AdminSection>("dashboard");
  const [mobileNav, setMobileNav] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSession(getAdminSession());
    setMounted(true);
  }, []);

  function refresh() {
    setRefreshKey((k) => k + 1);
    import("@/lib/client-portal-store").then(({ clearPortalCache, fetchPortalDataFromServer }) => {
      clearPortalCache();
      fetchPortalDataFromServer();
    });
  }

  function handleLogout() {
    adminLogout();
    setSession(null);
    setSection("dashboard");
  }

  if (!mounted) {
    return <div className="py-16 text-center text-muted">Loading admin portal…</div>;
  }

  if (!session) {
    return (
      <div className="py-10 md:py-16 px-4">
        <AdminLogin onLogin={setSession} />
      </div>
    );
  }

  const viewProps = { onRefresh: refresh, refreshKey };

  function renderSection() {
    switch (section) {
      case "dashboard":
        return <AdminDashboardView {...viewProps} />;
      case "feedback":
        return <AdminFeedbackView {...viewProps} />;
      case "messages":
        return <AdminMessagesView {...viewProps} />;
      case "documents":
        return <AdminDocumentsView {...viewProps} />;
      case "tax-returns":
        return <AdminTaxReturnsView {...viewProps} />;
      case "appointments":
        return <AdminAppointmentsView {...viewProps} />;
      case "billing":
        return <AdminBillingView {...viewProps} />;
      case "irs-legal":
        return <AdminIrsLegalView {...viewProps} />;
      case "clients":
        return <AdminClientsView {...viewProps} />;
      default:
        return <AdminDashboardView {...viewProps} />;
    }
  }

  const navButton = (id: AdminSection, label: string) => {
    const Icon = ICONS[id];
    const active = section === id;
    return (
      <button
        key={id}
        type="button"
        onClick={() => {
          setSection(id);
          setMobileNav(false);
        }}
        className={`flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-colors min-h-11 ${
          active ? "bg-gold text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
        }`}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {label}
      </button>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100dvh-12rem)]">
      <div className="lg:hidden flex items-center justify-between gap-3 px-4 py-3 bg-black text-white border-b border-white/10">
        <div>
          <p className="font-semibold text-sm">Admin Portal</p>
          <p className="text-xs text-white/60">{session.email}</p>
        </div>
        <button
          type="button"
          onClick={() => setMobileNav(!mobileNav)}
          className="p-2 rounded-lg hover:bg-white/10 min-h-11 min-w-11 flex items-center justify-center"
          aria-label="Toggle admin menu"
        >
          {mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileNav && (
        <div className="lg:hidden bg-black px-3 py-3 space-y-1 border-b border-white/10 max-h-[60vh] overflow-y-auto">
          {ADMIN_NAV.map(({ id, label }) => navButton(id, label))}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium text-red-300 hover:bg-white/10 min-h-11 mt-2"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      )}

      <aside className="hidden lg:flex lg:w-64 xl:w-72 flex-col bg-black text-white shrink-0">
        <div className="p-5 border-b border-white/10">
          <p className="font-bold text-gold text-sm uppercase tracking-wider">Admin Portal</p>
          <p className="font-semibold mt-2 truncate">{session.email}</p>
          <p className="text-xs text-white/60">TEAMBASED Tax Services</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">{ADMIN_NAV.map(({ id, label }) => navButton(id, label))}</nav>
        <div className="p-3 border-t border-white/10">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium text-red-300 hover:bg-white/10 min-h-11"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1 overflow-x-hidden bg-surface p-4 sm:p-6 lg:p-8">{renderSection()}</div>
    </div>
  );
}
