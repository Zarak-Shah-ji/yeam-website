import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CategoryMotif from "@/components/blog/CategoryMotif";
import FeaturedPost from "@/components/blog/FeaturedPost";
import { formatPostDate, publishedPosts, type Post } from "./posts";

export const metadata: Metadata = {
  title: "Yeam Blog",
  description:
    "Research and notes from Yeam: what the public claims data shows about denials, how the agent-driven system behind Yeam is built, and how clinic billing actually works.",
};

function Meta({ post }: { post: Post }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#5A6A8A]">
      <span className="font-medium text-[#1C1C1C]">{post.author}</span>
      <span aria-hidden>·</span>
      <span>{formatPostDate(post.date)}</span>
      <span aria-hidden>·</span>
      <span>{post.readingTime}</span>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#A8BFEE] bg-[#EBF0FA] px-2.5 py-0.5 text-xs font-semibold text-[#1A4FBF]">
      {children}
    </span>
  );
}

/**
 * One card shape for every post. Equal size is enforced by the grid (each cell
 * stretches) plus `h-full` and a `mt-auto` on the meta row, so a short excerpt
 * and a long one still line up. The featured post is lifted out of this grid
 * into the `FeaturedPost` hero above, so cards here are the non-featured ones.
 * A per-category motif bleeds from the corner behind the content (which sits on
 * its own `z-10` layer so the text stays crisp).
 */
function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#E0E6F5] bg-white px-6 py-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <CategoryMotif tag={post.tag} />
      <div className="relative z-10 flex flex-1 flex-col">
        <div className="flex items-center gap-2.5">
          <Tag>{post.tag}</Tag>
        </div>
        <h2 className="mt-4 text-xl font-bold leading-snug tracking-tight text-[#1C1C1C]">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#4A5A7A]">{post.excerpt}</p>
        <div className="mt-auto pt-5">
          <Meta post={post} />
        </div>
      </div>
    </Link>
  );
}

export default function BlogIndex() {
  const posts = publishedPosts();
  const featured = posts.find((p) => p.featured);
  const rest = featured ? posts.filter((p) => p !== featured) : posts;

  return (
    <>
      <Nav />
      <main className="bg-[#FFFFFF] px-6 pt-28 pb-20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#1A4FBF]">Blog</p>
          <h1 className="mb-4 text-3xl font-light tracking-tight text-[#1C1C1C] md:text-5xl">
            Research &amp; notes
          </h1>
          <p className="max-w-2xl text-lg text-[#4A5A7A]">
            What we are researching and building: the public data behind medical-claim denials, how the
            agent-driven system behind Yeam works, and how clinic billing actually plays out.
          </p>

          {featured && <FeaturedPost post={featured} />}

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
