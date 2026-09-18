import Blogs from "./components/Blogs";
import FeaturedMenu from "./components/FeaturedMenu";
import FinalCTA from "./components/FinalCTA";
import Hero from "./components/Hero";
import IntroSection from "./components/IntroSection";
import Subscribe from "./components/Subscribe";
import Testimonials from "./components/Testimonials";
import WhyChooseUs from "./components/WhyChooseUs";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <IntroSection/>
      <FeaturedMenu/>
      <WhyChooseUs/>
      <Testimonials/>
      <Blogs/>
      <FinalCTA/>
      <Subscribe/>
      
    </main>
  );
}