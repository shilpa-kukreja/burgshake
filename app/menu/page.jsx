import MenuHero from "../components/MenuHero";
import MenuGrid from "../components/MenuGrid";
import MenuFeatured from "../components/MenuFeatured";

export const metadata = {
  title: "Menu — Burgshake",
  description:
    "Burgers, shakes, sides, and cold drinks. Every item made fresh to order.",
};

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-[#FDFCFB]">
      <MenuHero />
      <MenuGrid />
      <MenuFeatured />
    </main>
  );
}