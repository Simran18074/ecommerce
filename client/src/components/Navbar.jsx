import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

export default function Navbar({ onSearch }) {
  const { cart } = useContext(CartContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // 🧠 Debounced search — runs after 400ms of pause
  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(query);
      navigate("/");
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  // 🧭 Logout handler
  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-gray-800 dark:to-gray-900 text-white shadow-md transition-all duration-300">
      <div className="flex justify-between items-center max-w-7xl mx-auto p-4">
        {/* 🛍️ Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide hover:scale-105 transition-transform"
        >
          🛍️ E-Shop
        </Link>

        {/* 🔎 Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="px-3 py-1 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <span className="absolute right-2 top-1 text-black">🔍</span>
          </div>

          <Link
            to="/"
            className="hover:text-yellow-300 font-medium transition-colors"
          >
            Home
          </Link>

          <Link
            to="/cart"
            className="hover:text-yellow-300 relative font-medium transition-colors"
          >
            Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
          </Link>

          <Link
            to="/my-orders"
            className="hover:text-yellow-300 font-medium transition-colors"
          >
            My Orders
          </Link>

          <Link
            to="/checkout"
            className="hover:text-yellow-300 font-medium transition-colors"
          >
            Checkout
          </Link>

          {/* 👤 Auth Buttons */}
          {user ? (
            <>
              <span className="font-medium">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-yellow-300 font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-yellow-300 font-medium transition-colors"
              >
                Register
              </Link>
            </>
          )}

          {/* 🌙 Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="ml-2 bg-yellow-400 hover:bg-yellow-300 text-black px-3 py-1 rounded-md font-semibold transition flex items-center gap-1"
            title="Toggle Dark Mode"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        {/* 🍔 Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-3xl focus:outline-none transition-transform"
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* 📱 Mobile Dropdown */}
      <div
        className={`md:hidden bg-indigo-700 dark:bg-gray-800 text-white transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-[32rem] opacity-100 p-4" : "max-h-0 opacity-0 p-0"
        }`}
      >
        <div className="flex flex-col space-y-4">
          {/* Search in Mobile */}
          <div className="flex">
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="px-3 py-2 w-full rounded-l-md text-black focus:outline-none"
            />
            <button
              onClick={() => {
                onSearch(query);
                navigate("/");
              }}
              className="bg-yellow-400 text-black px-3 rounded-r-md hover:bg-yellow-500 transition"
            >
              🔍
            </button>
          </div>

          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="hover:text-yellow-300 font-medium"
          >
            Home
          </Link>

          <Link
            to="/cart"
            onClick={() => setMenuOpen(false)}
            className="hover:text-yellow-300 font-medium"
          >
            Cart ({cart.length})
          </Link>

          <Link
            to="/my-orders"
            onClick={() => setMenuOpen(false)}
            className="hover:text-yellow-300 font-medium"
          >
            My Orders
          </Link>

          <Link
            to="/checkout"
            onClick={() => setMenuOpen(false)}
            className="hover:text-yellow-300 font-medium"
          >
            Checkout
          </Link>

          {/* 👤 Auth Buttons (Mobile) */}
          {user ? (
            <>
              <span className="font-medium">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-2 rounded-md font-semibold hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="hover:text-yellow-300 font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="hover:text-yellow-300 font-medium"
              >
                Register
              </Link>
            </>
          )}

          {/* 🌙 Dark Mode Toggle in Mobile */}
          <button
            onClick={() => {
              toggleTheme();
              setMenuOpen(false);
            }}
            className="bg-yellow-400 text-black px-3 py-2 rounded-md font-semibold hover:bg-yellow-300 transition"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </div>
    </nav>
  );
}
