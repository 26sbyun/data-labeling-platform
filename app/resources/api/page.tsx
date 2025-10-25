export default function ApiPage() {
  const endpoints = [
    {
      method: "POST",
      path: "/api/projects",
      desc: "Create a new labeling project",
    },
    {
      method: "GET",
      path: "/api/projects/{id}",
      desc: "Retrieve project details and status",
    },
    {
      method: "POST",
      path: "/api/uploads",
      desc: "Upload a file to Firebase Storage and link it to a project",
    },
  ];

  return (
    <main className="bg-[#0b0b0b] text-white min-h-screen">
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-semibold">API Reference</h1>
        <p className="text-gray-400 mt-2">
          Use our REST API to integrate data labeling and QA directly into your pipeline.
        </p>

        <div className="mt-8 space-y-6">
          {endpoints.map((e) => (
            <div
              key={e.path}
              className="border border-gray-800 bg-black/40 rounded-xl p-5"
            >
              <p className="font-mono text-blue-400">
                {e.method} <span className="text-gray-300">{e.path}</span>
              </p>
              <p className="text-gray-400 mt-2">{e.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-gray-500 text-sm mt-10">
          Authentication is handled via Firebase Auth bearer tokens.
        </p>
      </section>
    </main>
  );
}
