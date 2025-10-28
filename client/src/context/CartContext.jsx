import { createContext, useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // ✅ Initialize cart directly from localStorage (before first render)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("❌ Error loading cart:", err);
      return [];
    }
  });

  const toastLock = useRef(new Set());

  const showToast = (key, message, type = "success") => {
    if (toastLock.current.has(key)) return;
    toastLock.current.add(key);

    if (type === "success") toast.success(message);
    else if (type === "error") toast.error(message);
    else toast(message);

    setTimeout(() => toastLock.current.delete(key), 300);
  };

  // ✅ Keep localStorage synced with cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 🛒 Add to cart
  const addToCart = (product) => {
    const existing = cart.find((p) => p._id === product._id);
    if (existing) {
      const updated = cart.map((p) =>
        p._id === product._id ? { ...p, quantity: p.quantity + 1 } : p
      );
      setCart(updated);
      showToast(`update-${product._id}`, "Quantity updated!");
    } else {
      const newCart = [...cart, { ...product, quantity: 1 }];
      setCart(newCart);
      showToast(`add-${product._id}`, `${product.name} added to cart 🛒`);
    }
  };

  // ❌ Remove item
  const removeFromCart = (id) => {
    const removed = cart.find((p) => p._id === id);
    const updated = cart.filter((p) => p._id !== id);
    setCart(updated);
    showToast(
      `remove-${id}`,
      `${removed?.name || "Item"} removed from cart ❌`,
      "error"
    );
  };

  // 🧹 Clear cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart"); // ✅ clear storage too
    showToast("clear", "Cart cleared!");
  };

  // 💰 Calculate total
  const total = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
};
