import Link from "next/link";

export default function CompanyPage() {
  const links = [
    { href: "/company/about", label: "About Us" },
    { href: "/company/team", label: "Team" },
    { href: "/company/careers", label: "Careers" },
  ];

  return (
    <main className="bg-[#0b0b0b] text-white min-h-screen">
      <section className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold">Company</h1>
        <p className="text-gray-400 mt-2">
          Learn about our mission, team, and open roles.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="border border-gray-700 rounded-lg px-6 py-3 hover:bg-gray-900 transition"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
