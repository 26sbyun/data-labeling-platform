export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  content: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "scaling-label-quality",
    title: "Scaling Label Quality: Human-in-the-Loop Systems",
    date: "2025-06-10",
    summary: "How hybrid automation and expert QA reduce annotation errors at scale.",
    content: [
      "Label quality determines model performance. In this post, we explore how human-in-the-loop systems balance automation and manual QA.",
      "We’ve seen 40% faster review cycles when combining AI-assisted pre-labeling with structured human review.",
    ],
  },
  {
    slug: "choosing-right-annotation-tools",
    title: "Choosing the Right Annotation Tools",
    date: "2025-07-02",
    summary: "Open-source vs proprietary tools: which fits your pipeline?",
    content: [
      "Selecting a tool depends on data type, labeling complexity, and integration needs.",
      "CVAT and Label Studio remain strong open-source choices, while custom tools add scalability and automation.",
    ],
  },
];
