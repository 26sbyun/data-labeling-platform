export default function CareersPage() {
  const jobs = [
    {
      title: "Frontend Engineer",
      desc: "React + Next.js developer with UI/UX sense and Tailwind experience.",
    },
    {
      title: "Labeling Operations Manager",
      desc: "Manage global labeling workforce and client projects.",
    },
  ];

  return (
    <main className="bg-[#0b0b0b] text-white min-h-screen">
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-semibold">Careers</h1>
        <p className="text-gray-400 mt-2">
          Join our mission to build the future of human-in-the-loop AI data pipelines.
        </p>
        <div className="mt-8 grid gap-4">
          {jobs.map((j) => (
            <div
              key={j.title}
              className="border border-gray-800 bg-black/40 rounded-xl p-6"
            >
              <h3 className="text-lg font-medium">{j.title}</h3>
              <p className="text-gray-300 mt-2">{j.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
