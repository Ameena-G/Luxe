import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeaturedCategories } from "@/components/FeaturedCategories";
import { ProductShowcase } from "@/components/ProductShowcase";
import { NewsletterSection } from "@/components/NewsletterSection";
import { ProductsPage } from "@/components/ProductsPage";
import { ProductDetail } from "@/components/ProductDetail";
import { CartPage } from "@/components/CartPage";
import { WishlistPage } from "@/components/WishlistPage";
import { CheckoutPage } from "@/components/CheckoutPage";
import { PaymentSuccessPage } from "@/components/PaymentSuccessPage";

const Index = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const productId = searchParams.get("id");
  const view = searchParams.get("view");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {view === "payment-success" ? (
          <PaymentSuccessPage />
        ) : view === "checkout" ? (
          <CheckoutPage />
        ) : view === "cart" ? (
          <CartPage />
        ) : view === "wishlist" ? (
          <WishlistPage />
        ) : productId ? (
          <ProductDetail />
        ) : category || search ? (
          <ProductsPage />
        ) : (
          <>
            <HeroSection />
            <FeaturedCategories />
            <ProductShowcase />
            <NewsletterSection />
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
