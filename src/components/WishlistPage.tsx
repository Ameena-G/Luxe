import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function WishlistPage() {
  const [, setSearchParams] = useSearchParams();
  const { wishlist, removeFromWishlist, addToCart } = useCart();

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price || 0,
      quantity: 1,
      image: item.image,
    });
    alert("Added to cart!");
  };

  if (wishlist.length === 0) {
    return (
      <section className="py-20 px-4 bg-background min-h-screen">
        <div className="container mx-auto text-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-serif font-bold text-foreground">
              My Wishlist
            </h1>
            <p className="text-xl text-muted-foreground">
              Your wishlist is empty
            </p>
            <Button variant="luxury" onClick={() => setSearchParams({})}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Start Shopping
            </Button>
          </div>
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
          Back to Shopping
        </Button>

        <h1 className="text-4xl font-serif font-bold text-foreground mb-8">
          My Wishlist ({wishlist.length} items)
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map((item: any) => (
            <div
              key={item.id}
              className="p-6 border border-border rounded-lg bg-card hover:shadow-elegant transition-all duration-300 cursor-pointer"
              onClick={() => setSearchParams({ id: item.id })}
            >
              <div className="aspect-square overflow-hidden rounded-lg bg-muted mb-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <h3 className="font-medium text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
                {item.title}
              </h3>

              <div className="flex gap-2 mt-4">
                <Button
                  variant="luxury"
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(item);
                  }}
                >
                  <ShoppingBag className="h-4 w-4 mr-1" />
                  Add to Cart
                </Button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWishlist(item.id);
                  }}
                  className="p-2 text-red-500 hover:text-red-600 transition-colors border border-border rounded-lg hover:bg-muted"
                  aria-label={`Remove ${item.title} from wishlist`}
                  title="Remove from wishlist"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
