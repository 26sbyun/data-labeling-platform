import Link from "next/link";
import { CASE_STUDIES } from "@/components/case-studies/data";

export default function CaseStudiesPage() {
  return (
    <main className="bg-[#0b0b0b] text-white min-h-screen">
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-semibold">Case Studies</h1>
        <p className="text-gray-400 mt-2">
          Real projects and results from our clients in vision and NLP.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {CASE_STUDIES.map((c) => (
            <Link
              key={c.slug}
              href={`/case-studies/${c.slug}`}
              className="rounded-xl border border-gray-800 bg-black/40 p-6 hover:border-gray-700 transition block"
            >
              <h2 className="text-xl font-semibold">{c.title}</h2>
              <p className="text-sm text-gray-400 mt-1">{c.client}</p>
              <p className="text-gray-300 mt-3">{c.summary}</p>
              <div className="mt-4 text-blue-400 underline text-sm">
                Read case study →
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
