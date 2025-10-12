// components/pricing/Calculator.tsx
"use client";

import { useMemo, useState } from "react";
import { Calculator as CalcIcon, Info } from "lucide-react";
import Link from "next/link";

// ---- Types
type DataType = "image" | "video" | "text";
type Complexity = "basic" | "standard" | "advanced";
type Turnaround = "flex" | "standard" | "rush";

type Inputs = {
  dataType: DataType;
  complexity: Complexity;
  items: number;     // number of images / clips / text items
  avgLenSec: number; // used for video; for image/text ignored
  turnaround: Turnaround;
  qaLayers: number;  // 0,1,2 layers
  dedicatedPm: boolean;
  piiRedaction: boolean;
};

// ---- Pricing model (tweak as you like)
const BASE_RATE: Record<DataType, Record<Complexity, number>> = {
  image: {
    basic: 0.15,      // per image
    standard: 0.35,
    advanced: 0.85,
  },
  video: {
    basic: 0.06,      // per second
    standard: 0.12,
    advanced: 0.25,
  },
  text: {
    basic: 0.02,      // per 100 tokens (approx)
    standard: 0.05,
    advanced: 0.12,
  },
};

// volume discount by total “units”
function volumeDiscount(units: number): number {
  // returns multiplier (<= 1)
  if (units >= 500_000) return 0.72;   // 28% off
  if (units >= 100_000) return 0.78;   // 22% off
  if (units >= 20_000)  return 0.85;   // 15% off
  if (units >= 5_000)   return 0.92;   // 8% off
  return 1.0;
}

// turnaround multipliers
const TURNAROUND_MULT: Record<Turnaround, number> = {
  flex: 0.9,       // flexible timeline discount
  standard: 1.0,
  rush: 1.25,      // rush premium
};

// QA layer % adders on top of base
// (e.g., 1 layer adds +10%, 2 layers adds +18% total)
const QA_LAYER_ADDER: Record<number, number> = {
  0: 0,
  1: 0.10,
  2: 0.18,
};

// Flat monthly add-ons
const DEDICATED_PM_PER_MONTH = 600;       // USD
const PII_REDACTION_PER_ITEM = 0.02;      // USD per unit (image/clip/text)

// Helper: format USD
function usd(n: number): string {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

// Compute billable units based on type
function computeUnits(i: Inputs): number {
  if (i.dataType === "video") {
    // units = items * avg seconds
    const seconds = i.items * Math.max(0, i.avgLenSec);
    return Math.round(seconds);
  }
  // image/text: each item counts as 1 unit
  return Math.max(0, Math.round(i.items));
}

function baseUnitRate(i: Inputs): number {
  return BASE_RATE[i.dataType][i.complexity];
}

export default function Calculator() {
  const [form, setForm] = useState<Inputs>({
    dataType: "image",
    complexity: "standard",
    items: 1000,
    avgLenSec: 8, // for video, average seconds per clip
    turnaround: "standard",
    qaLayers: 1,
    dedicatedPm: false,
    piiRedaction: false,
  });

  const units = useMemo(() => computeUnits(form), [form]);
  const unitRate = useMemo(() => baseUnitRate(form), [form]);

  // Effective rate after adjustments
  const effective = useMemo(() => {
    let r = unitRate;
    // multiply by turnaround factor
    r *= TURNAROUND_MULT[form.turnaround];
    // add QA layers
    r *= (1 + QA_LAYER_ADDER[form.qaLayers]);
    // apply volume discount
    r *= volumeDiscount(units);
    return r;
  }, [form.turnaround, form.qaLayers, unitRate, units]);

  // Core subtotal (before add-ons)
  const coreSubtotal = useMemo(() => units * effective, [units, effective]);

  // Add-ons
  const addOnPII = useMemo(() => (form.piiRedaction ? units * PII_REDACTION_PER_ITEM : 0), [form.piiRedaction, units]);
  // Dedicated PM: show as monthly — we’ll present 1-month estimate here
  const addOnPM = form.dedicatedPm ? DEDICATED_PM_PER_MONTH : 0;

  const grandTotal = coreSubtotal + addOnPII + addOnPM;

  // Implied unit label
  const unitLabel = form.dataType === "video" ? "sec" : "item";

  // Handlers
  const set = <K extends keyof Inputs>(key: K, value: Inputs[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  // Annotations about discount & rate
  const discountMult = volumeDiscount(units);
  const discountPct = Math.round((1 - discountMult) * 100);

  return (
    <section className="border-t border-gray-900">
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-6">
          {/* LEFT: Controls */}
          <div className="rounded-xl border border-gray-800 bg-black/40 p-5">
            <div className="flex items-center gap-2 mb-4">
              <CalcIcon size={18} className="text-blue-300" />
              <h2 className="text-lg font-semibold">Calculator</h2>
            </div>

            {/* Data type */}
            <label className="block text-sm text-gray-300 mb-1">Data type</label>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {(["image", "video", "text"] as DataType[]).map(dt => (
                <button
                  key={dt}
                  onClick={() => set("dataType", dt)}
                  className={`rounded border px-3 py-2 text-sm ${
                    form.dataType === dt
                      ? "border-blue-600 bg-blue-600/20"
                      : "border-gray-700 hover:bg-gray-900"
                  }`}
                >
                  {dt[0].toUpperCase() + dt.slice(1)}
                </button>
              ))}
            </div>

            {/* Complexity */}
            <label className="block text-sm text-gray-300 mb-1">Complexity</label>
            <select
              value={form.complexity}
              onChange={(e) => set("complexity", e.target.value as Complexity)}
              className="w-full border border-gray-700 bg-black text-white rounded px-3 py-2 mb-4"
            >
              <option value="basic">Basic (e.g., single-class box)</option>
              <option value="standard">Standard (multi-class, polygons)</option>
              <option value="advanced">Advanced (segmentation, dense keypoints)</option>
            </select>

            {/* Volume */}
            <label className="block text-sm text-gray-300 mb-1">
              Volume ({unitLabel}s)
            </label>
            <div className="flex items-center gap-3 mb-2">
              <input
                type="range"
                min={form.dataType === "video" ? 10 : 10}
                max={form.dataType === "video" ? 600000 : 200000}
                step={form.dataType === "video" ? 10 : 10}
                value={form.items}
                onChange={(e) => set("items", Number(e.target.value))}
                className="w-full"
              />
              <input
                type="number"
                min={0}
                value={form.items}
                onChange={(e) => set("items", Math.max(0, Number(e.target.value)))}
                className="w-28 border border-gray-700 bg-black text-white rounded px-3 py-2 text-right"
              />
            </div>
            {form.dataType === "video" && (
              <>
                <label className="block text-xs text-gray-400 mb-1">Avg clip length (seconds)</label>
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="range"
                    min={1}
                    max={120}
                    step={1}
                    value={form.avgLenSec}
                    onChange={(e) => set("avgLenSec", Number(e.target.value))}
                    className="w-full"
                  />
                  <input
                    type="number"
                    min={1}
                    value={form.avgLenSec}
                    onChange={(e) => set("avgLenSec", Math.max(1, Number(e.target.value)))}
                    className="w-28 border border-gray-700 bg-black text-white rounded px-3 py-2 text-right"
                  />
                </div>
                <p className="text-xs text-gray-400 mb-4">
                  Billable units = items × seconds (clip length). For example, 1,000 clips × 8s = 8,000 sec.
                </p>
              </>
            )}

            {/* Turnaround */}
            <label className="block text-sm text-gray-300 mb-1">Turnaround</label>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {(["flex", "standard", "rush"] as Turnaround[]).map(t => (
                <button
                  key={t}
                  onClick={() => set("turnaround", t)}
                  className={`rounded border px-3 py-2 text-sm ${
                    form.turnaround === t
                      ? "border-blue-600 bg-blue-600/20"
                      : "border-gray-700 hover:bg-gray-900"
                  }`}
                >
                  {t === "flex" ? "Flexible" : t[0].toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            {/* QA Layers */}
            <label className="block text-sm text-gray-300 mb-1">QA layers</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {[0, 1, 2].map(n => (
                <button
                  key={n}
                  onClick={() => set("qaLayers", n)}
                  className={`rounded border px-3 py-2 text-sm ${
                    form.qaLayers === n
                      ? "border-blue-600 bg-blue-600/20"
                      : "border-gray-700 hover:bg-gray-900"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Each QA layer adds cross-checks. +10% (1 layer), +18% (2 layers).
            </p>

            {/* Add-ons */}
            <div className="mt-4 space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.dedicatedPm}
                  onChange={(e) => set("dedicatedPm", e.target.checked)}
                />
                <span className="text-sm">Dedicated project manager <span className="text-gray-400">({usd(DEDICATED_PM_PER_MONTH)}/month)</span></span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.piiRedaction}
                  onChange={(e) => set("piiRedaction", e.target.checked)}
                />
                <span className="text-sm">PII redaction <span className="text-gray-400">({usd(PII_REDACTION_PER_ITEM)} per {unitLabel})</span></span>
              </label>
            </div>
          </div>

          {/* RIGHT: Summary */}
          <div className="rounded-xl border border-gray-800 bg-black/40 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Info size={18} className="text-blue-300" />
              <h2 className="text-lg font-semibold">Estimate</h2>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Data type</span>
                <span className="text-white">{form.dataType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Complexity</span>
                <span className="text-white">{form.complexity}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-300">Units billed</span>
                <span className="text-white">{units.toLocaleString()} {unitLabel}{units === 1 ? "" : "s"}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-300">Base unit rate</span>
                <span className="text-white">{usd(unitRate)} / {unitLabel}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-300">Turnaround</span>
                <span className="text-white">{form.turnaround} ×{TURNAROUND_MULT[form.turnaround].toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-300">QA layers</span>
                <span className="text-white">{form.qaLayers} ({Math.round(QA_LAYER_ADDER[form.qaLayers]*100)}% adder)</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-300">Volume discount</span>
                <span className="text-white">{discountPct > 0 ? `-${discountPct}%` : "—"}</span>
              </div>

              <hr className="border-gray-800 my-3" />

              <div className="flex justify-between">
                <span className="text-gray-300">Core subtotal</span>
                <span className="text-white">{usd(coreSubtotal)}</span>
              </div>
              {form.piiRedaction && (
                <div className="flex justify-between">
                  <span className="text-gray-300">PII redaction</span>
                  <span className="text-white">{usd(units * PII_REDACTION_PER_ITEM)}</span>
                </div>
              )}
              {form.dedicatedPm && (
                <div className="flex justify-between">
                  <span className="text-gray-300">Dedicated PM (1 mo)</span>
                  <span className="text-white">{usd(DEDICATED_PM_PER_MONTH)}</span>
                </div>
              )}

              <hr className="border-gray-800 my-3" />

              <div className="flex justify-between text-base font-semibold">
                <span>Total estimate</span>
                <span>{usd(grandTotal)}</span>
              </div>
              <p className="text-xs text-gray-400">All estimates in USD. Taxes & special compliance (e.g., HIPAA) quoted separately.</p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 font-medium"
              >
                Get a formal quote
              </Link>
              <Link
                href="/join"
                className="border border-gray-700 hover:bg-gray-900 text-white rounded-lg px-4 py-2 font-medium"
              >
                Join as a labeler
              </Link>
            </div>
          </div>
        </div>

        {/* Hints */}
        <div className="mt-6 text-xs text-gray-400 space-y-1">
          <p>Notes: “Units” are items for image/text, and seconds for video (items × avg seconds).</p>
          <p>We can support bespoke pricing tiers, SLAs, and SOWs for high volumes or specialized domains.</p>
        </div>
      </div>
    </section>
  );
}
