// src/components/Header.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, ShoppingBag, Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use the cart context
  const { cart = [], wishlist = [], cartCount = 0, wishlistCount = 0 } = useCart();

  // Close search when navigating away
  useEffect(() => {
    setIsSearchOpen(false);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      // Create a new URLSearchParams to handle the query parameters
      const searchParams = new URLSearchParams();
      searchParams.set('search', query);
      
      // Navigate to the search results page
      navigate(`/?${searchParams.toString()}`);
      
      // Close the search bar but keep the query for better UX
      setIsSearchOpen(false);
    }
  };

  // Handle search input key down for better UX
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  // Update search query when URL changes (for back/forward navigation)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location.search]);

  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border/40 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="text-2xl font-serif font-bold text-foreground">
          Luxe Haven
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="/" className="text-foreground/80 hover:text-foreground transition-colors">
            Home
          </a>
          <a href="/?category=new-arrivals" className="text-foreground/80 hover:text-foreground transition-colors">
            New Arrivals
          </a>
          <a href="/?category=watches" className="text-foreground/80 hover:text-foreground transition-colors">
            Watches
          </a>
          <a href="/?category=handbags" className="text-foreground/80 hover:text-foreground transition-colors">
            Handbags
          </a>
          <a href="/?category=wallets" className="text-foreground/80 hover:text-foreground transition-colors">
            Wallets
          </a>
        </nav>

        {/* Search and Icons */}
        <div className="flex items-center space-x-4">
          {/* Search Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground/80"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            type="button"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-foreground/80 hover:text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Wishlist */}
          <a
            href="/?view=wishlist"
            className="relative p-2 text-foreground/80 hover:text-foreground"
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </a>

          {/* Cart */}
          <a
            href="/?view=cart"
            className="relative p-2 text-foreground/80 hover:text-foreground"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </a>
        </div>

        {/* Search Bar (Full Width) */}
        {isSearchOpen && (
          <div className="absolute left-0 right-0 top-full bg-background border-b border-border/40 p-4 shadow-md">
            <form onSubmit={handleSearch} className="w-full container mx-auto flex gap-2">
              <Input
                type="text"
                placeholder="Search for products or brands..."
                className="flex-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <Button type="submit" variant="ghost" className="whitespace-nowrap text-foreground/80 hover:text-foreground">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border/40">
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-2">
            <a
              href="/"
              className="py-2 px-4 text-foreground/80 hover:text-foreground hover:bg-accent/50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="/?category=new-arrivals"
              className="py-2 px-4 text-foreground/80 hover:text-foreground hover:bg-accent/50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              New Arrivals
            </a>
            <a
              href="/?category=watches"
              className="py-2 px-4 text-foreground/80 hover:text-foreground hover:bg-accent/50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Watches
            </a>
            <a
              href="/?category=handbags"
              className="py-2 px-4 text-foreground/80 hover:text-foreground hover:bg-accent/50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Handbags
            </a>
            <a
              href="/?category=wallets"
              className="py-2 px-4 text-foreground/80 hover:text-foreground hover:bg-accent/50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Wallets
            </a>
          </div>
        </div>
      )}
    </header>
  );
}