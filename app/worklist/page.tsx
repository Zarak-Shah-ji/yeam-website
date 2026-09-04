import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DenialTriage from "@/components/DenialTriage";

/**
 * The free denial worklist, on its own page.
 *
 * It used to sit high on the home page, directly under the hero, where it made
 * the whole site feel like one big tool. Moved here it stays one click away (the
 * hero and nav both point at it) without crowding out the story the home page
 * now tells. The tool itself is unchanged; it still runs entirely in the
 * visitor's browser and owns its own `#triage` anchor.
 */

export const metadata: Metadata = {
  title: "Free denial worklist",
  description:
    "Upload a denied-claims export and Yeam sorts it into what is still worth working, tracks the filing deadline on each one, and drafts the response. Free, and it runs entirely in your browser.",
};

export default function WorklistPage() {
  return (
    <>
      <Nav />
      <main className="bg-[#FFFFFF] px-6 pt-28 pb-6">
        <div className="mx-auto max-w-[1600px]">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#1A4FBF]">
            Free worklist
          </p>
          <h1 className="mb-4 text-3xl font-light tracking-tight text-[#1C1C1C] md:text-5xl">
            Run your own denial export.
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-[#4A5A7A]">
            Drop in a denied-claims file and see it sorted by what is recoverable
            and how many days are left to file. Nothing is uploaded: the file is
            read in your browser, no account required.
          </p>
        </div>
      </main>
      <DenialTriage />
      <Footer />
    </>
  );
}
