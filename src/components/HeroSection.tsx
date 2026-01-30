import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-luxury.jpg";
import { useSearchParams } from "react-router-dom";

export function HeroSection() {
  const [, setSearchParams] = useSearchParams();

  const handleExploreCollection = () => {
    // Navigate to collections page
    setSearchParams({ view: "collections" });
  };

  const handleViewNewArrivals = () => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("category", "new-arrivals"); // ← most consistent with your header
      // Alternative: newParams.set("filter", "new"); // if you prefer filter param
      newParams.delete("search"); // optional
      return newParams;
    });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Luxury accessories collection featuring premium watches, handbags, and wallets"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-dark/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="animate-fade-up">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-6 w-6 text-primary mr-2" />
            <span className="text-primary font-medium tracking-wider uppercase text-sm">
              Curated Luxury
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif font-bold text-background mb-6 leading-tight">
            Discover
            <span className="block bg-gradient-luxury bg-clip-text text-transparent">
              Timeless Elegance
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-background/90 mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience the world's finest collection of luxury watches, designer handbags,
            and premium wallets from prestigious brands.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="luxury"
              size="xl"
              className="animate-luxury-glow"
              onClick={handleExploreCollection}
            >
              Explore Collection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <Button
              variant="premium"
              size="xl"
              onClick={handleViewNewArrivals}
            >
              View New Arrivals
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-5"></div>
    </section>
  );
}