import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import DenialTriage from "@/components/DenialTriage";
import Integrations from "@/components/Integrations";
import AnimatedWorkflow from "@/components/AnimatedWorkflow";
import Audiences from "@/components/Audiences";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        {/* The proof sits directly under the claim: run it on your own export. */}
        <DenialTriage />
        <Integrations />
        <AnimatedWorkflow />
        <Audiences />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
