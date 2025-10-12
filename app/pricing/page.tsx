// app/pricing/page.tsx
import Calculator from "@/components/pricing/Calculator";

export default function PricingPage() {
  return (
    <main className="bg-[#0b0b0b] text-white">
      <section className="max-w-6xl mx-auto px-4 py-10 md:py-14">
        <h1 className="text-3xl md:text-4xl font-semibold">Pricing</h1>
        <p className="mt-2 text-gray-300 max-w-2xl">
          Estimate your project cost based on data type, complexity, volume, and QA options.
          For custom scopes or SLAs, <a href="/contact" className="underline text-blue-400">contact us</a>.
        </p>
      </section>

      <Calculator />
    </main>
  );
}
