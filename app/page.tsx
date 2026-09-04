import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import DashboardShowcase from "@/components/DashboardShowcase";
import ArchitectureTeaser from "@/components/ArchitectureTeaser";
import Integrations from "@/components/Integrations";
import Audiences from "@/components/Audiences";
import WorklistTeaser from "@/components/WorklistTeaser";
import PricingTeaser from "@/components/PricingTeaser";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        {/* What -> see it -> how -> who -> try -> price -> talk. The free worklist
            tool itself now lives on /worklist; WorklistTeaser is the invitation. */}
        <Hero />
        <Features />
        <DashboardShowcase />
        <ArchitectureTeaser />
        <Integrations />
        <Audiences />
        <WorklistTeaser />
        <PricingTeaser />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
