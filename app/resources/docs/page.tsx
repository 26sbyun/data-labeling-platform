export default function DocsPage() {
  return (
    <main className="bg-[#0b0b0b] text-white min-h-screen">
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-semibold">Documentation</h1>
        <p className="text-gray-400 mt-2">
          Setup guides for clients and labeling partners.
        </p>

        <div className="mt-8 space-y-8 text-gray-300">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Getting Started</h2>
            <p>
              1. Create an account and log in.<br />
              2. Go to your dashboard to start a new project.<br />
              3. Upload sample files and review label outputs.<br />
              4. Scale to production datasets securely.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Project Workflow</h2>
            <p>
              Each project contains tasks, label definitions, and quality checks.
              Our backend manages reviewer assignment and consensus QA.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">FAQ</h2>
            <p>
              <strong>Q:</strong> How do I request custom guidelines?<br />
              <strong>A:</strong> Contact your project manager or reach out via <span className="text-blue-400">support@datalabeling.com</span>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
