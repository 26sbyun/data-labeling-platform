// components/home/FAQ.tsx
"use client";

import { useState } from "react";

type QA = { q: string; a: string };

const faqs: QA[] = [
  {
    q: "What data types do you support?",
    a: "Images, videos, and text out of the box. We also support JSON/CSV metadata, plus custom schemas for niche tasks.",
  },
  {
    q: "How do you ensure quality?",
    a: "Layered QA: guideline calibration, gold sets, double-blind reviews, consensus checks, and spot-audits. We track accuracy and inter-annotator agreement.",
  },
  {
    q: "Can I integrate my models?",
    a: "Yes. We can pre-label with your model and route low-confidence items to human review (active learning).",
  },
  {
    q: "Where is my data stored?",
    a: "Your data lives in your Firebase project’s Storage bucket and Firestore. Access is scoped per-project and per-user via rules.",
  },
  {
    q: "Do you handle NDAs and privacy?",
    a: "Absolutely. We can provide NDAs, role-based access, PII redaction workflows, and region-based processing upon request.",
  },
];

function Item({ qa, open, onToggle }: { qa: QA; open: boolean; onToggle: () => void }) {
  return (
    <div className="border border-gray-800 rounded-lg bg-black/40">
      <button
        onClick={onToggle}
        className="w-full text-left px-4 py-3 focus:outline-none"
        aria-expanded={open}
      >
        <div className="flex items-center justify-between">
          <span className="font-medium text-white">{qa.q}</span>
          <span className="text-gray-400">{open ? "–" : "+"}</span>
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-0 text-gray-300 text-sm">
          {qa.a}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section className="bg-[#0b0b0b] text-white">
      <div className="max-w-6xl mx-auto px-4 py-14 md:py-20">
        <h2 className="text-3xl md:text-4xl font-semibold">Frequently asked questions</h2>
        <p className="mt-2 text-gray-300 max-w-2xl">
          Straight answers to common questions about data types, quality, and security.
        </p>

        <div className="mt-8 space-y-3">
          {faqs.map((qa, i) => (
            <Item
              key={qa.q}
              qa={qa}
              open={openIdx === i}
              onToggle={() => setOpenIdx((p) => (p === i ? null : i))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
