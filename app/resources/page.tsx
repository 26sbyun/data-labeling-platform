 import Link from "next/link";

export default function ResourcesPage() {
  const sections = [
    { href: "/resources/docs", title: "Documentation", desc: "Guides and setup steps for clients and labelers." },
    { href: "/resources/blog", title: "Blog", desc: "Insights on annotation best practices and AI data quality." },
    { href: "/resources/api", title: "API Reference", desc: "REST API for project creation, file upload, and metadata retrieval." },
  ];

  return (
    <main className="bg-[#0b0b0b] text-white min-h-screen">
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-semibold">Resources</h1>
        <p className="text-gray-400 mt-2">
          Documentation, insights, and API details to help you integrate and optimize your workflows.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="border border-gray-800 bg-black/40 rounded-xl p-6 hover:border-gray-700 transition block"
            >
              <h2 className="text-lg font-semibold">{s.title}</h2>
              <p className="text-gray-400 mt-2">{s.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
