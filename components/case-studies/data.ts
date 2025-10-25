export type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  summary: string;
  results: string[];
  metrics: { label: string; value: string }[];
  body: string[];
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "autonomous-vehicles-qa",
    title: "Improving Object Detection QA for Autonomous Vehicles",
    client: "Top-3 Autonomous Fleet Company",
    summary:
      "Scaled up polygon & instance segmentation QA for 3 M images, cutting label error by 40 %.",
    results: [
      "3 million frames processed",
      "40 % error reduction",
      "24 h feedback loop",
    ],
    metrics: [
      { label: "Frames labeled", value: "3 M +" },
      { label: "Quality Gain", value: "40 %" },
      { label: "Turnaround", value: "< 24 h" },
    ],
    body: [
      "Our client needed a high-throughput QA pipeline for polygon and instance segmentation tasks in urban driving datasets.",
      "We onboarded 45 experienced annotators, set up three-tier review, and implemented sampling + gold-set verification.",
      "A 24-hour feedback loop cut rework and lifted mean IoU by 12 points on the client’s validation split.",
    ],
  },
  {
    slug: "medical-ner",
    title: "Medical NER for Clinical Notes",
    client: "Healthcare AI Startup",
    summary:
      "Created a HIPAA-safe annotation pipeline for entity extraction in clinical notes across four diseases.",
    results: [
      "20 annotators",
      "PHI redaction 99.9 %",
      "85 % model F1 → 92 %",
    ],
    metrics: [
      { label: "Annotators", value: "20" },
      { label: "PHI Accuracy", value: "99.9 %" },
      { label: "Model F1 Gain", value: "+ 7 pts" },
    ],
    body: [
      "We built a secure text annotation workflow with Doccano and internal redaction scripts deployed in Firebase.",
      "Human QA and automatic regex checkers ensured no PHI leakage.",
      "The client’s NER model improved F1 from 85 % to 92 % after finetuning on our labeled set.",
    ],
  },
];
