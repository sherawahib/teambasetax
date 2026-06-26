"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  CalendarDays,
  CheckSquare,
  CreditCard,
  FileCheck,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Scale,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import { PORTAL_NAV } from "@/data/client-portal";
import { getSession, logout } from "@/lib/client-portal-store";
import type { PortalSection, PortalSession } from "@/types/client-portal";
import PortalLogin from "./PortalLogin";
import {
  AdvisoryView,
  AppointmentsView,
  BillingView,
  CalendarView,
  ChecklistsView,
  DashboardView,
  DocumentsView,
  IrsLegalView,
  MessagesView,
  ProfileView,
  TaxReturnsView,
} from "./portal-views";

const ICONS: Record<PortalSection, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  documents: FileText,
  "tax-returns": FileCheck,
  messages: MessageSquare,
  appointments: CalendarDays,
  billing: CreditCard,
  "irs-legal": Scale,
  advisory: TrendingUp,
  checklists: CheckSquare,
  calendar: Calendar,
  profile: User,
};

export default function ClientPortalApp() {
  const [session, setSession] = useState<PortalSession | null>(null);
  const [section, setSection] = useState<PortalSection>("dashboard");
  const [mobileNav, setMobileNav] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSession(getSession());
    import("@/lib/client-portal-store").then(({ fetchPortalDataFromServer }) => {
      fetchPortalDataFromServer().then(() => setRefreshKey((k) => k + 1));
    });
    setMounted(true);
  }, []);

  function handleLogout() {
    logout();
    setSession(null);
    setSection("dashboard");
  }

  function refresh() {
    setRefreshKey((k) => k + 1);
  }

  const viewProps = { onNavigate: setSection, refreshKey, onRefresh: refresh };

  if (!mounted) {
    return (
      <div className="py-16 text-center text-muted">Loading portal…</div>
    );
  }

  if (!session) {
    return <PortalLogin onLogin={setSession} />;
  }

  function renderSection() {
    switch (section) {
      case "dashboard":
        return <DashboardView {...viewProps} />;
      case "documents":
        return <DocumentsView {...viewProps} />;
      case "tax-returns":
        return <TaxReturnsView />;
      case "messages":
        return <MessagesView {...viewProps} />;
      case "appointments":
        return <AppointmentsView />;
      case "billing":
        return <BillingView />;
      case "irs-legal":
        return <IrsLegalView />;
      case "advisory":
        return <AdvisoryView />;
      case "checklists":
        return <ChecklistsView {...viewProps} />;
      case "calendar":
        return <CalendarView />;
      case "profile":
        return <ProfileView onSessionUpdate={setSession} />;
      default:
        return <DashboardView {...viewProps} />;
    }
  }

  const navButton = (id: PortalSection, label: string) => {
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
          <p className="font-semibold text-sm">{session.user.name}</p>
          <p className="text-xs text-white/60">Client Portal</p>
        </div>
        <button
          type="button"
          onClick={() => setMobileNav(!mobileNav)}
          className="p-2 rounded-lg hover:bg-white/10 min-h-11 min-w-11 flex items-center justify-center"
          aria-label="Toggle portal menu"
        >
          {mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileNav && (
        <div className="lg:hidden bg-black px-3 py-3 space-y-1 border-b border-white/10 max-h-[60vh] overflow-y-auto">
          {PORTAL_NAV.map(({ id, label }) => navButton(id, label))}
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
          <p className="font-bold text-gold text-sm uppercase tracking-wider">Client Portal</p>
          <p className="font-semibold mt-2 truncate">{session.user.name}</p>
          <p className="text-xs text-white/60 truncate">{session.user.email}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">{PORTAL_NAV.map(({ id, label }) => navButton(id, label))}</nav>
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

      <div className="flex-1 bg-surface p-4 sm:p-6 lg:p-8 overflow-x-hidden">{renderSection()}</div>
    </div>
  );
}
