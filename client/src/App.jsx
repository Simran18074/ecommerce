import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useState } from "react";

// 🌍 Context Providers
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";

// 🧭 Common Components
import Navbar from "./components/Navbar";
import ProtectedSellerRoute from "./components/ProtectedSellerRoute";
import ProtectedBuyerRoute from "./components/ProtectedBuyerRoute"; // ✅ added

// 🛍️ Buyer Pages
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyOrders from "./pages/MyOrders";

// 🏬 Seller Pages
import SellerLayout from "./pages/seller/SellerLayout";
import SellerDashboard from "./pages/seller/Dashboard";
import SellerOrders from "./pages/seller/Orders";
import Invoice from "./pages/seller/Invoice";
import SellerRegister from "./pages/seller/SellerRegister";
import SellerLogin from "./pages/seller/SellerLogin";

function AppContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  // 🧠 Hide Navbar on all seller routes
  const hideNavbar = location.pathname.startsWith("/seller");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* 🧭 Navbar only for buyer-facing pages */}
      {!hideNavbar && <Navbar onSearch={(q) => setSearchQuery(q)} />}

      <main className="pb-10">
        <Routes>
          {/* 🛍️ Buyer Routes */}
          <Route path="/" element={<Home searchQuery={searchQuery} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🧾 Protected Buyer Routes */}
          <Route
            path="/checkout"
            element={
              <ProtectedBuyerRoute>
                <Checkout />
              </ProtectedBuyerRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ProtectedBuyerRoute>
                <MyOrders />
              </ProtectedBuyerRoute>
            }
          />
          <Route
            path="/order-confirmation/:orderId"
            element={<OrderConfirmation />}
          />

          {/* 🏬 Seller Auth Routes */}
          <Route path="/seller/register" element={<SellerRegister />} />
          <Route path="/seller/login" element={<SellerLogin />} />

          {/* 🏬 Protected Seller Dashboard */}
          <Route
            path="/seller"
            element={
              <ProtectedSellerRoute>
                <SellerLayout />
              </ProtectedSellerRoute>
            }
          >
            <Route path="dashboard" element={<SellerDashboard />} />
            <Route path="orders" element={<SellerOrders />} />
            <Route path="invoice/:orderId" element={<Invoice />} />
          </Route>

          {/* 🚫 404 Fallback */}
          <Route
            path="*"
            element={
              <div className="text-center text-gray-500 mt-20">
                <h1 className="text-2xl font-semibold">404 - Page Not Found</h1>
                <p className="mt-2">
                  <a href="/" className="text-indigo-600 hover:underline">
                    Go back home
                  </a>
                </p>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
