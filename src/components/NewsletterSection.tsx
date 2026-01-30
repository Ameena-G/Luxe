// src/components/NewsletterSection.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Mail } from "lucide-react";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/lib/api";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await subscribeToNewsletter(email);
      
      if (result.success) {
        toast.success(
          result.isAlreadySubscribed 
            ? "You're already subscribed to our newsletter!" 
            : "Thank you for subscribing to our newsletter!"
        );
        if (!result.isAlreadySubscribed) {
          setEmail(""); // Clear the input on successful subscription
        }
      } else {
        toast.error(result.message || "Failed to subscribe. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-dark">
      <div className="container mx-auto text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-6 w-6 text-primary mr-2" />
            <span className="text-primary font-medium tracking-wider uppercase text-sm">
              Exclusive Access
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-background mb-6">
            Join the 
            <span className="bg-gradient-luxury bg-clip-text text-transparent"> Elite Circle</span>
          </h2>
          
          <p className="text-xl text-background/90 mb-12 leading-relaxed">
            Be the first to discover new arrivals, exclusive collections, and receive 
            personalized luxury recommendations tailored to your refined taste.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="pl-11 bg-background/10 border-background/20 text-background placeholder:text-background/60 focus:border-primary transition-colors h-12"
                disabled={isLoading}
              />
            </div>
            <Button 
              variant="luxury" 
              size="lg"
              className="h-12 px-8"
              type="submit"
              disabled={isLoading || !email}
            >
              {isLoading ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
          
          <p className="text-background/70 text-sm mt-6">
            Join over 50,000 luxury enthusiasts. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}