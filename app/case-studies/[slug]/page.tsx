import { notFound } from "next/navigation";
import Link from "next/link";
import { CASE_STUDIES } from "@/components/case-studies/data";

export default function CaseStudyDetail({ params }: { params: { slug: string } }) {
  const study = CASE_STUDIES.find((c) => c.slug === params.slug);
  if (!study) return notFound();

  return (
    <main className="bg-[#0b0b0b] text-white min-h-screen">
      <section className="max-w-4xl mx-auto px-4 py-16">
        <nav className="text-sm text-gray-400 mb-4">
          <Link href="/case-studies" className="underline">
            Case Studies
          </Link>{" "}
          / <span className="text-gray-300">{study.title}</span>
        </nav>

        <h1 className="text-3xl font-semibold">{study.title}</h1>
        <p className="text-gray-400 mt-2">{study.client}</p>
        <p className="mt-4 text-gray-300">{study.summary}</p>

        <div className="mt-6 flex flex-wrap gap-4">
          {study.metrics.map((m) => (
            <div
              key={m.label}
              className="border border-gray-800 rounded-lg bg-black/40 px-5 py-3"
            >
              <p className="text-gray-400 text-sm">{m.label}</p>
              <p className="text-xl font-semibold text-white">{m.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-4 text-gray-300">
          {study.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/contact"
            className="bg-blue-600 hover:bg-blue-500 rounded-lg px-5 py-3 font-medium"
          >
            Start a Project →
          </Link>
        </div>
      </section>
    </main>
  );
}
