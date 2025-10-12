// components/industries/data.ts

export type IndustrySlug = "healthcare" | "robotics" | "automotive" | "retail" | "fintech";

export type Industry = {
  slug: IndustrySlug;
  title: string;
  summary: string;
  highlights: string[];     // bullets near top
  useCases: { title: string; desc: string }[]; // cards grid
  qaNotes: string[];        // quality/compliance notes
  ctaNote?: string;         // small line under CTA
};

export const INDUSTRIES: Record<IndustrySlug, Industry> = {
  healthcare: {
    slug: "healthcare",
    title: "Healthcare & Life Sciences",
    summary:
      "HIPAA-aware annotation for medical imaging, clinical text, and biotech R&D with layered QA and access controls.",
    highlights: [
      "PHI redaction workflows & access controls",
      "Radiology & pathology imaging support",
      "Clinical NER, normalization, and de-identification",
    ],
    useCases: [
      { title: "Medical Imaging", desc: "Boxes/polygons for organs, lesions, and devices; pathology region marking." },
      { title: "Clinical NLP", desc: "Entity extraction (conditions, meds), normalization (SNOMED/ICD), negation handling." },
      { title: "Redaction", desc: "PII/PHI scrubbing for text and image overlays with reviewer verification." },
    ],
    qaNotes: [
      "Double-blind reviews with consensus for critical labels.",
      "Audit logs and reviewer qualification gating.",
      "Region-based processing available on request.",
    ],
    ctaNote: "HIPAA BAAs and custom DPAs available.",
  },
  robotics: {
    slug: "robotics",
    title: "Robotics & Autonomy",
    summary:
      "High-precision CV annotations for perception, mapping, and manipulation with temporal consistency checks.",
    highlights: [
      "Tracking across frames for multi-object scenes",
      "3D boxes / LiDAR (if provided) and depth awareness",
      "Edge-case libraries and scene diversity balancing",
    ],
    useCases: [
      { title: "Perception", desc: "Instance/semantic segmentation for navigation and obstacle detection." },
      { title: "Pose & Keypoints", desc: "Human/object keypoint sets for interaction and safety zones." },
      { title: "Temporal QA", desc: "Track ID consistency, occlusion handling, and quality drift detection." },
    ],
    qaNotes: [
      "Golden sets and temporal spot-checks.",
      "Difficulty stratification to focus reviews on hard samples.",
    ],
  },
  automotive: {
    slug: "automotive",
    title: "Automotive & ADAS",
    summary:
      "Production-grade datasets for ADAS perception, driver monitoring, and scene understanding with strict QA.",
    highlights: [
      "Lane/road marking, traffic light/sign detection",
      "Driver monitoring and gaze estimation support",
      "Adverse weather and night scenario balancing",
    ],
    useCases: [
      { title: "Road Scene", desc: "Boxes, polygons, lanes, and drivable area segmentation." },
      { title: "Driver Monitoring", desc: "Facial landmarks, eye states, and distraction events." },
      { title: "Event Tagging", desc: "Near-miss incidents, cut-ins, and rule violations." },
    ],
    qaNotes: [
      "Consensus-based corrections with escalation.",
      "Geo/time coverage tracking and sampling controls.",
    ],
  },
  retail: {
    slug: "retail",
    title: "Retail & Commerce",
    summary:
      "Catalog, shelf, and receipt annotations with SKU-level precision and OCR-friendly reviews.",
    highlights: [
      "OCR verification loops and normalization",
      "Multi-language product data cleaning",
      "Shelf compliance checks and facings counts",
    ],
    useCases: [
      { title: "Catalog", desc: "Attribute labeling, variant grouping, and dedupe for PDP quality." },
      { title: "Shelf Vision", desc: "Object detection, facings counts, out-of-stock detection." },
      { title: "Receipts", desc: "Line-item extraction, taxes, and merchant normalization." },
    ],
    qaNotes: [
      "Terminology/attribute dictionaries per client.",
      "LLM-in-the-loop acceleration with human verification.",
    ],
  },
  fintech: {
    slug: "fintech",
    title: "Fintech & Documents",
    summary:
      "Document parsing, KYC redaction, and entity linking with strict privacy guarantees.",
    highlights: [
      "Sensitive data handling and masking",
      "NER, document layout, and table extraction",
      "Fraud signals enrichment and normalization",
    ],
    useCases: [
      { title: "KYC / Onboarding", desc: "ID redaction, field extraction, and validation workflows." },
      { title: "Banking Docs", desc: "Statements, invoices, and contracts parsing with layout awareness." },
      { title: "Risk & Fraud", desc: "Entity linking and anomaly tags for downstream scoring." },
    ],
    qaNotes: [
      "Access scoping and reviewer attestation.",
      "PII-aware pipelines with audit trails.",
    ],
  },
};

export const INDUSTRY_LIST: Industry[] = Object.values(INDUSTRIES);
