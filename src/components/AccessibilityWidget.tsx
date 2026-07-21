"use client";

import Link from "next/link";
import {
  Accessibility,
  ALargeSmall,
  Contrast,
  Link2,
  Pause,
  RotateCcw,
  Type,
  X,
} from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";

type Prefs = {
  textScale: number;
  highContrast: boolean;
  underlineLinks: boolean;
  reduceMotion: boolean;
  readableFont: boolean;
};

const STORAGE_KEY = "tbts-a11y-prefs";
const DEFAULTS: Prefs = {
  textScale: 100,
  highContrast: false,
  underlineLinks: false,
  reduceMotion: false,
  readableFont: false,
};

function applyPrefs(prefs: Prefs) {
  const root = document.documentElement;
  root.style.setProperty("--a11y-text-scale", `${prefs.textScale / 100}`);
  root.classList.toggle("a11y-high-contrast", prefs.highContrast);
  root.classList.toggle("a11y-underline-links", prefs.underlineLinks);
  root.classList.toggle("a11y-reduce-motion", prefs.reduceMotion);
  root.classList.toggle("a11y-readable-font", prefs.readableFont);
  root.dataset.a11yText = String(prefs.textScale);
}

function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

export default function AccessibilityWidget() {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const [ready, setReady] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const initial = loadPrefs();
    setPrefs(initial);
    applyPrefs(initial);
    setReady(true);
  }, []);

  const update = useCallback((patch: Partial<Prefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      applyPrefs(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore quota / private mode */
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusable[0]?.focus();
  }, [open]);

  if (!ready) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[90] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label="Accessibility options"
          className="w-[min(100vw-2rem,22rem)] rounded-2xl border border-border bg-surface-elevated p-4 shadow-[0_20px_50px_rgba(20,38,22,0.25)]"
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-navy">Accessibility</p>
              <p className="mt-0.5 text-xs text-muted">Adjust the site to your needs. Preferences save on this device.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                buttonRef.current?.focus();
              }}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-foreground hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label="Close accessibility panel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-border bg-surface p-3">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                <ALargeSmall className="h-4 w-4 text-navy" aria-hidden />
                Text size
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => update({ textScale: Math.max(90, prefs.textScale - 10) })}
                  disabled={prefs.textScale <= 90}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-border bg-surface-elevated text-sm font-bold disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  aria-label="Decrease text size"
                >
                  A−
                </button>
                <span className="flex-1 text-center text-sm font-medium tabular-nums" aria-live="polite">
                  {prefs.textScale}%
                </span>
                <button
                  type="button"
                  onClick={() => update({ textScale: Math.min(150, prefs.textScale + 10) })}
                  disabled={prefs.textScale >= 150}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-border bg-surface-elevated text-sm font-bold disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  aria-label="Increase text size"
                >
                  A+
                </button>
              </div>
            </div>

            <ToggleRow
              icon={<Contrast className="h-4 w-4 text-navy" aria-hidden />}
              label="High contrast"
              description="Stronger colors for easier reading"
              checked={prefs.highContrast}
              onChange={(v) => update({ highContrast: v })}
            />
            <ToggleRow
              icon={<Link2 className="h-4 w-4 text-navy" aria-hidden />}
              label="Underline links"
              description="Make all links easier to spot"
              checked={prefs.underlineLinks}
              onChange={(v) => update({ underlineLinks: v })}
            />
            <ToggleRow
              icon={<Pause className="h-4 w-4 text-navy" aria-hidden />}
              label="Reduce motion"
              description="Pause animations and auto-sliding"
              checked={prefs.reduceMotion}
              onChange={(v) => update({ reduceMotion: v })}
            />
            <ToggleRow
              icon={<Type className="h-4 w-4 text-navy" aria-hidden />}
              label="Readable font"
              description="Use a clearer, more spaced typeface"
              checked={prefs.readableFont}
              onChange={(v) => update({ readableFont: v })}
            />

            <button
              type="button"
              onClick={() => {
                applyPrefs(DEFAULTS);
                setPrefs(DEFAULTS);
                try {
                  localStorage.removeItem(STORAGE_KEY);
                } catch {
                  /* ignore */
                }
              }}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-3 text-sm font-semibold text-foreground transition-colors hover:border-navy hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Reset preferences
            </button>

            <Link
              href="/accessibility"
              className="block text-center text-sm font-medium text-navy underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              onClick={() => setOpen(false)}
            >
              Full accessibility statement
            </Link>
          </div>
        </div>
      )}

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-navy px-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(47,122,40,0.4)] transition-transform hover:bg-navy-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2"
      >
        <Accessibility className="h-5 w-5 shrink-0" aria-hidden />
        <span>Accessibility</span>
      </button>
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-border bg-surface p-3">
      <label htmlFor={id} className="min-w-0 cursor-pointer">
        <span className="mb-0.5 flex items-center gap-2 text-sm font-semibold text-foreground">
          {icon}
          {label}
        </span>
        <span className="block text-xs text-muted">{description}</span>
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
          checked ? "bg-navy" : "bg-slate-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
        <span className="sr-only">{checked ? "On" : "Off"}</span>
      </button>
    </div>
  );
}
