import type { Metadata } from "next";
import ArticleShell from "@/components/blog/ArticleShell";
import { getPost } from "../posts";
import { Lead, P, H2, UL, LI, Figure } from "@/components/blog/prose";
import { Table, TH, TD } from "@/components/blog/dataviz";

const post = getPost("inside-yeams-agent-ehr");

export const metadata: Metadata = {
  title: post.title,
  description:
    "How the conversational, agent-first platform behind Yeam is put together: an intent orchestrator, five specialized agents, live-database tool calls, and streaming responses.",
};

export default function Page() {
  return (
    <ArticleShell post={post}>
      <Lead>
        Yeam&apos;s denial-recovery product works alongside the EHR a practice already runs. Behind
        it sits a full agent-driven system we built ourselves: instead of burying every task behind a
        menu tree, it lets you ask. Here is how that system is put together, and why we shaped it
        around a small set of specialized agents instead of one large model doing everything.
      </Lead>

      <H2 id="problem">The click-heavy problem</H2>
      <P>
        A traditional EHR buries every task behind a menu tree: find the patient, open the
        encounter, switch to the coding tab, jump to claims, pull up billing. Each screen is a
        separate mental context. The work a clinic actually wants (check this patient in, draft this
        SOAP note, tell me why this claim was denied) gets spread across a dozen views. The premise
        of an agent-first EHR is simple: you describe the outcome, and the system routes the request
        to whatever part of the app can produce it.
      </P>

      <H2 id="shape">The shape of the system</H2>
      <P>
        Everything flows through one entry point. A Command Bar (the familiar Cmd-K palette) takes a
        natural-language request and hands it to an orchestrator. The orchestrator classifies intent
        and routes the task to one of five specialized agents. Each agent knows how to do a narrow
        set of jobs well, queries the live database for real data through function calling, and
        streams its answer back into a persistent chat panel.
      </P>
      <Figure caption="Five specialized agents, routed by an intent orchestrator.">
        <Table>
          <thead>
            <tr>
              <TH>Agent</TH>
              <TH>Handles</TH>
            </tr>
          </thead>
          <tbody>
            {[
              ["Front Desk", "Check-ins, scheduling, cancellations, patient lookup, insurance verification"],
              ["Clinical Doc", "SOAP notes, encounter documentation, ICD-10 and CPT coding"],
              ["Claim Scrubber", "Claim validation, code review, status checks"],
              ["Billing", "Denied claims, appeal letters, revenue cycle"],
              ["Analytics", "Live metrics (encounters, denial rate, revenue), trend analysis"],
            ].map(([agent, handles], i) => (
              <tr key={i}>
                <TD strong>{agent}</TD>
                <TD>{handles}</TD>
              </tr>
            ))}
          </tbody>
        </Table>
      </Figure>

      <H2 id="routing">Intent, then tools, then a stream</H2>
      <P>
        When a request comes in, the orchestrator first decides what kind of task it is, then
        dispatches to the matching agent. That agent does not guess at data. It calls typed tools
        that run real database lookups (Gemini function calling on our side), gets structured results
        back, and only then composes a response. The reply streams token by token over
        server-sent events, so the chat panel fills in as the answer is produced rather than waiting
        for a complete block of text.
      </P>
      <P>
        Splitting the work across narrow agents keeps each one&apos;s job small enough to be
        reliable. The billing agent only reasons about denials and appeals; the analytics agent only
        reasons about metrics it just pulled from the database. Narrow scope means fewer ways to be
        wrong.
      </P>

      <H2 id="degrade">Graceful degradation</H2>
      <P>
        A clinical tool cannot fall over when a model API is unavailable. If the generative model key
        is not set, the agents still run: they query the database and return a structured, factual
        stub instead of a generated narrative. The data path and the language path are separate, so
        losing the second one never takes down the first.
      </P>

      <H2 id="stack">The stack, briefly</H2>
      <UL>
        <LI>Next.js 16 (App Router) with React 19 and TypeScript.</LI>
        <LI>PostgreSQL with Prisma as the ORM.</LI>
        <LI>tRPC with React Query for typed, end-to-end data access.</LI>
        <LI>Google Gemini for intent classification, tool calling, and generation.</LI>
        <LI>Tailwind CSS v4 for the interface.</LI>
      </UL>
      <P>
        None of this is exotic on its own. What makes it feel different is the ordering: the
        conversation is the primary surface, the click-through screens are the fallback, and every
        answer is grounded in a live database read rather than the model&apos;s memory.
      </P>
    </ArticleShell>
  );
}
