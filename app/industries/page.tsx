// app/industries/page.tsx
import Link from "next/link";
import { INDUSTRY_LIST } from "@/components/industries/data";

export const metadata = {
  title: "Industries",
  description: "Vertical solutions for healthcare, robotics, automotive, retail, and fintech.",
};

export default function IndustriesIndexPage() {
  return (
    <main className="bg-[#0b0b0b] text-white">
      <section className="max-w-6xl mx-auto px-4 py-14 md:py-20">
        <h1 className="text-3xl md:text-4xl font-semibold">Industries</h1>
        <p className="mt-2 text-gray-300 max-w-2xl">
          Purpose-built workflows and QA for your domain. Explore how we support key verticals.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INDUSTRY_LIST.map((ind) => (
            <Link
              key={ind.slug}
              href={`/industries/${ind.slug}`}
              className="rounded-xl border border-gray-800 bg-black/40 p-5 hover:border-gray-700 transition block"
            >
              <h3 className="text-lg font-medium">{ind.title}</h3>
              <p className="mt-2 text-sm text-gray-300">{ind.summary}</p>
              <div className="mt-3 text-blue-400 underline text-sm">Learn more →</div>
            </Link>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-gray-800 bg-black/30 p-4 text-gray-300 text-sm">
          Don’t see your vertical? We support many others.{" "}
          <a href="/contact" className="underline text-blue-400">Talk to us</a>.
        </div>
      </section>
    </main>
  );
}
