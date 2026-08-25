import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import AppealDemo from "@/components/AppealDemo";
import Integrations from "@/components/Integrations";
import AnimatedWorkflow from "@/components/AnimatedWorkflow";
import BenefitsPin from "@/components/BenefitsPin";
import AISection from "@/components/AISection";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <AppealDemo />
        <Integrations />
        <AnimatedWorkflow />
        <BenefitsPin />
        <AISection />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
