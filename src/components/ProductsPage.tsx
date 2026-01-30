// src/components/ProductsPage.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "./ProductCard";
import { fetchProducts } from "@/lib/api";

export function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showingSimilar, setShowingSimilar] = useState(false);

  const category = searchParams.get("category");
  const search = searchParams.get("search");

  useEffect(() => {
    setLoading(true);
    setShowingSimilar(false);
    const fetchData = async () => {
      try {
        console.log('Fetching products with:', { category, search });
        const data = await fetchProducts(category || undefined, search || undefined);
        console.log('Received products:', data);
        
        // Check if we're showing similar products (for search queries)
        if (search && Array.isArray(data) && data.length > 0) {
          // If we have search and got results, check if they're exact matches
          const hasExactMatches = data.some((p: any) => 
            p.title?.toLowerCase().includes(search.toLowerCase()) ||
            p.brand?.toLowerCase().includes(search.toLowerCase())
          );
          setShowingSimilar(!hasExactMatches);
        }
        
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, search]);

  useEffect(() => {
    console.log('ProductsPage updated with:', { category, search, productsCount: products.length });
  }, [category, search, products]);

  return (
    <section className="py-12 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            {search
              ? `Search Results for "${search}"`
              : category === 'new-arrivals'
              ? 'New Arrivals'
              : category
              ? category.charAt(0).toUpperCase() + category.slice(1)
              : "All Products"}
          </h1>
          {category === 'new-arrivals' && (
            <p className="text-lg text-muted-foreground">Discover our latest luxury accessories</p>
          )}
          {search && showingSimilar && products.length > 0 && (
            <p className="text-lg text-muted-foreground mt-2">
              No exact matches found. Showing similar products instead.
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              {search
                ? `No products found for "${search}". Please try a different search term.`
                : "No products found. Please check back later."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product: any) => (
              <ProductCard
                key={product._id || product.id}
                {...product}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}