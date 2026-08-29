import type { Metadata } from "next";
import ArticleShell from "@/components/blog/ArticleShell";
import { getPost } from "../posts";
import { Lead, P, H2, UL, LI, Callout, Figure } from "@/components/blog/prose";
import { Table, TH, TD } from "@/components/blog/dataviz";

const post = getPost("medicaid-open-data");

export const metadata: Metadata = {
  title: post.title,
  description:
    "The DOGE/HHS T-MSIS release put years of provider-level Medicaid claims data in the open. What is in it, and what it can and cannot tell you about clinic billing.",
};

export default function Page() {
  return (
    <ArticleShell post={post}>
      <Lead>
        In February 2026, HHS released years of provider-level Medicaid claims data as open data.
        The Texas file alone runs to millions of rows. It is a genuinely useful public dataset, as
        long as you are clear about what it does and does not contain.
      </Lead>

      <H2 id="what">What the release is</H2>
      <P>
        The data comes from T-MSIS, the Transformed Medicaid Statistical Information System, which is
        the national system states report their Medicaid claims into. The open release aggregates it
        to the provider level and covers 2018 through 2024. We worked with the Texas extract, a
        single wide CSV of aggregated, provider-level claims.
      </P>

      <H2 id="row">What one row represents</H2>
      <P>
        Each row is a combination of a billing provider, a servicing provider, a procedure code, and
        a month, along with how many beneficiaries and claims it covered and how much was paid. It is
        an aggregate, not an individual claim. A handful of the columns:
      </P>
      <Figure caption="A selection of the 34 columns in the Texas T-MSIS extract.">
        <Table>
          <thead>
            <tr>
              <TH>Column</TH>
              <TH>What it holds</TH>
            </tr>
          </thead>
          <tbody>
            {[
              ["billing_npi", "Billing provider National Provider Identifier"],
              ["servicing_npi", "Servicing provider NPI"],
              ["proc_code", "HCPCS procedure code"],
              ["yrmonth", "Year-month of the date of service (e.g. 202301)"],
              ["num_benes", "Number of Medicaid beneficiaries"],
              ["num_claims", "Number of claims"],
              ["paid_amt", "Total paid amount"],
              ["billing_org_name", "Billing provider organization name"],
              ["billing_city / billing_zip", "Billing provider location"],
            ].map(([col, desc], i) => (
              <tr key={i}>
                <TD strong>{col}</TD>
                <TD>{desc}</TD>
              </tr>
            ))}
          </tbody>
        </Table>
      </Figure>

      <H2 id="can">What it can tell you</H2>
      <UL>
        <LI>How much a given procedure was billed and paid across the state, by month.</LI>
        <LI>Provider-level benchmarking: volume and paid amounts for a specific NPI against peers.</LI>
        <LI>Geographic patterns in spend and utilization, down to the city and ZIP.</LI>
        <LI>How many beneficiaries a service reached, which separates high-volume codes from rare ones.</LI>
      </UL>

      <H2 id="cannot">What it cannot tell you</H2>
      <P>
        This is the part that matters most, and it is easy to get wrong. The dataset records what was
        <em> paid</em>. It does not record adjudication outcomes: there are no denial flags, no denial
        reason codes, and no per-claim status. It is aggregated, so there is no patient-level detail
        and no way to reconstruct an individual claim.
      </P>
      <Callout title="A claim we deliberately do not make">
        Because there are no denial outcomes in this data, it cannot be used to measure a denial rate
        or to claim a reduction in one. Denial and appeal figures belong to different sources
        (the CMS Transparency in Coverage PUF and KFF&apos;s analysis of it), which we cover in a
        separate post. Mixing the two would be a mistake.
      </Callout>

      <H2 id="why">Why we loaded it</H2>
      <P>
        Inside the EHR, this data backs provider benchmarking and statewide analytics: what a
        procedure typically pays, how a provider&apos;s volume compares, where utilization
        concentrates. It is a strong reference layer for context. It is not, and should not be
        presented as, a source of denial or appeal outcomes.
      </P>
    </ArticleShell>
  );
}
