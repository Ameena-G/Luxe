import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader } from "lucide-react";
import { useCart } from "@/context/CartContext";

declare global {
  interface Window {
    Cashfree: any;
  }
}

export function CheckoutPage() {
  const [, setSearchParams] = useSearchParams();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = total * 0.1;
  const grandTotal = total + tax;

  // Verify Cashfree SDK is loaded
  useEffect(() => {
    if (window.Cashfree) {
      console.log("✅ Cashfree SDK is loaded and ready");
    } else {
      console.error("❌ Cashfree SDK is NOT loaded");
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = async () => {
    // Validate required fields
    if (
      !formData.firstName ||
      !formData.email ||
      !formData.phone ||
      !formData.address
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      console.log("Starting payment process with items:", cart);
      
      // Call backend to create payment order
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          customer: `${formData.firstName} ${formData.lastName}`,
          address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      console.log("Backend response status:", response.status);
      const data = await response.json();
      console.log("Backend response data:", data);

      if (!data.success) {
        throw new Error(data.error || "Failed to create payment order");
      }

      if (!data.payment_session_id) {
        throw new Error("No payment session received from server");
      }

      console.log("Payment session ID received:", data.payment_session_id);

      // Verify Cashfree SDK is available
      if (!window.Cashfree) {
        throw new Error("Cashfree SDK not loaded. Please refresh the page.");
      }

      // Initialize Cashfree instance
      const cashfree = window.Cashfree({
        mode: "sandbox" // Change to "production" for live payments
      });

      // Checkout options
      const checkoutOptions = {
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_modal", // Opens payment in modal
      };

      console.log("Opening Cashfree checkout modal with options:", checkoutOptions);

      // Open Cashfree payment modal
      cashfree.checkout(checkoutOptions).then((result: any) => {
        console.log("Cashfree payment result:", result);
        
        if (result.error) {
          // Payment failed
          console.error("Payment error:", result.error);
          alert(`Payment failed: ${result.error.message}`);
          setLoading(false);
        } else if (result.paymentDetails) {
          // Payment successful
          console.log("Payment successful! Details:", result.paymentDetails);
          alert("Payment successful! Order confirmed.");
          
          // Clear cart and redirect to success page
          clearCart();
          setSearchParams({ view: "success" });
        } else {
          // Payment was closed/cancelled
          console.log("Payment modal closed by user");
          alert("Payment was cancelled");
          setLoading(false);
        }
      }).catch((error: any) => {
        console.error("Cashfree checkout error:", error);
        alert("Failed to open payment gateway");
        setLoading(false);
      });

    } catch (error: any) {
      console.error("Payment error details:", error);
      alert(error.message || "Payment failed. Please try again.");
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <section className="py-20 px-4 bg-background min-h-screen">
        <div className="container mx-auto text-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-serif font-bold text-foreground">
              Checkout
            </h1>
            <p className="text-xl text-muted-foreground">Your cart is empty</p>
            <Button variant="luxury" onClick={() => setSearchParams({})}>
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
      <div className="container mx-auto max-w-6xl">
        <Button
          variant="ghost"
          className="mb-8 text-muted-foreground hover:text-foreground"
          onClick={() => setSearchParams({ view: "cart" })}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Button>

        <h1 className="text-4xl font-serif font-bold text-foreground mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 border border-border rounded-lg bg-card">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
                Delivery Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="firstName"
                  placeholder="First Name *"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                <Input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                <Input
                  type="text"
                  name="address"
                  placeholder="Address *"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="md:col-span-2"
                />
                <Input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                />
                <Input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleInputChange}
                />
                <Input
                  type="text"
                  name="zipCode"
                  placeholder="ZIP Code"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6 border border-border rounded-lg bg-card">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
                Order Items
              </h2>

              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center pb-4 border-b border-border last:border-0"
                  >
                    <div className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-foreground">
                          {item.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-foreground">
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary & Payment */}
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
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-foreground">
                <span>Total</span>
                <span>${grandTotal.toLocaleString()}</span>
              </div>

              <Button
                variant="luxury"
                size="lg"
                className="w-full"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Proceed to Payment"
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Secure payment powered by Cashfree
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}