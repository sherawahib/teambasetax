"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileUp,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { SEED_CHECKLIST } from "@/data/client-portal";
import {
  addDocument,
  getPortalData,
  loadTaxProfile,
  saveTaxProfile,
} from "@/lib/client-portal-store";
import type {
  ClientTaxProfile,
  DocumentCategory,
  PortalSession,
  PortalUser,
} from "@/types/client-portal";
import { emptyClientTaxProfile } from "@/types/client-portal";

type Props = {
  session: PortalSession;
  onComplete: (session: PortalSession) => void;
  /** Allow opening wizard later from Profile without forcing finish */
  allowSkip?: boolean;
  onSkip?: () => void;
};

type StepId =
  | "personal"
  | "personal-docs"
  | "income-docs"
  | "business"
  | "business-docs"
  | "vehicle"
  | "expenses"
  | "notes";

type UploadSlot = {
  checklistId: string;
  label: string;
  category: DocumentCategory;
};

const PERSONAL_UPLOADS: UploadSlot[] = [
  { checklistId: "tc-p5", label: "Driver's license or state ID", category: "Personal ID" },
  { checklistId: "tc-p7", label: "Mortgage statement (if you own a home)", category: "Mortgage & Housing" },
  { checklistId: "tc-p8", label: "College tuition / education expense records", category: "Education" },
];

const INCOME_UPLOADS: UploadSlot[] = [
  { checklistId: "tc-i1", label: "W-2 forms", category: "Income - W-2" },
  { checklistId: "tc-i2", label: "1099-R retirement income", category: "Income - Retirement / Social Security" },
  { checklistId: "tc-i3", label: "1099-MISC", category: "Income - 1099" },
  { checklistId: "tc-i4", label: "1099-NEC", category: "Income - 1099" },
  { checklistId: "tc-i5", label: "1099-K", category: "Income - 1099" },
  { checklistId: "tc-i6", label: "Social Security income statement", category: "Income - Retirement / Social Security" },
  { checklistId: "tc-i7", label: "Year-end retirement account statements", category: "Income - Retirement / Social Security" },
  { checklistId: "tc-i8", label: "Disability income documents", category: "Income - Retirement / Social Security" },
];

const BUSINESS_UPLOADS: UploadSlot[] = [
  { checklistId: "tc-b5", label: "12 months of business bank statements", category: "Business Records" },
  { checklistId: "tc-b6", label: "Profit & loss / financial statement", category: "Business Records" },
  { checklistId: "tc-b7", label: "Prior-year business tax return", category: "Prior Returns" },
  { checklistId: "tc-b8", label: "Business 1099-MISC / NEC / K forms received", category: "Income - 1099" },
];

const VEHICLE_UPLOADS: UploadSlot[] = [
  { checklistId: "tc-v2", label: "Purchase contract", category: "Vehicle Expenses" },
  { checklistId: "tc-v3", label: "Auto insurance records", category: "Vehicle Expenses" },
  { checklistId: "tc-v6", label: "Repairs & maintenance records", category: "Vehicle Expenses" },
];

const EXPENSE_UPLOADS: UploadSlot[] = [
  { checklistId: "tc-e1", label: "Advertising", category: "Business Expenses" },
  { checklistId: "tc-e2", label: "Commissions and fees", category: "Business Expenses" },
  { checklistId: "tc-e3", label: "Contract labor / 1099s issued", category: "Business Expenses" },
  { checklistId: "tc-e4", label: "Legal and professional fees", category: "Business Expenses" },
  { checklistId: "tc-e5", label: "Rent", category: "Business Expenses" },
  { checklistId: "tc-e6", label: "Supplies and materials", category: "Business Expenses" },
  { checklistId: "tc-e7", label: "Travel and meals", category: "Business Expenses" },
  { checklistId: "tc-e8", label: "Utilities", category: "Business Expenses" },
  { checklistId: "tc-e9", label: "Health insurance", category: "Business Expenses" },
  { checklistId: "tc-e10", label: "Equipment purchased this tax year", category: "Business Expenses" },
];

const inputClass =
  "w-full min-h-11 rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-base sm:text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold";
const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

function hasDoc(checklistId: string) {
  return getPortalData().documents.some((d) => d.checklistItemId === checklistId);
}

export default function CompleteProfileWizard({ session, onComplete, allowSkip, onSkip }: Props) {
  const [profile, setProfile] = useState<ClientTaxProfile>(() =>
    emptyClientTaxProfile({ name: session.user.name, accountType: session.user.accountType }),
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadTick, setUploadTick] = useState(0);

  const isBusiness = profile.accountType === "Business" || profile.accountType === "Both";

  const steps = useMemo(() => {
    const base: { id: StepId; title: string; blurb: string }[] = [
      {
        id: "personal",
        title: "Personal Information",
        blurb: "Names, address, SSN, and dates of birth for everyone on the return.",
      },
      {
        id: "personal-docs",
        title: "Personal Documents",
        blurb: "Upload ID, mortgage, and education records if they apply.",
      },
      {
        id: "income-docs",
        title: "Income Documents",
        blurb: "Upload W-2s, 1099s, retirement, and Social Security forms.",
      },
    ];
    if (isBusiness) {
      base.push(
        {
          id: "business",
          title: "Business Information",
          blurb: "Business name, EIN, activity, and income notes.",
        },
        {
          id: "business-docs",
          title: "Business Documents",
          blurb: "Bank statements, P&L, prior return, and business 1099s.",
        },
        {
          id: "vehicle",
          title: "Vehicle Expenses",
          blurb: "Business vehicle details, miles, and related records.",
        },
        {
          id: "expenses",
          title: "Other Business Expenses",
          blurb: "Upload expense records for advertising, rent, travel, and more.",
        },
      );
    }
    base.push({
      id: "notes",
      title: "Client Notes & Finish",
      blurb: "Share anything else that may affect your return, then submit your profile.",
    });
    return base;
  }, [isBusiness]);

  const step = steps[Math.min(stepIndex, steps.length - 1)];

  useEffect(() => {
    loadTaxProfile(session.user.email).then((loaded) => {
      if (loaded) {
        setProfile({
          ...emptyClientTaxProfile({ name: session.user.name }),
          ...loaded,
          taxpayerFullName: loaded.taxpayerFullName || session.user.name,
        });
      }
      setLoading(false);
    });
  }, [session.user.email, session.user.name]);

  function update<K extends keyof ClientTaxProfile>(key: K, value: ClientTaxProfile[K]) {
    setProfile((prev) => ({ ...prev, [key]: value }));
  }

  async function persist(next: ClientTaxProfile) {
    setSaving(true);
    setError(null);
    const result = await saveTaxProfile(session.user.email, next);
    setSaving(false);
    if (result.error || !result.profile) {
      setError(result.error ?? "Could not save. Please try again.");
      return null;
    }
    if (result.session) return result.session;
    return {
      ...session,
      user: {
        ...session.user,
        name: result.profile.taxpayerFullName.trim() || session.user.name,
        accountType: result.profile.accountType,
        profileComplete: result.profile.profileComplete,
      },
    };
  }

  async function markChecklistFromProfile(p: ClientTaxProfile) {
    const marks: { id: string; done: boolean }[] = [
      { id: "tc-p1", done: Boolean(p.taxpayerFullName.trim()) },
      { id: "tc-p2", done: Boolean(p.mailingAddress.trim() && p.city.trim() && p.zip.trim()) },
      { id: "tc-p3", done: Boolean(p.taxpayerSsn.trim()) },
      { id: "tc-p4", done: Boolean(p.taxpayerDob.trim()) },
      { id: "tc-p6", done: true },
      { id: "tc-b1", done: Boolean(p.businessName.trim() && p.businessAddress.trim()) },
      { id: "tc-b2", done: Boolean(p.ein.trim()) },
      { id: "tc-b3", done: Boolean(p.principalActivity.trim()) },
      { id: "tc-b4", done: Boolean(p.businessIncomeNotes.trim()) },
      { id: "tc-v1", done: Boolean(p.vehicleMake.trim() && p.vehicleModel.trim() && p.vehicleYear.trim()) },
      {
        id: "tc-v2",
        done: Boolean(p.purchaseDate.trim() && p.purchaseAmount.trim()) || hasDoc("tc-v2"),
      },
      { id: "tc-v4", done: Boolean(p.totalMiles.trim()) },
      { id: "tc-v5", done: Boolean(p.businessMiles.trim()) },
      {
        id: "tc-v7",
        done: Boolean(p.registrationDate.trim() && p.registrationCost.trim()),
      },
      { id: "tc-n1", done: Boolean(p.clientNotes.trim()) || true },
    ];

    await Promise.all(
      marks
        .filter((m) => m.done)
        .map((m) =>
          fetch("/api/portal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "checklist", id: m.id, done: true }),
          }),
        ),
    );
  }

  function handleUpload(slot: UploadSlot, file: File | undefined) {
    if (!file) return;
    addDocument({
      name: file.name,
      category: slot.category,
      size: file.size,
      taxYear: new Date().getFullYear(),
      checklistItemId: slot.checklistId,
    });
    setUploadTick((n) => n + 1);
  }

  async function goNext() {
    const marked = {
      ...profile,
      completedSteps: Array.from(new Set([...profile.completedSteps, step.id])),
      updatedAt: new Date().toISOString(),
    };
    setProfile(marked);
    await persist(marked);

    if (stepIndex >= steps.length - 1) {
      const finished: ClientTaxProfile = {
        ...marked,
        profileComplete: true,
        completedSteps: steps.map((s) => s.id),
      };
      await markChecklistFromProfile(finished);
      const sessionOut = await persist(finished);
      if (sessionOut) onComplete({ ...sessionOut, user: { ...sessionOut.user, profileComplete: true } });
      return;
    }
    setStepIndex((i) => i + 1);
  }

  function goBack() {
    setStepIndex((i) => Math.max(0, i - 1));
  }

  if (loading) {
    return <div className="py-16 text-center text-muted">Loading your tax profile…</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <div className="mb-6 rounded-2xl border border-navy/20 bg-surface p-5 sm:p-6">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-navy/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
          Tax Client Checklist
        </div>
        <h2 className="text-xl font-bold text-foreground sm:text-2xl">Complete your client profile</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Signup only needed basic info. Now gather the details and documents from our Tax Client Checklist so we can
          prepare your return accurately.
        </p>
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs font-medium text-muted">
            <span>
              Step {stepIndex + 1} of {steps.length}: {step.title}
            </span>
            <span>{Math.round(((stepIndex + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gold transition-all"
              style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface-elevated p-5 shadow-sm sm:p-6">
        <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
        <p className="mt-1 text-sm text-muted">{step.blurb}</p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4" key={`${step.id}-${uploadTick}`}>
          {step.id === "personal" && (
            <>
              <div>
                <label className={labelClass}>Account type</label>
                <select
                  className={inputClass}
                  value={profile.accountType}
                  onChange={(e) => update("accountType", e.target.value as PortalUser["accountType"])}
                >
                  <option value="Individual">Individual</option>
                  <option value="Business">Business</option>
                  <option value="Both">Individual &amp; Business</option>
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Taxpayer full name *" value={profile.taxpayerFullName} onChange={(v) => update("taxpayerFullName", v)} />
                <Field label="Spouse full name" value={profile.spouseFullName} onChange={(v) => update("spouseFullName", v)} />
              </div>
              <Field
                label="Dependents (names)"
                value={profile.dependents}
                onChange={(v) => update("dependents", v)}
                placeholder="List each dependent"
              />
              <Field label="Mailing address *" value={profile.mailingAddress} onChange={(v) => update("mailingAddress", v)} />
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="City *" value={profile.city} onChange={(v) => update("city", v)} />
                <Field label="State *" value={profile.state} onChange={(v) => update("state", v)} />
                <Field label="ZIP *" value={profile.zip} onChange={(v) => update("zip", v)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Taxpayer SSN *" value={profile.taxpayerSsn} onChange={(v) => update("taxpayerSsn", v)} placeholder="XXX-XX-XXXX" />
                <Field label="Spouse SSN" value={profile.spouseSsn} onChange={(v) => update("spouseSsn", v)} />
              </div>
              <Field label="Dependents’ SSNs" value={profile.dependentsSsn} onChange={(v) => update("dependentsSsn", v)} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Taxpayer date of birth *" type="date" value={profile.taxpayerDob} onChange={(v) => update("taxpayerDob", v)} />
                <Field label="Spouse date of birth" type="date" value={profile.spouseDob} onChange={(v) => update("spouseDob", v)} />
              </div>
              <Field label="Dependents’ dates of birth" value={profile.dependentsDob} onChange={(v) => update("dependentsDob", v)} placeholder="MM/DD/YYYY for each" />
              <p className="text-xs text-muted">Email on file: {session.user.email} · Phone: {session.user.phone}</p>
            </>
          )}

          {step.id === "personal-docs" && <UploadList slots={PERSONAL_UPLOADS} onUpload={handleUpload} />}
          {step.id === "income-docs" && <UploadList slots={INCOME_UPLOADS} onUpload={handleUpload} />}

          {step.id === "business" && (
            <>
              <Field label="Business name *" value={profile.businessName} onChange={(v) => update("businessName", v)} />
              <Field label="Business address *" value={profile.businessAddress} onChange={(v) => update("businessAddress", v)} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="EIN *" value={profile.ein} onChange={(v) => update("ein", v)} placeholder="XX-XXXXXXX" />
                <Field label="Principal business activity *" value={profile.principalActivity} onChange={(v) => update("principalActivity", v)} />
              </div>
              <Field
                label="Business income from all sources (notes)"
                value={profile.businessIncomeNotes}
                onChange={(v) => update("businessIncomeNotes", v)}
                textarea
              />
            </>
          )}

          {step.id === "business-docs" && <UploadList slots={BUSINESS_UPLOADS} onUpload={handleUpload} />}

          {step.id === "vehicle" && (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Make" value={profile.vehicleMake} onChange={(v) => update("vehicleMake", v)} />
                <Field label="Model" value={profile.vehicleModel} onChange={(v) => update("vehicleModel", v)} />
                <Field label="Year" value={profile.vehicleYear} onChange={(v) => update("vehicleYear", v)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Purchase date" type="date" value={profile.purchaseDate} onChange={(v) => update("purchaseDate", v)} />
                <Field label="Purchase amount" value={profile.purchaseAmount} onChange={(v) => update("purchaseAmount", v)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Total annual miles" value={profile.totalMiles} onChange={(v) => update("totalMiles", v)} />
                <Field label="Business miles" value={profile.businessMiles} onChange={(v) => update("businessMiles", v)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Registration date" type="date" value={profile.registrationDate} onChange={(v) => update("registrationDate", v)} />
                <Field label="Registration cost" value={profile.registrationCost} onChange={(v) => update("registrationCost", v)} />
              </div>
              <UploadList slots={VEHICLE_UPLOADS} onUpload={handleUpload} />
            </>
          )}

          {step.id === "expenses" && <UploadList slots={EXPENSE_UPLOADS} onUpload={handleUpload} />}

          {step.id === "notes" && (
            <>
              <Field
                label="Additional information that may affect your tax return"
                value={profile.clientNotes}
                onChange={(v) => update("clientNotes", v)}
                textarea
                placeholder="Major life changes, new dependents, address changes, business changes, unusual income or expenses…"
              />
              <div className="rounded-xl border border-gold/30 bg-gold/5 p-4 text-sm text-slate-700">
                <p className="font-semibold text-foreground">Ready to submit?</p>
                <p className="mt-1">
                  You can still upload more documents later from the Documents and Checklists sections. Submitting marks
                  your Tax Client Checklist profile as complete.
                </p>
                <ul className="mt-3 space-y-1 text-xs text-muted">
                  {SEED_CHECKLIST.filter((c) =>
                    isBusiness ? true : !c.category.startsWith("Business") && !c.category.startsWith("Vehicle") && !c.category.startsWith("Other Business"),
                  )
                    .slice(0, 6)
                    .map((c) => (
                      <li key={c.id} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                        {c.label}
                      </li>
                    ))}
                  <li className="text-muted">…and the remaining checklist items in your portal.</li>
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={goBack}
              disabled={stepIndex === 0 || saving}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold text-foreground disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            {allowSkip && onSkip && (
              <button type="button" onClick={onSkip} className="min-h-11 px-3 text-sm font-medium text-muted hover:text-foreground">
                Continue to portal
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={goNext}
            disabled={saving || (step.id === "personal" && !profile.taxpayerFullName.trim())}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-navy px-5 text-sm font-semibold text-white hover:bg-navy-light disabled:opacity-60"
          >
            {saving ? "Saving…" : stepIndex >= steps.length - 1 ? "Submit complete profile" : "Save & continue"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          placeholder={placeholder}
          className={`${inputClass} resize-y`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
    </div>
  );
}

function UploadList({
  slots,
  onUpload,
}: {
  slots: UploadSlot[];
  onUpload: (slot: UploadSlot, file: File | undefined) => void;
}) {
  return (
    <div className="space-y-3">
      {slots.map((slot) => {
        const uploaded = hasDoc(slot.checklistId);
        return (
          <label
            key={slot.checklistId}
            className={`flex cursor-pointer flex-col gap-2 rounded-xl border px-4 py-3 transition-colors sm:flex-row sm:items-center sm:justify-between ${
              uploaded ? "border-gold/40 bg-gold/5" : "border-border hover:border-gold/40"
            }`}
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{slot.label}</p>
              <p className="text-xs text-muted">{uploaded ? "Uploaded — you can replace the file" : "PDF, JPG, PNG, or spreadsheet"}</p>
            </div>
            <span className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-navy/20 bg-white px-3 text-sm font-semibold text-navy">
              {uploaded ? <CheckCircle2 className="h-4 w-4 text-gold" /> : <Upload className="h-4 w-4" />}
              {uploaded ? "Replace" : "Upload"}
              <FileUp className="h-3.5 w-3.5 text-muted" />
            </span>
            <input
              type="file"
              className="sr-only"
              accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx"
              onChange={(e) => onUpload(slot, e.target.files?.[0])}
            />
          </label>
        );
      })}
    </div>
  );
}
