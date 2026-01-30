import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";

export function PaymentSuccessPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useState<"success" | "failed" | "loading">("loading");
  const [order, setOrder] = useState<any>(null);
  const { clearCart } = useCart();

  const orderId = searchParams.get("order_id");

  useEffect(() => {
    console.log("PaymentSuccessPage loaded with orderId:", orderId);
    
    if (!orderId) {
      console.warn("No order ID found in URL params");
      setStatus("failed");
      return;
    }

    // Verify payment with backend
    fetch("/api/payments/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    })
      .then((res) => {
        console.log("Verify payment response status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Payment verification response:", data);
        if (data.success) {
          setStatus("success");
          setOrder(data.order);
          // Clear cart only after successful verification
          clearCart();
        } else {
          console.warn("Payment verification failed:", data);
          setStatus("failed");
        }
      })
      .catch((err) => {
        console.error("Payment verification error:", err);
        setStatus("failed");
      });
  }, [orderId, clearCart]);

  if (status === "loading") {
    return (
      <section className="py-20 px-4 bg-background min-h-screen">
        <div className="container mx-auto text-center">
          <p className="text-xl text-muted-foreground">
            Verifying payment...
          </p>
        </div>
      </section>
    );
  }

  if (status === "failed") {
    return (
      <section className="py-20 px-4 bg-background min-h-screen">
        <div className="container mx-auto max-w-2xl text-center space-y-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
          <h1 className="text-4xl font-serif font-bold text-foreground">
            Payment Failed
          </h1>
          <p className="text-xl text-muted-foreground">
            Unfortunately, your payment could not be processed.
          </p>
          <div className="space-y-3">
            <Button
              variant="luxury"
              size="lg"
              onClick={() => setSearchParams({ view: "cart" })}
            >
              Return to Cart
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setSearchParams({})}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 bg-background min-h-screen flex flex-col items-center justify-center">
      <div className="container mx-auto max-w-3xl w-full">
        {/* Success Header - Always Visible */}
        <div className="text-center space-y-8 mb-16 p-12 bg-green-50 rounded-lg border-2 border-green-200">
          <div className="flex justify-center">
            <CheckCircle className="h-24 w-24 text-green-500 animate-pulse" />
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-serif font-bold text-green-700">
              Payment Successful!
            </h1>
            <p className="text-2xl text-green-600 font-semibold">
              ✓ Your order has been confirmed
            </p>
            <p className="text-lg text-green-600">
              Thank you for your purchase. A confirmation email has been sent to your inbox.
            </p>
          </div>
          {orderId && (
            <div className="pt-4 border-t-2 border-green-200">
              <p className="text-green-700 text-lg font-semibold">
                Order ID: <span className="text-green-600 font-bold">{orderId}</span>
              </p>
            </div>
          )}
        </div>

        {order && (
          <div className="space-y-8">
            {/* Order Details Card */}
            <div className="p-8 border-2 border-green-300 rounded-lg bg-white shadow-lg">
              <h2 className="text-2xl font-bold text-foreground mb-6 pb-4 border-b-2 border-green-200">
                📦 Order Details
              </h2>
              <div className="space-y-4 text-base">
                <div className="flex justify-between items-center py-2 px-4 bg-green-50 rounded">
                  <span className="text-muted-foreground font-semibold">Order ID:</span>
                  <span className="font-mono font-bold text-green-700">{order.orderId}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-4">
                  <span className="text-muted-foreground font-semibold">Customer:</span>
                  <span className="font-medium">{order.customer}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-4 bg-green-50 rounded">
                  <span className="text-muted-foreground font-semibold">Email:</span>
                  <span className="font-medium">{order.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-4">
                  <span className="text-muted-foreground font-semibold">Delivery Address:</span>
                  <span className="font-medium text-right max-w-xs">{order.address}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-4 bg-green-50 rounded">
                  <span className="text-muted-foreground font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold text-green-700">
                    ₹{order.total.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 px-4">
                  <span className="text-muted-foreground font-semibold">Status:</span>
                  <span className="px-4 py-1 bg-green-100 text-green-800 font-bold rounded-full text-sm">
                    ✓ {order.status?.toUpperCase() || 'COMPLETED'}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-8 border-2 border-border rounded-lg bg-card">
              <h3 className="text-xl font-bold text-foreground mb-4 pb-3 border-b-2 border-border">
                📋 Items Ordered
              </h3>
              <div className="space-y-3">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center pb-3 px-4 border-b border-border last:border-0 hover:bg-muted rounded transition"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                        </p>
                        <p className="text-sm text-green-600 font-bold">
                          ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No items found</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-6 mt-12 text-center">
          <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
            <p className="text-blue-800 font-semibold text-lg">
              📧 A confirmation email has been sent to your inbox
            </p>
            <p className="text-blue-600 text-sm mt-2">
              Please check your email for order details and tracking information
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <Button
              variant="luxury"
              size="lg"
              className="flex-1 text-lg py-6"
              onClick={() => setSearchParams({})}
            >
              🛍️ Continue Shopping
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1 text-lg py-6"
              onClick={() => alert("Track order feature coming soon")}
            >
              📦 Track Order
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
