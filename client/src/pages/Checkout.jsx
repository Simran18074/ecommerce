import { useContext, useState, useRef } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Checkout() {
  const { cart, total, clearCart } = useContext(CartContext);
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [details, setDetails] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const toastShownRef = useRef(false);

  // 🧾 Handle checkout form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    console.log("🟢 Checkout started");
    console.log("👤 User:", user);
    console.log("🛒 Cart:", cart);
    console.log("💰 Total:", total);

    // 🔒 Require login
    if (!user || !token) {
      toast.error("Please log in to place an order.");
      navigate("/login");
      setSubmitting(false);
      return;
    }

    // 🛒 Require non-empty cart
    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        customer: details,
        items: cart.map((item) => ({
          product: item._id, // ✅ backend expects 'product'
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: total,
      };

      console.log("📦 Sending order to backend:", payload);

      const res = await axios.post(
        "http://localhost:5000/api/orders",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Order successfully created:", res.data);
      toast.success("Order placed successfully 🎉");

      clearCart();
      navigate(`/order-confirmation/${res.data._id}`);
    } catch (err) {
      console.error("❌ Order placement failed:", err);
      const msg =
        err.response?.data?.message ||
        "Something went wrong while placing your order.";
      toast.error(msg);

      if (err.response?.status === 401) navigate("/login");
    } finally {
      setSubmitting(false);
      toastShownRef.current = false;
      console.log("🔚 Checkout process ended");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg mt-10"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-white">
        🛍️ Checkout
      </h2>

      {/* Buyer Details */}
      {["name", "email", "phone", "address"].map((field) => (
        <input
          key={field}
          type={field === "email" ? "email" : "text"}
          required
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={details[field]}
          onChange={(e) =>
            setDetails((prev) => ({ ...prev, [field]: e.target.value }))
          }
          className="border dark:border-gray-700 p-2 w-full mb-3 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
        />
      ))}

      {/* Total */}
      <div className="flex justify-between items-center my-4">
        <span className="text-lg font-semibold dark:text-gray-200">
          Total: ₹{total.toFixed(2)}
        </span>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className={`bg-indigo-600 hover:bg-indigo-700 w-full text-white py-2 rounded-md font-semibold transition ${
          submitting ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {submitting ? "Placing Order..." : "Confirm Order"}
      </button>
    </form>
  );
}
