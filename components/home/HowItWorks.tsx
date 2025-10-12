// components/home/HowItWorks.tsx
"use client";

import { ClipboardList, Upload, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    title: "1. Scope & Sample",
    desc: "Share guidelines and a small batch. We align on definitions, edge cases, and QA.",
    icon: ClipboardList,
  },
  {
    title: "2. Upload & Track",
    desc: "Securely upload data to your project. Monitor progress from your dashboard.",
    icon: Upload,
  },
  {
    title: "3. Review & Iterate",
    desc: "We run layered QA. You review outputs, request tweaks, and scale confidently.",
    icon: CheckCircle2,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#0b0b0b] text-white">
      <div className="max-w-6xl mx-auto px-4 py-14 md:py-20">
        <div className="md:flex items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold">How it works</h2>
            <p className="mt-2 text-gray-300 max-w-2xl">
              A simple, quality-first process that lets you ship reliable datasets faster.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              href="/contact"
              className="inline-block bg-blue-600 hover:bg-blue-500 rounded-lg px-4 py-2 font-medium"
            >
              Start a pilot
            </Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map(({ title, desc, icon: Icon }) => (
            <div
              key={title}
              className="rounded-xl border border-gray-800 bg-black/40 p-6"
            >
              <div className="h-10 w-10 rounded-lg bg-blue-600/15 border border-blue-600/30 grid place-items-center">
                <Icon size={18} className="text-blue-300" />
              </div>
              <h3 className="mt-4 text-lg font-medium">{title}</h3>
              <p className="mt-2 text-sm text-gray-300">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
