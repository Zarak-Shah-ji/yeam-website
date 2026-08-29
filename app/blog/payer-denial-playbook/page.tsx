import type { Metadata } from "next";
import ArticleShell from "@/components/blog/ArticleShell";
import { getPost } from "../posts";
import { Lead, P, H2, H3, Quote, Callout, Figure } from "@/components/blog/prose";
import {
  StatCard,
  StatGrid,
  CategoryBars,
  Table,
  TH,
  TD,
  Bar,
  SourceList,
} from "@/components/blog/dataviz";

const post = getPost("payer-denial-playbook");

export const metadata: Metadata = {
  title: post.title,
  description:
    "Who denies the most, for what, and how often it gets overturned. A tour of the public claims data behind medical-claim denials and appeals.",
};

export default function Page() {
  return (
    <ArticleShell post={post}>
      <Lead>
        Denial rates are high, appeals are almost nonexistent, and when a claim is contested a
        meaningful share of the money comes back. This is a tour of the public datasets that
        show all three at once.
      </Lead>
      <P>
        Scope: ACA Marketplace (QHP) plus cross-market prior authorization. Primary sources: the
        CMS Transparency in Coverage Public Use File (PUF), KFF, the AMA, and California&apos;s
        Department of Managed Health Care. Every number below is drawn from public reporting, not
        internal data.
      </P>

      {/* 01 */}
      <H2 eyebrow="01" id="headline">Headline numbers</H2>
      <P>
        The most-cited number set in this space comes from KFF&apos;s analysis of CMS&apos;s own
        Transparency in Coverage PUF, the mandatory issuer-level report every HealthCare.gov QHP
        issuer must file.
      </P>
      <StatGrid>
        <StatCard value="19%" label="of in-network claims denied on ACA Marketplace plans, 2024 (85M of 451M claims)" />
        <StatCard value="37%" label="out-of-network denial rate, 2024, roughly 2x the in-network rate" />
        <StatCard value="<1%" label="of denied claims were ever appealed by the member (263K of 85M)" />
        <StatCard value="34%" label="overturn rate when a member did appeal internally in 2024" />
      </StatGrid>
      <Callout title="What this means">
        Denials are common, appeals are rare, and roughly a third of contested denials get
        reversed. The gap between denials that are winnable on appeal and denials that are
        actually contested is enormous, and it is an operational gap, not a clinical one.
      </Callout>

      {/* 02 */}
      <H2 eyebrow="02" id="payers">Payers ranked by denial rate</H2>
      <P>
        KFF&apos;s issuer-level breakdown of the CMS PUF, restricted to parent companies with 5M+
        submitted claims on HealthCare.gov. 2024 is the most recent complete plan year; 2023 is
        shown alongside because it names a wider set of issuers and shows more spread.
      </P>
      <Figure caption="2024 plan year, in-network claims, ranked by denial rate.">
        <Table>
          <thead>
            <tr>
              <TH>Rank</TH>
              <TH>Payer (parent company)</TH>
              <TH>Denial rate</TH>
              <TH>Relative</TH>
            </tr>
          </thead>
          <tbody>
            {[
              ["1", "Oscar Health", 25],
              ["2", "Molina Healthcare", 22],
              ["2", "GuideWell Mutual Holding", 22],
              ["4", "Harris Health", 21],
              ["4", "Cigna", 21],
              ["4", "BCBS Tennessee", 21],
              ["7", "BCBS North Carolina", 19],
              ["7", "UnitedHealth Group", 19],
              ["7", "BCBS Alabama", 19],
              ["7", "IHC Group", 19],
              ["-", "Market average", 19],
              ["Low", "Elevance Health", 8],
            ].map(([rank, payer, rate], i) => (
              <tr key={i}>
                <TD>{rank}</TD>
                <TD strong>{payer}</TD>
                <TD>{rate}%</TD>
                <TD>
                  <Bar value={rate as number} max={25} />
                </TD>
              </tr>
            ))}
          </tbody>
        </Table>
      </Figure>
      <Figure caption="2023 plan year, a wider issuer set with more year-over-year spread.">
        <Table>
          <thead>
            <tr>
              <TH>Payer (parent company)</TH>
              <TH>Denial rate</TH>
              <TH>Footprint reported by KFF</TH>
            </tr>
          </thead>
          <tbody>
            {[
              ["Blue Cross Blue Shield of Alabama", "35%", "12 plans"],
              ["UnitedHealth Group", "33%", "274 plans, 20 states"],
              ["Health Care Service Corp. (BCBS IL/TX/OK/NM/MT)", "29%", "915 plans, 4 states"],
              ["Molina Healthcare", "26%", "72 plans, 9 states"],
              ["Elevance Health", "23%", "154 plans, 7 states"],
            ].map(([payer, rate, footprint], i) => (
              <tr key={i}>
                <TD strong>{payer}</TD>
                <TD>{rate}</TD>
                <TD>{footprint}</TD>
              </tr>
            ))}
          </tbody>
        </Table>
      </Figure>
      <P>
        The full observed range across individual issuer-and-state combinations in 2023 ran from
        about 1% to 54%. Texas alone spanned 12% to 36% across its own issuers in the 2024 data.
        Payer averages hide enormous state-level and plan-level variance.
      </P>
      <Quote cite="KFF, Claims Denials and Appeals in ACA Marketplace Plans, 2024">
        Consumers rarely have enough information to know, in advance, whether their insurer is
        likely to deny a claim, and even less information about why.
      </Quote>

      {/* 03 */}
      <H2 eyebrow="03" id="prior-auth">Prior authorization, by market (2025 data)</H2>
      <P>
        KFF&apos;s newest release (published Aug 2026) is the first public, insurer-named
        comparison of prior-auth denial rates across Medicare Advantage, Medicaid managed care,
        and ACA Marketplace, mandated under CMS-0057-F. It covers roughly 71M enrollees across 14
        insurers with 2.5%+ market share per segment.
      </P>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard value="12%" label="average prior-auth denial rate, Medicare Advantage" />
        <StatCard value="14%" label="average prior-auth denial rate, Medicaid MCO" />
        <StatCard value="18%" label="average prior-auth denial rate, ACA Marketplace (highest of the three)" />
      </div>
      <Figure caption="Highest and lowest prior-auth deniers by market, 2025.">
        <Table>
          <thead>
            <tr>
              <TH>Market</TH>
              <TH>Highest denier</TH>
              <TH>Rate</TH>
              <TH>Lowest denier</TH>
              <TH>Rate</TH>
            </tr>
          </thead>
          <tbody>
            {[
              ["Medicare Advantage", "UnitedHealth Group", "17%", "Elevance Health", "5%"],
              ["Medicaid MCO", "Independence Health Group", "23%", "L.A. Care Health Plan", "2%"],
              ["ACA Marketplace", "Centene", "25%", "GuideWell (Florida Blue)", "3%"],
            ].map(([market, hi, hr, lo, lr], i) => (
              <tr key={i}>
                <TD strong>{market}</TD>
                <TD>{hi}</TD>
                <TD>{hr}</TD>
                <TD>{lo}</TD>
                <TD>{lr}</TD>
              </tr>
            ))}
          </tbody>
        </Table>
      </Figure>
      <P>
        A few more points from the same release: UnitedHealth Group&apos;s Medicaid MCO prior-auth
        denial rate was 11%, and on ACA Marketplace it denied 21% of standard prior-auth requests.
        Centene&apos;s Medicare Advantage expedited-request denial rate was 13%, against
        Elevance&apos;s 3%.
      </P>

      {/* 04 */}
      <H2 eyebrow="04" id="categories">What claims actually get denied for</H2>
      <P>
        The CMS PUF lets issuers report denial reasons in five CMS-defined buckets plus a catch-all
        &quot;other.&quot; This is the weakest part of the public dataset (see the data limitations
        below), but the pattern has held steady across both years KFF has analyzed it.
      </P>
      <H3>2024 in-network denials, by reason</H3>
      <CategoryBars
        items={[
          { label: '"Other" / unspecified', value: 36 },
          { label: "Administrative reasons", value: 25 },
          { label: "Excluded service", value: 13 },
          { label: "Lack of prior authorization / referral", value: 9 },
          { label: "Medical necessity", value: 5 },
        ]}
      />
      <H3>2023 in-network denials, by reason</H3>
      <CategoryBars
        items={[
          { label: '"Other" / unspecified', value: 34 },
          { label: "Administrative reasons", value: 18 },
          { label: "Excluded service", value: 16 },
          { label: "Exceeded benefit limit", value: 12 },
          { label: "Lack of prior authorization / referral", value: 9 },
          { label: "Medical necessity", value: 6 },
        ]}
      />
      <Callout title="What this means">
        &quot;Administrative reasons&quot; plus &quot;Other&quot; is 61% of all denials nationally:
        coding mismatches, missing modifiers, eligibility and coordination-of-benefits errors,
        timely-filing misses, and incomplete documentation. Medical necessity, the category people
        assume dominates, is only 5 to 6%. The bulk of denials are high-volume, fixable-at-submission
        errors, not clinical judgment calls.
      </Callout>

      {/* 05 */}
      <H2 eyebrow="05" id="appeals">Appeals and overturn rates</H2>
      <P>
        Two different appeal systems produce two different numbers: standard claim denials appealed
        after the fact (CMS PUF), and prior-authorization denials appealed before service
        (CMS-0057-F reporting, 2025). Both point the same direction: appeals win more often than
        providers assume, but almost nobody files them.
      </P>
      <Figure caption="Post-claim appeals, ACA Marketplace, CMS PUF.">
        <Table>
          <thead>
            <tr>
              <TH>Metric</TH>
              <TH>2023</TH>
              <TH>2024</TH>
            </tr>
          </thead>
          <tbody>
            {[
              ["Denied claims appealed internally", "~1%", "<1% (263K of 85M)"],
              ["Internal appeal, denial upheld", "56%", "66%"],
              ["Internal appeal, overturned", "44%", "34%"],
              ["External review filings (post-internal)", "rare", "5,881+ (4% of upheld internal appeals)"],
            ].map(([metric, a, b], i) => (
              <tr key={i}>
                <TD strong>{metric}</TD>
                <TD>{a}</TD>
                <TD>{b}</TD>
              </tr>
            ))}
          </tbody>
        </Table>
      </Figure>
      <Figure caption="Prior-auth appeal success rate by market, 2025 (CMS-0057-F).">
        <Table>
          <thead>
            <tr>
              <TH>Market</TH>
              <TH>Avg. overturned on appeal</TH>
              <TH>Notes</TH>
            </tr>
          </thead>
          <tbody>
            {[
              ["Medicare Advantage", "~67%", "Range 40-93% by insurer; Centene 93%, Kaiser Permanente 40%"],
              ["Medicaid MCO", "~50%", "UnitedHealth Group 81%, Molina 48%, CVS 22%"],
              ["ACA Marketplace", "43%", "Range 16-54%; Centene 54% (only plan >50%), HCSC 16%"],
            ].map(([market, rate, notes], i) => (
              <tr key={i}>
                <TD strong>{market}</TD>
                <TD>{rate}</TD>
                <TD>{notes}</TD>
              </tr>
            ))}
          </tbody>
        </Table>
      </Figure>
      <Callout title="What this means">
        On Medicare Advantage, roughly two of every three appealed prior-auth denials get
        overturned, meaning the majority of MA denials that get contested were arguably wrong the
        first time. Yet post-claim appeal rates sit under 1%. The revenue is sitting on the table
        because appeals are labor-intensive to draft, not because the underlying denials are
        unbeatable.
      </Callout>

      {/* 06 */}
      <H2 eyebrow="06" id="california">State-level depth: California&apos;s IMR data</H2>
      <P>
        No national source publishes category-by-payer overturn rates. California&apos;s Department
        of Managed Health Care comes closest with its Independent Medical Review (IMR) program:
        every denial a member escalates to external review since 2001 is logged by health plan,
        treatment category, and outcome, in a public dataset that is updated regularly.
      </P>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard value="10.2%" label="of CA external-review denials overturned in 2025 (down from 12.7% in 2024)" />
        <StatCard value="201K" label="IMR applications processed in 2025, up 0.7% year over year" />
        <StatCard value="30.6%" label="of all IMR treatment requests were pharmacy-related" />
      </div>
      <P>
        Behavioral and mental-health services, evaluations, and program services had the highest
        overturn rates of any category in the 2025 report: the categories most likely to have been
        wrongly denied in the first place. The underlying trend dataset is payer-level and
        category-level and downloadable, which makes it the best candidate for a follow-up
        deep-dive on plan-by-plan overturn benchmarks in California.
      </P>

      {/* 07 */}
      <H2 eyebrow="07" id="burden">The administrative burden this creates</H2>
      <P>
        The AMA&apos;s 2024 physician survey quantifies the staff-time cost that denials and prior
        auth impose: the operational pain behind every one of the numbers above.
      </P>
      <StatGrid>
        <StatCard value="43" label="prior authorizations completed per physician, per week (average)" />
        <StatCard value="12 hrs" label="physician plus staff time spent on prior auth per week" />
        <StatCard value="35%" label="of physicians employ staff solely for prior auth" />
        <StatCard value="27%" label="of physicians say prior-auth requests are 'often or always' denied" />
      </StatGrid>
      <P>
        94% of physicians say prior auth delays access to necessary care and 78% say patients
        abandon treatment because of it. 93% report a negative impact on clinical outcomes and 24%
        report that prior auth led to a serious adverse event. 95% say prior auth increases
        physician burnout, which makes it a retention problem, not only a revenue one.
      </P>

      {/* 08 */}
      <H2 eyebrow="08" id="limits">Data limitations, read before quoting</H2>
      <H3>CMS PUF / KFF caveats</H3>
      <P>
        The Transparency in Coverage PUF only covers HealthCare.gov (the federally facilitated
        marketplace). It excludes state-based marketplaces, Medicare, Medicaid, and
        employer-sponsored coverage. Denial reason codes cannot be linked to the specific service
        denied; a claim initially denied and later paid on appeal is still counted as denied;
        multiple reason codes per claim are counted separately, which can distort the category
        percentages; and issuer self-reporting quality varies, with CMS itself flagging data
        suppression where volumes are too low to report reliably.
      </P>
      <H3>2025 prior-auth dataset caveats</H3>
      <P>
        The CMS-0057-F dataset reports percentages only, not underlying request volumes, for most
        insurers. So a &quot;low&quot; denial rate at a huge insurer can still represent more
        denied patients than a &quot;high&quot; rate at a small one. Reporting formats were
        inconsistent across insurers in this first reporting cycle.
      </P>

      {/* Sources */}
      <H2 id="sources">Sources</H2>
      <SourceList
        sources={[
          { label: "KFF, Claims Denials and Appeals in ACA Marketplace Plans in 2024" },
          { label: "KFF, HealthCare.gov Insurers Denied Nearly 1 in 5 In-Network Claims in 2023" },
          { label: "KFF, Prior Authorization Metrics Provide New Insights Into Insurer Practices (2025 data, published Aug 2026)" },
          { label: "Healthcare Dive, Prior authorization denials vary widely among insurers" },
          { label: "Becker's Payer Issues, 10 ACA insurers with the highest claim denial rates" },
          { label: "CMS, Health Insurance Exchange Public Use Files (incl. Transparency in Coverage)" },
          { label: "CA DMHC / CHHS Open Data, Independent Medical Review (IMR) Determinations" },
          { label: "AMA, 2024 Prior Authorization Physician Survey" },
        ]}
      />
      <P>
        Figures compiled Aug 2026 from public datasets. CMS and KFF refresh these annually, so
        verify current-year numbers before citing them.
      </P>
    </ArticleShell>
  );
}
