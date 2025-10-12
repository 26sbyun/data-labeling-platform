// components/home/Logos.tsx
"use client";

const logos = [
  { name: "Acme Robotics" },
  { name: "Helix Health" },
  { name: "DriveAI" },
  { name: "RetailOS" },
  { name: "Finlytics" },
  { name: "SkyVision" },
];

export default function Logos() {
  return (
    <section className="bg-[#0b0b0b] text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-center text-gray-400 text-sm">Trusted by data teams at</p>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 items-center">
          {logos.map(({ name }) => (
            <div
              key={name}
              className="h-12 rounded-lg border border-gray-800 bg-black/30 grid place-items-center text-gray-300 text-sm"
              title={name}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
