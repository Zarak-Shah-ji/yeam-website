import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import DenialTriage from "@/components/DenialTriage";
import Integrations from "@/components/Integrations";
import Audiences from "@/components/Audiences";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        {/* One story, in one place: run your own export, see it sorted, draft
            a response for a row, then talk the draft into shape. The standalone
            sample drafter that used to sit here said the same thing twice. */}
        <DenialTriage />
        <Integrations />
        <Audiences />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
