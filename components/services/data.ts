// components/services/data.ts

export type ServiceSlug =
  | "image-annotation"
  | "video-annotation"
  | "text-nlp"
  | "multilingual"
  | "data-ops"
  | "model-in-the-loop";

export type Service = {
  slug: ServiceSlug;
  title: string;
  summary: string;
  bullets: string[]; // quick highlights
  offerings: { title: string; desc: string }[]; // card grid
  tooling: string[]; // tools/platforms you support
  ctaNote?: string;
};

export const SERVICES: Record<ServiceSlug, Service> = {
  "image-annotation": {
    slug: "image-annotation",
    title: "Image Annotation",
    summary:
      "High-precision computer vision labeling with layered QA and reviewer qualification.",
    bullets: [
      "Boxes, polygons, circles, and lines",
      "Instance & semantic segmentation",
      "Keypoints/skeletons and attributes",
    ],
    offerings: [
      { title: "Detection & Segmentation", desc: "Multi-class boxes, polygons, and pixel masks with consensus QA." },
      { title: "Landmarks / Keypoints", desc: "Pose sets for people and objects, plus visibility/occlusion flags." },
      { title: "Attributes & Taxonomy", desc: "Hierarchical attributes and per-instance metadata with validation." },
    ],
    tooling: ["Label Studio", "CVAT", "Custom (Firebase Storage)", "Python QA scripts"],
  },

  "video-annotation": {
    slug: "video-annotation",
    title: "Video Annotation",
    summary:
      "Frame-accurate tracking and temporal QA for perception and activity understanding.",
    bullets: [
      "Multi-object tracking across frames",
      "Actions/events and timeline tags",
      "ID consistency and occlusions",
    ],
    offerings: [
      { title: "Tracking", desc: "Track IDs, re-identification, and drift checks in complex scenes." },
      { title: "Temporal Labels", desc: "Events, activities, and multi-label timelines with audit trails." },
      { title: "Scene QA", desc: "Spot checks for ID swaps, missed frames, and long-tail failure modes." },
    ],
    tooling: ["CVAT", "Custom reviewers", "FFmpeg utilities"],
  },

  "text-nlp": {
    slug: "text-nlp",
    title: "Text & NLP",
    summary:
      "Annotation for classification, extraction, and generation with robust guideline calibration.",
    bullets: [
      "Classification & sentiment",
      "NER + normalization",
      "RAG curation & redaction",
    ],
    offerings: [
      { title: "Classification", desc: "Topic, intent, sentiment, and multi-label taxonomy with agreement checks." },
      { title: "NER & Linking", desc: "Entity spans, normalization (e.g., ICD/SNOMED), and relation extraction." },
      { title: "Curation", desc: "RAG dataset curation, dedupe, and safety filtering with reviewer verification." },
    ],
    tooling: ["Prodigy", "Doccano", "Custom tools", "LLM assistance (verify-only)"],
  },

  multilingual: {
    slug: "multilingual",
    title: "Multilingual",
    summary:
      "Native-speaking reviewers for high-fidelity language tasks across locales and domains.",
    bullets: [
      "Guideline localization",
      "Cross-lingual QA",
      "Locale-specific edge cases",
    ],
    offerings: [
      { title: "Localization", desc: "Translate and adapt guidelines; align on regional terminology and style." },
      { title: "Multilingual NLP", desc: "Sentiment, NER, and intent across languages with specific dialect coverage." },
      { title: "QA & Consistency", desc: "Review pipelines with bilingual leads and agreement targets." },
    ],
    tooling: ["Human reviewers", "Glossaries", "Termbases", "LLM assistance (verify-only)"],
  },

  "data-ops": {
    slug: "data-ops",
    title: "Data Ops",
    summary:
      "Dataset operations: sampling, dedupe, normalization, and privacy-preserving preprocessing.",
    bullets: [
      "Stratified sampling and balancing",
      "Deduplication and near-dup detection",
      "PII/PHI redaction workflows",
    ],
    offerings: [
      { title: "Curation & Balancing", desc: "Stratified sampling and distribution tracking for robust datasets." },
      { title: "Cleaning", desc: "Near-dup detection, bad-data filtering, and schema normalization." },
      { title: "Privacy", desc: "PII/PHI scrubbing for text and images with double-review." },
    ],
    tooling: ["Python / Pandas", "OpenCV", "Faiss / ANN", "Regex/heuristics"],
  },

  "model-in-the-loop": {
    slug: "model-in-the-loop",
    title: "Model in the Loop",
    summary:
      "Active learning and human verification to boost throughput without sacrificing quality.",
    bullets: [
      "Pre-labeling & triage",
      "Uncertainty sampling",
      "Cost-quality optimization",
    ],
    offerings: [
      { title: "Pre-labeling", desc: "Use model outputs as suggestions; route low-confidence cases to humans." },
      { title: "Prioritization", desc: "Focus reviewers on impactful items via uncertainty and value scoring." },
      { title: "Feedback Loop", desc: "Iterative training with gold sets and regression checks." },
    ],
    tooling: ["Python", "Your models", "LLM assistance (verify-only)"],
  },
};

export const SERVICE_LIST: Service[] = Object.values(SERVICES);
