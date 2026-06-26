"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Home,
  Mail,
  MapPin,
  Phone,
  User,
  Video,
} from "lucide-react";
import { contact } from "@/data/site";

type Step = 1 | 2 | 3 | 4 | 5;

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredContact: string;
  clientStatus: string;
  specialPricing: string[];
  address: string;
  city: string;
  state: string;
  zip: string;
  services: string[];
  appointmentType: string;
  preferredDate: string;
  preferredTime: string;
  alternateDate: string;
  alternateTime: string;
  urgency: string;
  filingStatus: string;
  taxYear: string;
  clientCategory: string;
  w2Count: string;
  form1099Count: string;
  hasBusiness: string;
  businessType: string;
  hasRental: string;
  hasInvestments: string;
  priorPreparer: string;
  irsIssue: string;
  estimatedComplexity: string;
  referralSource: string;
  documentsReady: string[];
  accommodations: string;
  notes: string;
  consent: boolean;
};

const INITIAL: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  preferredContact: "phone",
  clientStatus: "new",
  specialPricing: [],
  address: "",
  city: "",
  state: "MD",
  zip: "",
  services: [],
  appointmentType: "in-office",
  preferredDate: "",
  preferredTime: "",
  alternateDate: "",
  alternateTime: "",
  urgency: "standard",
  filingStatus: "",
  taxYear: "2025",
  clientCategory: "individual",
  w2Count: "0",
  form1099Count: "0",
  hasBusiness: "no",
  businessType: "",
  hasRental: "no",
  hasInvestments: "no",
  priorPreparer: "",
  irsIssue: "no",
  estimatedComplexity: "moderate",
  referralSource: "",
  documentsReady: [],
  accommodations: "",
  notes: "",
  consent: false,
};

const STEPS = [
  { id: 1, label: "Contact", icon: User },
  { id: 2, label: "Schedule", icon: Calendar },
  { id: 3, label: "Tax Profile", icon: ClipboardList },
  { id: 4, label: "Details", icon: Building2 },
  { id: 5, label: "Review", icon: CheckCircle2 },
] as const;

const SERVICE_OPTIONS = [
  "Personal Tax Preparation",
  "Business Tax Services",
  "Tax Planning & Strategy",
  "Bookkeeping Services",
  "IRS Representation / Audit Support",
  "Retirement Planning",
  "Estate Tax Planning",
  "Financial Statement Preparation",
  "Entity Selection Consultation",
  "Payroll & Estimated Taxes",
  "Amended / Prior-Year Returns",
  "Other",
];

const DOCUMENT_CHECKLIST = [
  "Photo ID",
  "Social Security cards",
  "Prior year tax return",
  "W-2 and 1099 forms",
  "Mortgage / property tax statements",
  "Business income & expense records",
  "Charitable contribution receipts",
];

const inputClass =
  "w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold bg-surface-elevated";
const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";
const errorClass = "text-xs text-red-600 mt-1";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className={errorClass}>{message}</p>;
}

function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description && <p className="text-sm text-muted mt-1">{description}</p>}
    </div>
  );
}

function CheckboxGroup({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-2">
      {options.map((option) => {
        const checked = selected.includes(option);
        return (
          <label
            key={option}
            className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${
              checked ? "border-gold bg-gold/5" : "border-border hover:border-slate-300"
            }`}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() =>
                onChange(checked ? selected.filter((v) => v !== option) : [...selected, option])
              }
              className="mt-0.5 accent-navy"
            />
            <span className="text-sm text-slate-600">{option}</span>
          </label>
        );
      })}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-sm font-medium text-foreground sm:text-right break-words sm:max-w-[60%]">{value}</span>
    </div>
  );
}

export default function AppointmentRequestForm() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validateStep(current: Step): boolean {
    const nextErrors: Partial<Record<keyof FormData, string>> = {};

    if (current === 1) {
      if (!form.firstName.trim()) nextErrors.firstName = "First name is required.";
      if (!form.lastName.trim()) nextErrors.lastName = "Last name is required.";
      if (!form.email.trim()) nextErrors.email = "Email is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = "Enter a valid email.";
      if (!form.phone.trim()) nextErrors.phone = "Phone number is required.";
      else if (form.phone.replace(/\D/g, "").length < 10) nextErrors.phone = "Enter a valid 10-digit phone number.";
    }

    if (current === 2) {
      if (form.services.length === 0) nextErrors.services = "Select at least one service.";
      if (!form.preferredDate) nextErrors.preferredDate = "Preferred date is required.";
      if (!form.preferredTime) nextErrors.preferredTime = "Preferred time is required.";
      if (form.appointmentType === "home-visit" && !form.address.trim()) {
        nextErrors.address = "Address is required for home visits.";
      }
    }

    if (current === 3) {
      if (!form.filingStatus) nextErrors.filingStatus = "Filing status is required.";
      if (!form.clientCategory) nextErrors.clientCategory = "Client category is required.";
    }

    if (current === 4) {
      if (!form.referralSource) nextErrors.referralSource = "Please tell us how you heard about us.";
      if (!form.consent) nextErrors.consent = "You must agree before submitting.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function goNext() {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, 5) as Step);
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 1) as Step);
  }

  function handleSubmit() {
    if (!validateStep(4)) {
      setStep(4);
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-gold/30 bg-gold/10 p-8 md:p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/20 text-gold mb-4">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Appointment Request Submitted</h3>
        <p className="text-muted mt-2 max-w-lg mx-auto">
          Thank you, {form.firstName}. Our team will review your request and contact you within 1 business day to
          confirm your {form.appointmentType.replace("-", " ")} appointment.
        </p>
        <div className="mt-6 inline-flex flex-col sm:flex-row gap-3 text-sm">
          <a href={contact.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-white font-medium">
            <Phone className="h-4 w-4" /> Call {contact.phone}
          </a>
          <a href={`mailto:${contact.email}`} className="inline-flex items-center justify-center gap-2 rounded-lg border border-gold/40 px-5 py-2.5 text-gold font-medium">
            <Mail className="h-4 w-4" /> Email Us
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface-elevated shadow-sm overflow-hidden">
      <div className="bg-surface border-b border-border px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-gold">Step {step} of 5</p>
            <h2 className="text-lg sm:text-xl font-bold text-foreground mt-1">
              {STEPS.find((s) => s.id === step)?.label ?? "Request a Consultation"}
            </h2>
            <p className="text-sm text-muted mt-1 hidden sm:block">Complete each section so we can prepare for your appointment.</p>
          </div>
          <div className="hidden sm:flex flex-wrap gap-2">
            {STEPS.map((s) => {
              const Icon = s.icon;
              const active = step === s.id;
              const done = step > s.id;
              return (
                <div
                  key={s.id}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                    active
                      ? "bg-navy text-white"
                      : done
                        ? "bg-gold/15 text-gold-dark"
                        : "bg-white border border-border text-muted"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {s.label}
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-4 h-2 rounded-full bg-slate-200 overflow-hidden">
          <div className="h-full bg-gold transition-all duration-300" style={{ width: `${(step / 5) * 100}%` }} />
        </div>
      </div>

      <div className="p-4 sm:p-6 md:p-8">
        {step === 1 && (
          <>
            <SectionTitle
              title="Contact Information"
              description="Tell us how to reach you. First-time clients, seniors, military, and disabled individuals may qualify for special pricing."
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className={labelClass}>First Name *</label>
                <input id="firstName" value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} className={inputClass} />
                <FieldError message={errors.firstName} />
              </div>
              <div>
                <label htmlFor="lastName" className={labelClass}>Last Name *</label>
                <input id="lastName" value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} className={inputClass} />
                <FieldError message={errors.lastName} />
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>Email Address *</label>
                <input id="email" type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} className={inputClass} />
                <FieldError message={errors.email} />
              </div>
              <div>
                <label htmlFor="phone" className={labelClass}>Phone Number *</label>
                <input id="phone" type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="(240) 555-0123" className={inputClass} />
                <FieldError message={errors.phone} />
              </div>
              <div>
                <label htmlFor="preferredContact" className={labelClass}>Preferred Contact Method</label>
                <select id="preferredContact" value={form.preferredContact} onChange={(e) => updateField("preferredContact", e.target.value)} className={inputClass}>
                  <option value="phone">Phone call</option>
                  <option value="email">Email</option>
                  <option value="text">Text message</option>
                </select>
              </div>
              <div>
                <label htmlFor="clientStatus" className={labelClass}>Client Status</label>
                <select id="clientStatus" value={form.clientStatus} onChange={(e) => updateField("clientStatus", e.target.value)} className={inputClass}>
                  <option value="new">New client</option>
                  <option value="returning">Returning client</option>
                  <option value="referral">Referred by existing client</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className={labelClass}>Special Pricing Eligibility (optional)</label>
              <CheckboxGroup
                options={["Senior (65+)", "Military / Veteran", "Disabled individual", "First-time client"]}
                selected={form.specialPricing}
                onChange={(values) => updateField("specialPricing", values)}
              />
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="address" className={labelClass}>Street Address</label>
                <input id="address" value={form.address} onChange={(e) => updateField("address", e.target.value)} className={inputClass} />
                <FieldError message={errors.address} />
              </div>
              <div>
                <label htmlFor="city" className={labelClass}>City</label>
                <input id="city" value={form.city} onChange={(e) => updateField("city", e.target.value)} className={inputClass} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="state" className={labelClass}>State</label>
                  <input id="state" value={form.state} onChange={(e) => updateField("state", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="zip" className={labelClass}>ZIP</label>
                  <input id="zip" value={form.zip} onChange={(e) => updateField("zip", e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <SectionTitle
              title="Appointment Preferences"
              description="Select the services you need and when you'd like to meet. Home visits are available for clients with mobility needs."
            />
            <div className="mb-6">
              <label className={labelClass}>Services Needed *</label>
              <CheckboxGroup options={SERVICE_OPTIONS} selected={form.services} onChange={(values) => updateField("services", values)} />
              <FieldError message={errors.services} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="sm:col-span-2">
                <label className={labelClass}>Appointment Type *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { value: "in-office", label: "In-Office", icon: MapPin },
                    { value: "phone", label: "Phone Call", icon: Phone },
                    { value: "video", label: "Video Call", icon: Video },
                    { value: "home-visit", label: "Home Visit", icon: Home },
                  ].map(({ value, label, icon: Icon }) => (
                    <label
                      key={value}
                      className={`flex flex-col items-center gap-2 rounded-xl border p-4 cursor-pointer text-center transition-colors ${
                        form.appointmentType === value ? "border-gold bg-gold/5" : "border-border hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="appointmentType"
                        value={value}
                        checked={form.appointmentType === value}
                        onChange={(e) => updateField("appointmentType", e.target.value)}
                        className="sr-only"
                      />
                      <Icon className={`h-5 w-5 ${form.appointmentType === value ? "text-gold" : "text-muted"}`} />
                      <span className="text-sm font-medium text-foreground">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="preferredDate" className={labelClass}>Preferred Date *</label>
                <input id="preferredDate" type="date" min={minDate} value={form.preferredDate} onChange={(e) => updateField("preferredDate", e.target.value)} className={inputClass} />
                <FieldError message={errors.preferredDate} />
              </div>
              <div>
                <label htmlFor="preferredTime" className={labelClass}>Preferred Time *</label>
                <select id="preferredTime" value={form.preferredTime} onChange={(e) => updateField("preferredTime", e.target.value)} className={inputClass}>
                  <option value="">Select a time window</option>
                  <option value="morning">Morning (9:00 AM – 12:00 PM)</option>
                  <option value="afternoon">Afternoon (12:00 PM – 4:00 PM)</option>
                  <option value="evening">Evening (4:00 PM – 6:00 PM)</option>
                </select>
                <FieldError message={errors.preferredTime} />
              </div>
              <div>
                <label htmlFor="alternateDate" className={labelClass}>Alternate Date</label>
                <input id="alternateDate" type="date" min={minDate} value={form.alternateDate} onChange={(e) => updateField("alternateDate", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label htmlFor="alternateTime" className={labelClass}>Alternate Time</label>
                <select id="alternateTime" value={form.alternateTime} onChange={(e) => updateField("alternateTime", e.target.value)} className={inputClass}>
                  <option value="">Optional backup time</option>
                  <option value="morning">Morning (9:00 AM – 12:00 PM)</option>
                  <option value="afternoon">Afternoon (12:00 PM – 4:00 PM)</option>
                  <option value="evening">Evening (4:00 PM – 6:00 PM)</option>
                </select>
              </div>
              <div>
                <label htmlFor="urgency" className={labelClass}>Timeline / Urgency</label>
                <select id="urgency" value={form.urgency} onChange={(e) => updateField("urgency", e.target.value)} className={inputClass}>
                  <option value="standard">Standard scheduling</option>
                  <option value="soon">Need appointment within 1 week</option>
                  <option value="urgent">Urgent — deadline approaching</option>
                  <option value="extension">Filing extension / prior-year issue</option>
                </select>
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <SectionTitle
              title="Tax Profile"
              description="Help us understand your tax situation so we can assign the right specialist and estimate preparation time."
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="taxYear" className={labelClass}>Tax Year</label>
                <select id="taxYear" value={form.taxYear} onChange={(e) => updateField("taxYear", e.target.value)} className={inputClass}>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023 (prior year)</option>
                  <option value="multiple">Multiple years</option>
                </select>
              </div>
              <div>
                <label htmlFor="clientCategory" className={labelClass}>Client Category *</label>
                <select id="clientCategory" value={form.clientCategory} onChange={(e) => updateField("clientCategory", e.target.value)} className={inputClass}>
                  <option value="individual">Individual / Family</option>
                  <option value="self-employed">Self-Employed / Sole Proprietor</option>
                  <option value="small-business">Small Business (LLC, S-Corp, Partnership)</option>
                  <option value="corporation">Corporation</option>
                  <option value="nonprofit">Nonprofit</option>
                </select>
                <FieldError message={errors.clientCategory} />
              </div>
              <div>
                <label htmlFor="filingStatus" className={labelClass}>Filing Status *</label>
                <select id="filingStatus" value={form.filingStatus} onChange={(e) => updateField("filingStatus", e.target.value)} className={inputClass}>
                  <option value="">Select filing status</option>
                  <option value="single">Single</option>
                  <option value="married_joint">Married Filing Jointly</option>
                  <option value="married_separate">Married Filing Separately</option>
                  <option value="head_of_household">Head of Household</option>
                  <option value="business">Business return only</option>
                  <option value="unsure">Not sure yet</option>
                </select>
                <FieldError message={errors.filingStatus} />
              </div>
              <div>
                <label htmlFor="estimatedComplexity" className={labelClass}>Estimated Complexity</label>
                <select id="estimatedComplexity" value={form.estimatedComplexity} onChange={(e) => updateField("estimatedComplexity", e.target.value)} className={inputClass}>
                  <option value="simple">Simple (W-2 only)</option>
                  <option value="moderate">Moderate (multiple forms)</option>
                  <option value="complex">Complex (business, rentals, investments)</option>
                  <option value="very-complex">Very complex (multi-entity, IRS issues)</option>
                </select>
              </div>
              <div>
                <label htmlFor="w2Count" className={labelClass}>Number of W-2 Forms</label>
                <select id="w2Count" value={form.w2Count} onChange={(e) => updateField("w2Count", e.target.value)} className={inputClass}>
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={String(n)}>{n === 5 ? "5+" : n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="form1099Count" className={labelClass}>Number of 1099 Forms</label>
                <select id="form1099Count" value={form.form1099Count} onChange={(e) => updateField("form1099Count", e.target.value)} className={inputClass}>
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={String(n)}>{n === 5 ? "5+" : n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="hasBusiness" className={labelClass}>Business or Self-Employment Income?</label>
                <select id="hasBusiness" value={form.hasBusiness} onChange={(e) => updateField("hasBusiness", e.target.value)} className={inputClass}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <div>
                <label htmlFor="businessType" className={labelClass}>Business Entity Type</label>
                <select id="businessType" value={form.businessType} onChange={(e) => updateField("businessType", e.target.value)} className={inputClass} disabled={form.hasBusiness === "no"}>
                  <option value="">N/A</option>
                  <option value="sole-prop">Sole Proprietorship</option>
                  <option value="llc">LLC</option>
                  <option value="s-corp">S-C Corporation</option>
                  <option value="c-corp">C Corporation</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>
              <div>
                <label htmlFor="hasRental" className={labelClass}>Rental Property Income?</label>
                <select id="hasRental" value={form.hasRental} onChange={(e) => updateField("hasRental", e.target.value)} className={inputClass}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <div>
                <label htmlFor="hasInvestments" className={labelClass}>Stock / Crypto / Investment Sales?</label>
                <select id="hasInvestments" value={form.hasInvestments} onChange={(e) => updateField("hasInvestments", e.target.value)} className={inputClass}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <div>
                <label htmlFor="priorPreparer" className={labelClass}>Who prepared last year's return?</label>
                <input id="priorPreparer" value={form.priorPreparer} onChange={(e) => updateField("priorPreparer", e.target.value)} placeholder="Self, H&R Block, prior CPA, etc." className={inputClass} />
              </div>
              <div>
                <label htmlFor="irsIssue" className={labelClass}>IRS Notice, Audit, or Back Taxes?</label>
                <select id="irsIssue" value={form.irsIssue} onChange={(e) => updateField("irsIssue", e.target.value)} className={inputClass}>
                  <option value="no">No</option>
                  <option value="notice">Yes — IRS notice received</option>
                  <option value="audit">Yes — under audit</option>
                  <option value="back-taxes">Yes — owe back taxes</option>
                </select>
              </div>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <SectionTitle
              title="Additional Details"
              description="Let us know what documents you have ready and any special requests for your consultation."
            />
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="sm:col-span-2">
                <label htmlFor="referralSource" className={labelClass}>How did you hear about us? *</label>
                <select id="referralSource" value={form.referralSource} onChange={(e) => updateField("referralSource", e.target.value)} className={inputClass}>
                  <option value="">Select one</option>
                  <option value="referral">Referral from client</option>
                  <option value="google">Google search</option>
                  <option value="social">Social media</option>
                  <option value="natp">NATP / professional directory</option>
                  <option value="repeat">Previous client</option>
                  <option value="other">Other</option>
                </select>
                <FieldError message={errors.referralSource} />
              </div>
            </div>

            <div className="mb-6">
              <label className={labelClass}>Documents Ready to Bring (check all that apply)</label>
              <CheckboxGroup options={DOCUMENT_CHECKLIST} selected={form.documentsReady} onChange={(values) => updateField("documentsReady", values)} />
            </div>

            <div className="grid gap-4">
              <div>
                <label htmlFor="accommodations" className={labelClass}>Special Accommodations</label>
                <input
                  id="accommodations"
                  value={form.accommodations}
                  onChange={(e) => updateField("accommodations", e.target.value)}
                  placeholder="Mobility needs, interpreter, home visit details, etc."
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="notes" className={labelClass}>Additional Notes or Questions</label>
                <textarea
                  id="notes"
                  rows={5}
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  placeholder="Describe your situation, deadlines, prior issues, or anything else we should know before your appointment."
                  className={`${inputClass} resize-y`}
                />
              </div>
              <label className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer ${form.consent ? "border-gold bg-gold/5" : "border-border"}`}>
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => updateField("consent", e.target.checked)}
                  className="mt-1 accent-navy"
                />
                <span className="text-sm text-slate-600">
                  I agree to be contacted by TEAMBASED Tax Services regarding this appointment request. I understand
                  this form does not establish a client relationship and that submission does not guarantee a specific
                  appointment time until confirmed by our office.
                </span>
              </label>
              <FieldError message={errors.consent} />
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <SectionTitle title="Review Your Request" description="Please confirm your information before submitting." />
            <div className="rounded-xl border border-border bg-surface p-5 md:p-6 space-y-1">
              <ReviewRow label="Name" value={`${form.firstName} ${form.lastName}`.trim()} />
              <ReviewRow label="Email" value={form.email} />
              <ReviewRow label="Phone" value={form.phone} />
              <ReviewRow label="Preferred Contact" value={form.preferredContact} />
              <ReviewRow label="Client Status" value={form.clientStatus} />
              <ReviewRow label="Special Pricing" value={form.specialPricing.join(", ")} />
              <ReviewRow label="Address" value={[form.address, form.city, form.state, form.zip].filter(Boolean).join(", ")} />
              <ReviewRow label="Services" value={form.services.join(", ")} />
              <ReviewRow label="Appointment Type" value={form.appointmentType.replace("-", " ")} />
              <ReviewRow label="Preferred Date/Time" value={`${form.preferredDate} · ${form.preferredTime}`} />
              <ReviewRow label="Alternate Date/Time" value={[form.alternateDate, form.alternateTime].filter(Boolean).join(" · ")} />
              <ReviewRow label="Urgency" value={form.urgency} />
              <ReviewRow label="Tax Year" value={form.taxYear} />
              <ReviewRow label="Filing Status" value={form.filingStatus} />
              <ReviewRow label="Complexity" value={form.estimatedComplexity} />
              <ReviewRow label="W-2 / 1099 Count" value={`${form.w2Count} W-2 · ${form.form1099Count} 1099`} />
              <ReviewRow label="Business Income" value={form.hasBusiness === "yes" ? form.businessType || "Yes" : "No"} />
              <ReviewRow label="Rental / Investments" value={`Rental: ${form.hasRental} · Investments: ${form.hasInvestments}`} />
              <ReviewRow label="IRS Issues" value={form.irsIssue} />
              <ReviewRow label="Referral Source" value={form.referralSource} />
              <ReviewRow label="Documents Ready" value={form.documentsReady.join(", ")} />
              <ReviewRow label="Accommodations" value={form.accommodations} />
              <ReviewRow label="Notes" value={form.notes} />
            </div>
          </>
        )}

        <div className="mt-8 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-6 border-t border-border">
          {step > 1 ? (
            <button
              type="button"
              onClick={goBack}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-surface transition-colors w-full sm:w-auto min-h-11"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          ) : (
            <p className="text-xs text-muted">
              Need help now? Call{" "}
              <a href={contact.phoneHref} className="text-gold font-medium hover:underline">{contact.phone}</a>
            </p>
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy-light transition-colors w-full sm:w-auto min-h-11"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-white hover:bg-gold-light transition-colors w-full sm:w-auto min-h-11"
            >
              Submit Appointment Request
              <CheckCircle2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
