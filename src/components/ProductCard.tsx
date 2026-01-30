import { Heart, Star, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchParams } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

interface ProductCardProps {
  _id?: string;
  id?: string;
  image: string;
  title: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isFeatured?: boolean;
  description?: string;
}

export function ProductCard({
  _id,
  id,
  image,
  title,
  brand,
  price,
  originalPrice,
  rating,
  reviews,
  isNew,
  isFeatured,
  description,
}: ProductCardProps) {
  const [, setSearchParams] = useSearchParams();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const productId = _id || id;
  const [isLiked, setIsLiked] = useState(isInWishlist(productId || ""));

  const handleProductClick = () => {
    if (productId) {
      setSearchParams({ id: productId });
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (productId) {
      addToCart({
        id: productId,
        title,
        price,
        quantity: 1,
        image,
      });
      alert("Added to cart!");
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (productId) {
      if (isLiked) {
        removeFromWishlist(productId);
        setIsLiked(false);
      } else {
        addToWishlist({
          id: productId,
          title,
          image,
        });
        setIsLiked(true);
      }
    }
  };

  return (
    <Card 
      className="group cursor-pointer overflow-hidden border-0 shadow-card hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-1 w-full max-w-[280px] mx-auto"
      onClick={handleProductClick}
    >
      {/* Image Container - Smaller fixed height for compact look */}
      <div className="relative overflow-hidden h-48 bg-gray-50 flex items-center justify-center">
        <img
          src={image}
          alt={`${brand} ${title}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 flex items-center justify-center">
            <Button 
              variant="luxury" 
              size="sm" 
              className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
              onClick={handleQuickAdd}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Quick Add
            </Button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {isNew && (
            <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
              NEW
            </span>
          )}
          {isFeatured && (
            <span className="px-2 py-0.5 bg-accent text-accent-foreground text-xs font-medium rounded-full">
              FEATURED
            </span>
          )}
        </div>

        {/* Wishlist */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 bg-background/80 hover:bg-background transition-colors h-8 w-8 ${
            isLiked ? "text-red-500 hover:text-red-600" : "text-foreground hover:text-primary"
          }`}
          onClick={handleWishlistToggle}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
        </Button>
      </div>

      <CardContent className="p-3">
        <div className="space-y-1.5">
          <div className="space-y-0.5">
            <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
              {title}
            </h3>
            <p className="text-muted-foreground text-xs uppercase tracking-wide">
              {brand}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(rating)
                      ? "fill-primary text-primary"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({reviews})
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-foreground">
                ${price.toLocaleString()}
              </span>
              {originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  ${originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}