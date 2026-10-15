
import AboutSection from "../components/home/AboutSection";
import ContactCTA from "../components/home/ContactCTA";
import FeaturedProducts from "../components/home/FeaturedProducts";
import HeroCarousel from "../components/home/HeroCarousel";
import ProductCategories from "../components/home/ProductCategories";

export default function Home() {
  return (
    <>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Product Categories */}
      <ProductCategories />

      {/* About CHETSA - Next */}
      <AboutSection />
      {/* Featured Products - Later */}
      <FeaturedProducts />
      {/* Contact CTA - Later */}
      <ContactCTA />
    </>
  );
}
