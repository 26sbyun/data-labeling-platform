// components/home/Hero.tsx
"use client";

import Link from "next/link";
import { Shield, Zap, Rocket, Check } from "lucide-react";
import { useEffect, useState } from "react";

function CountUp({ to = 0, duration = 1000 }: { to: number; duration?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round(to * p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <span className="tabular-nums">{n.toLocaleString()}</span>;
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-black to-[#0b0b0b] text-white">
      <div className="absolute inset-0 pointer-events-none opacity-40"
           style={{
             background:
               "radial-gradient(1200px 400px at 50% -10%, rgba(37,99,235,0.25), transparent 60%)",
           }}
      />
      <div className="max-w-6xl mx-auto px-4 pt-16 pb-12 md:pt-24 md:pb-20 relative">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-800 bg-black/40 px-3 py-1 text-xs text-gray-300">
          <Shield size={14} /> Quality-controlled data labeling
        </div>

        {/* Headline */}
        <h1 className="mt-5 text-4xl md:text-6xl font-semibold leading-tight">
          Production-grade <span className="text-blue-400">Data Labeling</span> for AI teams
        </h1>

        {/* Subhead */}
        <p className="mt-4 max-w-2xl text-gray-300">
          Scale image, video, and text annotations with human-in-the-loop QA, live dashboards,
          and project-scoped uploads — all powered by Firebase and Next.js.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/pricing"
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-5 py-2.5 font-medium"
          >
            View Pricing
          </Link>
          <Link
            href="/contact"
            className="border border-gray-700 hover:bg-gray-900 rounded-lg px-5 py-2.5 font-medium"
          >
            Talk to us
          </Link>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Check size={16} className="text-green-400" />
            No vendor lock-in
          </div>
        </div>

        {/* Trust bullets */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-400">
          <div className="inline-flex items-center gap-2">
            <Zap size={16} className="text-yellow-300" /> Fast turnaround
          </div>
          <div className="inline-flex items-center gap-2">
            <Shield size={16} className="text-blue-300" /> Secure by design
          </div>
          <div className="inline-flex items-center gap-2">
            <Rocket size={16} className="text-purple-300" /> Scales with you
          </div>
        </div>

        {/* Stat blocks */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-gray-800 bg-black/40 p-4">
            <div className="text-2xl font-semibold">
              <CountUp to={120} duration={900} />+
            </div>
            <div className="text-gray-400 text-sm">Projects delivered</div>
          </div>
          <div className="rounded-xl border border-gray-800 bg-black/40 p-4">
            <div className="text-2xl font-semibold">
              <CountUp to={500000} duration={1100} />
            </div>
            <div className="text-gray-400 text-sm">Annotations completed</div>
          </div>
          <div className="rounded-xl border border-gray-800 bg-black/40 p-4">
            <div className="text-2xl font-semibold">
              <CountUp to={98} duration={1200} />%
            </div>
            <div className="text-gray-400 text-sm">Avg. QA accuracy</div>
          </div>
          <div className="rounded-xl border border-gray-800 bg-black/40 p-4">
            <div className="text-2xl font-semibold">
              <CountUp to={24} duration={800} />h
            </div>
            <div className="text-gray-400 text-sm">Typical kickoff</div>
          </div>
        </div>
      </div>
    </section>
  );
}
