import ContactHero from "../components/ContactHero";
import ContactForm from "../components/ContactForm";
import ContactMap from "../components/ContactMap";
import ContactHours from "../components/ContactHours";
import ContactSocials from "../components/ContactSocials";
import Footer from "../components/Footer";

export const metadata = {
  title: "Contact — Burgshake",
  description:
    "Visit us in Bandra West, call us, or drop a message. We're here 11 AM – 11 PM, every day.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#FDFCFB]">
      <ContactHero />
      <ContactForm />
      <ContactMap />
      <ContactHours />
      <ContactSocials />
      
    </main>
  );
}