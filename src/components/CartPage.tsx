import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function CartPage() {
  const [, setSearchParams] = useSearchParams();
  const { cart, removeFromCart, updateCartQuantity, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <section className="py-20 px-4 bg-background min-h-screen">
        <div className="container mx-auto text-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-serif font-bold text-foreground">
              Your Cart
            </h1>
            <p className="text-xl text-muted-foreground">Your cart is empty</p>
            <Button
              variant="luxury"
              onClick={() => setSearchParams({})}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 bg-background min-h-screen">
      <div className="container mx-auto max-w-4xl">
        <Button
          variant="ghost"
          className="mb-8 text-muted-foreground hover:text-foreground"
          onClick={() => setSearchParams({})}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shopping
        </Button>

        <h1 className="text-4xl font-serif font-bold text-foreground mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-6 p-6 border border-border rounded-lg bg-card"
              >
                {/* Product Image */}
                <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-medium text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-lg font-bold text-primary">
                      ${item.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity Control */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">Qty:</span>
                    <div className="flex items-center border border-border rounded">
                      <button
                        onClick={() =>
                          updateCartQuantity(item.id, item.quantity - 1)
                        }
                        className="px-2 py-1 text-muted-foreground hover:text-foreground"
                        aria-label="Decrease quantity"
                        title="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="px-3 py-1 font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateCartQuantity(item.id, item.quantity + 1)
                        }
                        className="px-2 py-1 text-muted-foreground hover:text-foreground"
                        aria-label="Increase quantity"
                        title="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subtotal & Delete */}
                <div className="flex flex-col items-end justify-between">
                  <p className="text-lg font-bold text-foreground">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                    aria-label={`Remove ${item.title} from cart`}
                    title={`Remove ${item.title}`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="p-6 border border-border rounded-lg bg-card sticky top-4 space-y-4">
              <h2 className="text-xl font-serif font-bold text-foreground">
                Order Summary
              </h2>

              <div className="space-y-3 border-t border-b py-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span>${(total * 0.1).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-foreground">
                <span>Total</span>
                <span>${(total + total * 0.1).toLocaleString()}</span>
              </div>

              <Button variant="luxury" size="lg" className="w-full" onClick={() => setSearchParams({ view: "checkout" })}>
                Proceed to Checkout
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => setSearchParams({})}
              >
                Continue Shopping
              </Button>

              <button
                onClick={clearCart}
                className="w-full text-sm text-red-500 hover:text-red-600 transition-colors py-2"
                aria-label="Clear entire cart"
                title="Clear entire cart"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
