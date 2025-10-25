import Link from "next/link";

export default function Industries() {
  const industries = [
    "Healthcare & Life Sciences",
    "Robotics & Autonomy",
    "Automotive & ADAS",
    "Retail & E-Commerce",
    "Fintech & Documents",
    "More to Come…",
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-16 text-white bg-[#0b0b0b]">
      <h2 className="text-2xl font-semibold text-center">Industries We Serve</h2>
      <p className="mt-2 text-gray-400 text-center">
        Tailored annotation pipelines for every vertical.
      </p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {industries.map((name) => (
          <Link
            key={name}
            href="/industries"
            className="border border-gray-800 bg-black/40 rounded-xl p-6 hover:border-gray-700 transition"
          >
            <h3 className="text-lg font-medium">{name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
