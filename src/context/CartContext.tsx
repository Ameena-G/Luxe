import React, { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface WishlistItem {
  id: string;
  title: string;
  image: string;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  cartCount: number;
  wishlistCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("luxe-cart");
    const savedWishlist = localStorage.getItem("luxe-wishlist");
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("luxe-cart", JSON.stringify(cart));
  }, [cart]);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem("luxe-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((x) => x.id === item.id);
      if (existing) {
        return prev.map((x) =>
          x.id === item.id ? { ...x, quantity: x.quantity + item.quantity } : x
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((x) => x.id !== id));
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart((prev) =>
        prev.map((x) => (x.id === id ? { ...x, quantity } : x))
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const addToWishlist = (item: WishlistItem) => {
    setWishlist((prev) => {
      const exists = prev.find((x) => x.id === item.id);
      if (exists) return prev;
      return [...prev, item];
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((x) => x.id !== id));
  };

  const isInWishlist = (id: string) => {
    return wishlist.some((x) => x.id === id);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        cartCount: cart.length,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
