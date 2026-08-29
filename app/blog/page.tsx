import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { formatPostDate, publishedPosts, type Post } from "./posts";

export const metadata: Metadata = {
  title: "Yeam Blog",
  description:
    "Research and notes from Yeam: what the public claims data shows about denials, how our agent-driven EHR is built, and how clinic billing actually works.",
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

function FeaturedCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group mt-10 block rounded-2xl border border-[#E0E6F5] bg-white px-6 py-7 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:px-8 sm:py-8"
    >
      <div className="flex items-center gap-3">
        <Tag>{post.tag}</Tag>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8A9BBF]">Featured</span>
      </div>
      <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#1C1C1C] sm:text-3xl">
        {post.title}
      </h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#4A5A7A]">{post.excerpt}</p>
      <div className="mt-5">
        <Meta post={post} />
      </div>
    </Link>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl border border-[#E0E6F5] bg-white px-5 py-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <Tag>{post.tag}</Tag>
      <h3 className="mt-3 text-lg font-semibold leading-snug text-[#1C1C1C]">
        {post.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#4A5A7A]">{post.excerpt}</p>
      <div className="mt-4 pt-1">
        <Meta post={post} />
      </div>
    </Link>
  );
}

export default function BlogIndex() {
  const posts = publishedPosts();
  const featured = posts.find((p) => p.featured);
  const rest = posts.filter((p) => p !== featured);

  return (
    <>
      <Nav />
      <main className="bg-[#FFFFFF] px-6 pt-28 pb-20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#1A4FBF]">Blog</p>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-[#1C1C1C] md:text-4xl">
            Research &amp; notes
          </h1>
          <p className="max-w-2xl text-lg text-[#4A5A7A]">
            What we are researching and building: the public data behind medical-claim denials, how our
            agent-driven EHR works, and how clinic billing actually plays out.
          </p>

          {featured && <FeaturedCard post={featured} />}

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
