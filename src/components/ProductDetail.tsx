import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Star, ArrowLeft } from "lucide-react";
import { fetchProduct } from "@/lib/api";
import { useCart } from "@/context/CartContext";

export function ProductDetail() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();

  const productId = searchParams.get("id");

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    fetchProduct(productId).then((data) => {
      setProduct(data);
      setLoading(false);
    });
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product._id || product.id,
        title: product.title,
        price: product.price,
        quantity,
        image: product.image,
      });
      alert("Added to cart!");
    }
  };

  const handleWishlist = () => {
    if (product) {
      if (isInWishlist(product._id || product.id)) {
        removeFromWishlist(product._id || product.id);
      } else {
        addToWishlist({
          id: product._id || product.id,
          title: product.title,
          image: product.image,
        });
      }
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Navigate to cart page
    setSearchParams({ view: "cart" });
  };

  if (loading) {
    return (
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">Product not found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 bg-background min-h-screen">
      <div className="container mx-auto">
        <Button
          variant="ghost"
          className="mb-8 text-muted-foreground hover:text-foreground"
          onClick={() => setSearchParams({})}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <div className="w-full aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <p className="text-primary font-medium uppercase tracking-wider text-sm mb-2">
                {product.brand}
              </p>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
                {product.title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">
                {product.rating} · {product.reviews} reviews
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-foreground">
                  ${product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {product.originalPrice && (
                <p className="text-sm text-primary">
                  Save ${(product.originalPrice - product.price).toLocaleString()}
                </p>
              )}
            </div>

            {/* Category & Status */}
            <div className="flex gap-3 pt-4">
              {product.isNew && (
                <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  NEW
                </span>
              )}
              {product.isFeatured && (
                <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                  FEATURED
                </span>
              )}
              <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full uppercase">
                {product.category}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-sm font-medium text-muted-foreground">Quantity:</span>
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  −
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-6">
              <Button 
                variant="luxury" 
                size="lg" 
                className="w-full"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-6"
                  onClick={handleWishlist}
                >
                  <Heart 
                    className={`h-5 w-5 ${isInWishlist(product._id || product.id) ? "fill-red-500 text-red-500" : ""}`}
                  />
                </Button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="border-t pt-6 mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">SKU:</span>
                <span className="font-medium">{product._id || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Brand:</span>
                <span className="font-medium">{product.brand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-medium capitalize">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Availability:</span>
                <span className="font-medium text-green-600">In Stock</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
