// app/services/page.tsx
import Link from "next/link";
import { SERVICE_LIST } from "@/components/services/data";

export const metadata = {
  title: "Services",
  description: "Image, video, and text annotation services with layered QA.",
};

export default function ServicesIndexPage() {
  return (
    <main className="bg-[#0b0b0b] text-white">
      <section className="max-w-6xl mx-auto px-4 py-14 md:py-20">
        <h1 className="text-3xl md:text-4xl font-semibold">Services</h1>
        <p className="mt-2 text-gray-300 max-w-2xl">
          End-to-end labeling across modalities with secure infrastructure and human-in-the-loop QA.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICE_LIST.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="rounded-xl border border-gray-800 bg-black/40 p-5 hover:border-gray-700 transition block"
            >
              <h3 className="text-lg font-medium">{s.title}</h3>
              <p className="mt-2 text-sm text-gray-300">{s.summary}</p>
              <div className="mt-3 text-blue-400 underline text-sm">Learn more →</div>
            </Link>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-gray-800 bg-black/30 p-4 text-gray-300 text-sm">
          Need something custom?{" "}
          <a href="/contact" className="underline text-blue-400">Talk to us</a>.
        </div>
      </section>
    </main>
  );
}
