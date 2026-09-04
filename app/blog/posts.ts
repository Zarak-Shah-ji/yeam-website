/**
 * Blog post registry: the single source of truth for post metadata.
 *
 * Post *bodies* live in their own route folders (app/blog/<slug>/page.tsx); this
 * file holds only the metadata that the index grid, the article headers, and any
 * cross-linking read from. Keep it sorted newest-first (the index relies on order).
 */

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  /** Short category label shown as a pill. */
  tag: string;
  author: string;
  /** ISO date (YYYY-MM-DD); used for sorting and display. */
  date: string;
  /** Human reading estimate, e.g. "9 min read". */
  readingTime: string;
  /** Only published posts render on the index and in metadata. */
  published: boolean;
  /** At most one featured post. It is lifted out of the date-sorted grid into
   *  the wide animated hero (FeaturedPost) at the top of the index. */
  featured?: boolean;
};

export const POSTS: Post[] = [
  {
    slug: "payer-denial-playbook",
    title: "The Payer Denial Playbook",
    excerpt:
      "Who denies the most, for what, and how often it gets overturned. A tour of the public claims data (CMS, KFF, AMA, CA DMHC) behind medical-claim denials and appeals.",
    tag: "Market Research",
    author: "JZ Malik",
    date: "2026-08-25",
    readingTime: "9 min read",
    published: true,
    featured: true,
  },
  {
    slug: "medicaid-open-data",
    title: "What the Texas Medicaid open-data release actually contains",
    excerpt:
      "The DOGE/HHS T-MSIS release put years of provider-level Medicaid claims data in the open. Here is what is in it, and what it can (and cannot) tell you about clinic billing.",
    tag: "Data",
    author: "Zarak Shah",
    date: "2026-08-27",
    readingTime: "5 min read",
    published: true,
  },
  {
    slug: "inside-yeams-agent-ehr",
    title: "Inside the agent-driven platform behind Yeam",
    excerpt:
      "How the conversational, agent-first platform behind Yeam is put together: an intent orchestrator, five specialized agents, live-database tool calls, and streaming responses.",
    tag: "Engineering",
    author: "Zarak Shah",
    date: "2026-08-26",
    readingTime: "6 min read",
    published: true,
  },
  {
    slug: "denial-to-appeal",
    title: "How a claim denial becomes an appeal",
    excerpt:
      "A plain walkthrough of the path from a denial code to a corrected claim or appeal letter, and why so few of those letters ever get written.",
    tag: "Explainer",
    author: "Zarak Shah",
    date: "2026-08-28",
    readingTime: "4 min read",
    published: true,
  },
];

/** Published posts, newest first. */
export function publishedPosts(): Post[] {
  return POSTS.filter((p) => p.published).sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post {
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) throw new Error(`Unknown blog post: ${slug}`);
  return post;
}

/** Formats an ISO date as e.g. "Aug 25, 2026". */
export function formatPostDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
