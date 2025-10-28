import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, total } = useContext(CartContext);

  if (cart.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600">
        <h2 className="text-2xl font-bold mb-3">🛒 Your Cart</h2>
        <p className="mb-4">Your cart is empty.</p>
        <Link
          to="/"
          className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">🛍️ Your Cart</h2>

      {cart.map((item) => (
        <div
          key={item._id}
          className="flex items-center justify-between bg-white text-black shadow-sm rounded-2xl p-4 mb-3 hover:shadow-md transition"
        >
          <div className="flex items-center gap-4">
            {/* ✅ Product image */}
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-gray-600 text-sm">
                ₹{item.price} × {item.quantity}
              </p>
            </div>
          </div>

          {/* ❌ Remove button */}
          <button
            onClick={() => removeFromCart(item._id)}
            className="text-red-500 hover:text-red-700 font-medium"
          >
            Remove
          </button>
        </div>
      ))}

      {/* 💰 Total Section */}
      <div className="flex justify-between items-center mt-6 border-t pt-4">
        <h3 className="text-xl font-semibold">Total: ₹{total}</h3>
        <Link
          to="/checkout"
          className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
