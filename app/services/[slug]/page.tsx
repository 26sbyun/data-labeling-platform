// app/services/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICES, type ServiceSlug } from "@/components/services/data";

type Props = { params: { slug: ServiceSlug } };

export function generateMetadata({ params }: Props): Metadata {
  const svc = SERVICES[params.slug];
  if (!svc) return { title: "Service", description: "Service details" };
  return { title: `${svc.title} — Services`, description: svc.summary };
}

export default function ServiceDetailPage({ params }: Props) {
  const svc = SERVICES[params.slug];
  if (!svc) return notFound();

  return (
    <main className="bg-[#0b0b0b] text-white">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-12 pb-8 md:pt-16 md:pb-10">
        <nav className="text-sm text-gray-400">
          <Link href="/services" className="underline">Services</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-300">{svc.title}</span>
        </nav>

        <h1 className="mt-3 text-3xl md:text-4xl font-semibold">{svc.title}</h1>
        <p className="mt-2 text-gray-300 max-w-3xl">{svc.summary}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {svc.bullets.map((b) => (
            <span
              key={b}
              className="text-xs md:text-sm border border-gray-700 rounded-full px-3 py-1 bg-black/40 text-gray-200"
            >
              {b}
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
        {svc.ctaNote && <p className="text-xs text-gray-400 mt-2">{svc.ctaNote}</p>}
      </section>

      {/* Offerings */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-semibold">What we offer</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {svc.offerings.map((o) => (
            <div key={o.title} className="rounded-xl border border-gray-800 bg-black/40 p-5">
              <h3 className="text-lg font-medium">{o.title}</h3>
              <p className="text-sm text-gray-300 mt-2">{o.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tooling */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-semibold">Tooling & workflow</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {svc.tooling.map((t) => (
            <span
              key={t}
              className="text-sm border border-gray-700 rounded-lg px-3 py-1 bg-black/30 text-gray-200"
            >
              {t}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
