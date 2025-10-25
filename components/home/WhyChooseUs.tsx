export default function WhyChooseUs() {
  const items = [
    {
      title: "Quality First",
      desc: "Multi-layer QA with consensus and gold-set validation.",
    },
    {
      title: "Secure by Design",
      desc: "SOC 2-ready cloud setup, data encryption, and access control.",
    },
    {
      title: "Scalable Teams",
      desc: "Elastic workforce matched to your data type and volume.",
    },
    {
      title: "Expert Support",
      desc: "Dedicated PMs and ML-aware QA leads for every project.",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-16 border-t border-gray-800 text-white bg-[#0b0b0b]">
      <h2 className="text-2xl font-semibold text-center">Why Choose Us</h2>
      <p className="mt-2 text-gray-400 text-center">
        We combine domain expertise, process rigor, and scalable infrastructure.
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-gray-800 bg-black/40 p-6 hover:border-gray-700 transition"
          >
            <h3 className="text-lg font-medium mb-2">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
