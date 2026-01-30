import { ProductCard } from "./ProductCard";
import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api";
import luxuryWatch from "@/assets/luxury-watch.jpg";
import luxuryHandbag from "@/assets/luxury-handbag.jpg";
import luxuryWallet from "@/assets/luxury-wallet.jpg";

const staticFeaturedProducts = [
  {
    image: luxuryWatch,
    title: "Royal Oak Chronograph",
    brand: "Audemars Piguet",
    price: 45000,
    originalPrice: 48000,
    rating: 4.9,
    reviews: 127,
    isNew: true,
    isFeatured: true,
  },
  {
    image: luxuryHandbag,
    title: "Birkin 35 Togo Leather",
    brand: "Hermès",
    price: 28500,
    rating: 4.8,
    reviews: 89,
    isFeatured: true,
  },
  {
    image: luxuryWallet,
    title: "Saffiano Leather Wallet",
    brand: "Prada",
    price: 650,
    originalPrice: 750,
    rating: 4.7,
    reviews: 234,
    isNew: true,
  },
];

export function ProductShowcase() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const products = await fetchProducts();
        // Get first 3 featured or isFeatured products
        const featured = products
          .filter((p: any) => p.isFeatured)
          .slice(0, 3);
        
        if (featured.length > 0) {
          setFeaturedProducts(featured);
        } else {
          // Fallback to first 3 products if no featured ones
          setFeaturedProducts(products.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
        // Fallback to static products if fetch fails
        setFeaturedProducts(staticFeaturedProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section className="py-20 px-4 bg-gradient-subtle">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Featured
            <span className="bg-gradient-luxury bg-clip-text text-transparent"> Products</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Handpicked luxury accessories from the world's most prestigious brands, 
            each piece representing the pinnacle of craftsmanship and design.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading featured products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <div
                key={product._id || `${product.brand}-${product.title}`}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}