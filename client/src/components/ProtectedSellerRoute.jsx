import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ProtectedSellerRoute({ children }) {
  const { user, token, role, fetchMe } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      if (!token) {
        toast.error("Please log in to continue");
        navigate("/seller/login");
        return;
      }

      if (!user) {
        await fetchMe();
      }

      if (role !== "seller") {
        toast.error("Unauthorized access");
        navigate("/");
      }
    };

    checkAccess();
  }, [user, role, token, navigate, fetchMe]);

  if (token && role === "seller") return children;

  return (
    <div className="flex items-center justify-center min-h-screen text-gray-500">
      Checking access...
    </div>
  );
}
