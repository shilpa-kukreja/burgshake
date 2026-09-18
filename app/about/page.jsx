import AboutHero from "../components/AboutHero";
import AboutStory from "../components/AboutStory";
import AboutPhilosophy from "../components/AboutPhilosophy";
import AboutExperience from "../components/AboutExperience";
import AboutTeam from "../components/AboutTeam";
import AboutValues from "../components/AboutValues";
import AboutCTA from "../components/AboutCTA";


export const metadata = {
  title: "About Us — Burgshake",
  description:
    "The story, philosophy, and people behind Burgshake — a takeaway burger café built on craft, freshness, and warmth.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FDFCFB]">
      <AboutHero />
      <AboutStory />
      <AboutPhilosophy />
      <AboutExperience />
      <AboutTeam />
      <AboutValues />
      <AboutCTA />
    </main>
  );
}