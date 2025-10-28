import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedBuyerRoute({ children }) {
  const { user, token, loading } = useContext(AuthContext);
  const location = useLocation();

  // ⏳ Wait for auth check to complete before deciding
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 dark:text-gray-300">
        Restoring your session...
      </div>
    );
  }

  // 🚫 If not logged in → redirect to login (and remember current page)
  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 🚫 If not a buyer → redirect home
  if (user.role !== "buyer") {
    return <Navigate to="/" replace />;
  }

  // ✅ Otherwise, allow access
  return children;
}
