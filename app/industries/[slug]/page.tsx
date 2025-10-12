// app/industries/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { INDUSTRIES, type IndustrySlug } from "@/components/industries/data";

type Props = { params: { slug: IndustrySlug } };

export function generateMetadata({ params }: Props): Metadata {
  const ind = INDUSTRIES[params.slug];
  if (!ind) return { title: "Industry", description: "Industry details" };
  return { title: `${ind.title} — Industries`, description: ind.summary };
}

export default function IndustryDetailPage({ params }: Props) {
  const ind = INDUSTRIES[params.slug];
  if (!ind) return notFound();

  return (
    <main className="bg-[#0b0b0b] text-white">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-12 pb-8 md:pt-16 md:pb-10">
        <nav className="text-sm text-gray-400">
          <Link href="/industries" className="underline">Industries</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-300">{ind.title}</span>
        </nav>

        <h1 className="mt-3 text-3xl md:text-4xl font-semibold">{ind.title}</h1>
        <p className="mt-2 text-gray-300 max-w-3xl">{ind.summary}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {ind.highlights.map((h) => (
            <span
              key={h}
              className="text-xs md:text-sm border border-gray-700 rounded-full px-3 py-1 bg-black/40 text-gray-200"
            >
              {h}
            </span>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            href="/contact"
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 font-medium"
          >
            Get a tailored scope
          </Link>
          <Link
            href="/pricing"
            className="border border-gray-700 hover:bg-gray-900 text-white rounded-lg px-4 py-2 font-medium"
          >
            See pricing
          </Link>
        </div>
        {ind.ctaNote && (
          <p className="text-xs text-gray-400 mt-2">{ind.ctaNote}</p>
        )}
      </section>

      {/* Use cases */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-semibold">Use cases</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {ind.useCases.map((u) => (
            <div key={u.title} className="rounded-xl border border-gray-800 bg-black/40 p-5">
              <h3 className="text-lg font-medium">{u.title}</h3>
              <p className="text-sm text-gray-300 mt-2">{u.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* QA & compliance notes */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-semibold">Quality & compliance</h2>
        <ul className="mt-4 space-y-2 text-sm text-gray-300">
          {ind.qaNotes.map((n, i) => (
            <li key={i} className="border border-gray-800 bg-black/30 rounded-lg p-3">
              {n}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
