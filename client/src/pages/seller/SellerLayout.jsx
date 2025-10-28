import { useState, useContext } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";
import { Menu, X, LogOut } from "lucide-react";

export default function SellerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/seller/dashboard", label: "Dashboard" },
    { path: "/seller/orders", label: "Orders" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* 🌙 Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 z-40 w-64 h-full bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        <div className="p-5 flex justify-between items-center border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            Seller Panel
          </h2>
          <button
            className="md:hidden text-gray-600 dark:text-gray-300"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2 rounded-lg font-medium transition ${
                location.pathname === item.path
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <button
            onClick={toggleTheme}
            className="w-full mt-4 bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded-md font-semibold transition"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          <button
            onClick={handleLogout}
            className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold transition flex items-center justify-center gap-2"
          >
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </div>

      {/* 📱 Sidebar Toggle Button (Mobile) */}
      <button
        className="fixed top-4 left-4 md:hidden z-50 bg-indigo-600 text-white p-2 rounded-md shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu size={22} />
      </button>

      {/* 🧾 Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="hidden md:flex justify-between items-center bg-white dark:bg-gray-800 shadow-sm px-6 py-3">
          <h1 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {location.pathname === "/seller/dashboard"
              ? "Dashboard"
              : location.pathname.includes("/seller/orders")
              ? "Orders"
              : "Invoice"}
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="text-sm bg-yellow-400 hover:bg-yellow-300 text-black px-3 py-1 rounded-md font-semibold"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        {/* 🧩 Page Outlet */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
