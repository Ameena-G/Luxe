import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import luxuryWatch from "@/assets/luxury-watch.jpg";
import luxuryHandbag from "@/assets/luxury-handbag.jpg";
import luxuryWallet from "@/assets/luxury-wallet.jpg";

const categories = [
  {
    title: "Luxury Watches",
    description: "Timeless precision from the world's finest watchmakers",
    image: luxuryWatch,
    items: "2,847 items",
    category: "watches",
  },
  {
    title: "Designer Handbags",
    description: "Exquisite craftsmanship meets contemporary style",
    image: luxuryHandbag,
    items: "1,923 items",
    category: "handbags",
  },
  {
    title: "Premium Wallets",
    description: "Sophisticated leather goods for the discerning individual",
    image: luxuryWallet,
    items: "856 items",
    category: "wallets",
  },
];

export function FeaturedCategories() {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Curated
            <span className="bg-gradient-luxury bg-clip-text text-transparent"> Collections</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our carefully selected range of luxury accessories, 
            each piece chosen for its exceptional quality and timeless appeal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={category.title}
              className="group cursor-pointer animate-slide-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-card hover:shadow-elegant transition-all duration-500 transform hover:-translate-y-4">
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/20 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-background mb-2">
                        {category.title}
                      </h3>
                      <p className="text-background/90 text-sm leading-relaxed">
                        {category.description}
                      </p>
                      <p className="text-primary font-medium text-sm mt-2">
                        {category.items}
                      </p>
                    </div>
                    
                    <Button 
                      variant="gold" 
                      size="sm"
                      onClick={() => navigate(`/?category=${category.category}`)}
                      className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      Explore Collection
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}