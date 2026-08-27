import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import DenialTriage from "@/components/DenialTriage";
import AppealDrafter from "@/components/AppealDrafter";
import Integrations from "@/components/Integrations";
import WhyDenialsDie from "@/components/WhyDenialsDie";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        {/* One story, in order: run your own export, see it sorted, see the
            response it writes. The proof sits directly under the claim. */}
        <DenialTriage />
        <AppealDrafter />
        <Integrations />
        <WhyDenialsDie />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
