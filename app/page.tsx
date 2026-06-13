import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
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
        <Problem />
        <AnimatedWorkflow />
        <BenefitsPin />
        <AISection />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
