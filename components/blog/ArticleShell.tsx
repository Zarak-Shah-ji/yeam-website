import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { formatPostDate, type Post } from "@/app/blog/posts";

/**
 * Chrome shared by every blog post: the site Nav/Footer, a centered article
 * column, the post header (tag, title, byline · date · reading time), and a
 * closing back-link + demo CTA. Post bodies supply only their own content as
 * `children`. Mirrors the composition of app/architecture/page.tsx and reuses
 * only dark-mode-safe color classes from globals.css.
 */
export default function ArticleShell({ post, children }: { post: Post; children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className="bg-[#FFFFFF] px-6 pt-28 pb-20">
        <article className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="text-sm font-medium text-[#1A4FBF] transition-colors hover:text-[#1540A0]"
          >
            ← All posts
          </Link>

          <header className="mt-6">
            <span className="inline-flex items-center rounded-full border border-[#A8BFEE] bg-[#EBF0FA] px-2.5 py-0.5 text-xs font-semibold text-[#1A4FBF]">
              {post.tag}
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#1C1C1C] md:text-4xl">
              {post.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#5A6A8A]">
              <span className="font-medium text-[#1C1C1C]">{post.author}</span>
              <span aria-hidden>·</span>
              <span>{formatPostDate(post.date)}</span>
              <span aria-hidden>·</span>
              <span>{post.readingTime}</span>
            </div>
          </header>

          <div className="mt-8 border-t border-[#E0E6F5] pt-8">{children}</div>

          {/* Closing CTA */}
          <div className="mt-14 rounded-2xl border border-[#E0E6F5] bg-[#F7F9FE] px-6 py-6">
            <p className="text-sm font-semibold text-[#1C1C1C]">
              Yeam deploys AI medical employees into clinics.
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[#4A5A7A]">
              Reception, documentation, coding, and billing, handled by agents so staff can focus on patients.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/#contact"
                className="rounded-lg bg-[#1A4FBF] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1540A0]"
              >
                Request a Demo
              </Link>
              <Link
                href="/blog"
                className="rounded-lg border border-[#E0E6F5] px-4 py-2 text-sm font-medium text-[#4A5A7A] transition-colors hover:bg-[#EBF0FA]"
              >
                ← All posts
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
