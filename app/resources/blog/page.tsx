import Link from "next/link";
import { BLOG_POSTS } from "@/components/blog/data";

export default function BlogPage() {
  return (
    <main className="bg-[#0b0b0b] text-white min-h-screen">
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-semibold">Blog</h1>
        <p className="text-gray-400 mt-2">
          Insights and best practices from our data labeling experts.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/resources/blog/${post.slug}`}
              className="border border-gray-800 bg-black/40 rounded-xl p-6 hover:border-gray-700 transition block"
            >
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-400 text-sm mt-1">{post.date}</p>
              <p className="text-gray-300 mt-3">{post.summary}</p>
              <div className="mt-4 text-blue-400 underline text-sm">
                Read more →
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
