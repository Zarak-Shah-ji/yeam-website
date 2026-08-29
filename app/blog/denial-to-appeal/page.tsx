import type { Metadata } from "next";
import Link from "next/link";
import ArticleShell from "@/components/blog/ArticleShell";
import { getPost } from "../posts";
import { Lead, P, H2, Callout, Figure } from "@/components/blog/prose";
import { Table, TH, TD } from "@/components/blog/dataviz";

const post = getPost("denial-to-appeal");

export const metadata: Metadata = {
  title: post.title,
  description:
    "A plain walkthrough of the path from a denial code to a corrected claim or appeal letter, and why so few of those letters ever get written.",
};

export default function Page() {
  return (
    <ArticleShell post={post}>
      <Lead>
        A denial is not the end of a claim. It is a routing problem. The denial arrives with a code
        that says why, and that code points to one of a small number of remedies. Here is the whole
        path, in plain terms.
      </Lead>

      <H2 id="what">What a denial actually is</H2>
      <P>
        When a payer declines a claim, it does not send a letter written by a person. It sends a
        machine-readable remittance (an 835, the electronic version of the Explanation of Benefits)
        carrying one or more reason codes. These are the CARC codes, Claim Adjustment Reason Codes,
        a standardized vocabulary shared across payers. The code is the useful part: it tells you
        which of a few paths this claim belongs on.
      </P>

      <H2 id="paths">Reading the code, picking the remedy</H2>
      <P>
        Most denials sort into three buckets, and the reason code tells you which one. The point is
        that the remedy is largely determined by the code, not decided from scratch each time.
      </P>
      <Figure caption="Common code families and the remedy each one points to.">
        <Table>
          <thead>
            <tr>
              <TH>Remedy</TH>
              <TH>Typical codes</TH>
              <TH>What triggered it</TH>
            </tr>
          </thead>
          <tbody>
            {[
              [
                "Corrected claim",
                "CO-11, CO-16, CO-18",
                "A fixable submission error: diagnosis and procedure mismatch, missing information or modifier, or a duplicate.",
              ],
              [
                "Appeal letter",
                "CO-50, CO-97, CO-151, CO-197",
                "A decision worth contesting: medical necessity, bundling, service-count, or a missing prior authorization.",
              ],
              [
                "Reprocessing request",
                "CO-45, PR-204",
                "A pricing or coverage adjustment: charge exceeds the fee schedule, or the service falls outside plan coverage.",
              ],
            ].map(([remedy, codes, trigger], i) => (
              <tr key={i}>
                <TD strong>{remedy}</TD>
                <TD>{codes}</TD>
                <TD>{trigger}</TD>
              </tr>
            ))}
          </tbody>
        </Table>
      </Figure>
      <P>
        A corrected claim is exactly that: fix the error and resubmit. An appeal letter argues the
        decision was wrong and asks the payer to reconsider. A reprocessing request asks the payer to
        re-adjudicate under the right pricing or coverage. Same denial pile, three different actions.
      </P>

      <H2 id="payer">The payer profile decides the how</H2>
      <P>
        Knowing the remedy is only half of it. Each payer also has its own filing window, its own
        channel (portal, fax, mail), and its own required form. Miss the window and a winnable denial
        is simply dead, no matter how strong the argument. So every appeal is really two questions:
        what to say, and where and by when to send it.
      </P>
      <Callout title="Why so few appeals get written">
        Across ACA Marketplace plans, fewer than 1% of denied claims are ever appealed, even though a
        third or more of the ones that are get overturned. The denials are not unbeatable. Writing
        the appeal is just slow, manual work, and the deadline passes before anyone gets to it. The
        <Link href="/blog/payer-denial-playbook" className="font-medium text-[#1A4FBF] transition-colors hover:text-[#1540A0]">
          {" "}payer denial playbook{" "}
        </Link>
        has the full numbers.
      </Callout>

      <H2 id="see">See it run</H2>
      <P>
        The output routing described here (denial code in, corrected claim or appeal letter out) is
        the part that is live today. You can{" "}
        <Link href="/" className="font-medium text-[#1A4FBF] transition-colors hover:text-[#1540A0]">
          run it on a sample denial on the homepage
        </Link>
        , or see how the claim data gets there in{" "}
        <Link href="/architecture" className="font-medium text-[#1A4FBF] transition-colors hover:text-[#1540A0]">
          how Yeam connects
        </Link>
        .
      </P>
    </ArticleShell>
  );
}
