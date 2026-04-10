import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Features from "@/components/Features";
import AnimatedWorkflow from "@/components/AnimatedWorkflow";
import AISection from "@/components/AISection";
import Audiences from "@/components/Audiences";
import HowItWorks from "@/components/HowItWorks";
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
        <Features />
        <AISection />
        <Audiences />
        <HowItWorks />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
