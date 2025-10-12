// components/home/Services.tsx
import { Image as ImageIcon, Video, FileText, Languages, Layers, Brain } from "lucide-react";
import Link from "next/link";

const services = [
  {
    title: "Image Annotation",
    desc: "Bounding boxes, polygons, keypoints, semantic/instance segmentation.",
    icon: ImageIcon,
  },
  {
    title: "Video Annotation",
    desc: "Frame-accurate tracking, activity tagging, multi-object timelines.",
    icon: Video,
  },
  {
    title: "Text & NLP",
    desc: "Classification, entity extraction (NER), sentiment, intent, RAG curation.",
    icon: FileText,
  },
  {
    title: "Multilingual",
    desc: "Native speakers across domains for high-fidelity language tasks.",
    icon: Languages,
  },
  {
    title: "Data Ops",
    desc: "De-duplication, stratified sampling, redaction, QC pipelines.",
    icon: Layers,
  },
  {
    title: "Model-in-the-loop",
    desc: "Active learning and LLM-assisted reviews to boost throughput.",
    icon: Brain,
  },
];

export default function Services() {
  return (
    <section className="bg-[#0b0b0b] text-white">
      <div className="max-w-6xl mx-auto px-4 py-14 md:py-20">
        <div className="md:flex items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold">Services</h2>
            <p className="mt-2 text-gray-300 max-w-2xl">
              From dataset bootstrapping to full production pipelines, we cover
              computer vision, NLP, and data operations with rigorous QA.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              href="/pricing"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 font-medium"
            >
              See pricing
            </Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(({ title, desc, icon: Icon }) => (
            <div
              key={title}
              className="rounded-xl border border-gray-800 bg-black/40 p-5 hover:border-gray-700 transition"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-600/15 border border-blue-600/30 grid place-items-center">
                  <Icon size={18} className="text-blue-300" />
                </div>
                <h3 className="text-lg font-medium">{title}</h3>
              </div>
              <p className="mt-3 text-sm text-gray-300">{desc}</p>
              <div className="mt-4">
                <Link href="/contact" className="text-blue-400 hover:text-blue-300 underline">
                  Talk to an engineer →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Industries strip (lightweight teaser) */}
        <div className="mt-10 rounded-xl border border-gray-800 bg-black/30 p-4 text-gray-300 text-sm">
          Serving teams in healthcare, robotics, automotive, retail, and fintech.{" "}
          <Link href="/contact" className="underline text-blue-400">Get a tailored scope</Link>.
        </div>
      </div>
    </section>
  );
}
