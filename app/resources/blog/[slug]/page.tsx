import { notFound } from "next/navigation";
import Link from "next/link";
import { BLOG_POSTS } from "@/components/blog/data";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) return notFound();

  return (
    <main className="bg-[#0b0b0b] text-white min-h-screen">
      <section className="max-w-3xl mx-auto px-4 py-16">
        <nav className="text-sm text-gray-400 mb-4">
          <Link href="/resources/blog" className="underline">
            Blog
          </Link>{" "}
          / <span className="text-gray-300">{post.title}</span>
        </nav>

        <h1 className="text-3xl font-semibold">{post.title}</h1>
        <p className="text-gray-400 mt-1">{post.date}</p>

        <div className="mt-8 space-y-4 text-gray-300">
          {post.content.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>
    </main>
  );
}
