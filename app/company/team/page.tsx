export default function TeamPage() {
  const team = [
    { name: "Jane Lee", role: "CEO & Co-founder" },
    { name: "David Byun", role: "CTO & Co-founder" },
    { name: "Aisha Nguyen", role: "Head of Operations" },
  ];

  return (
    <main className="bg-[#0b0b0b] text-white min-h-screen">
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-semibold">Our Team</h1>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {team.map((t) => (
            <div
              key={t.name}
              className="border border-gray-800 bg-black/40 rounded-xl p-6"
            >
              <h3 className="text-lg font-medium">{t.name}</h3>
              <p className="text-gray-400">{t.role}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
