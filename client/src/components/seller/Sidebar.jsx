import { Link, useLocation } from "react-router-dom";

export default function SellerSidebar() {
  const { pathname } = useLocation();

  const links = [
    { to: "/seller/dashboard", label: "Dashboard" },
    { to: "/seller/orders", label: "Orders" },
  ];

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-6">
      <h2 className="text-xl font-bold mb-8">🛍️ Seller Panel</h2>
      <nav className="space-y-4">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`block px-4 py-2 rounded-lg ${
              pathname === link.to
                ? "bg-indigo-600"
                : "hover:bg-gray-700 transition"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
