import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );
  const [role, setRole] = useState(() => localStorage.getItem("role") || "");
  const [loading, setLoading] = useState(true); // start loading initially

  // 🌍 Base URL
  const BASE_URL = "http://localhost:5000/api/auth";

  // ============================================================
  // ⚙️ Apply Authorization header globally
  // ============================================================
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // ============================================================
  // 💾 Persist auth data in localStorage
  // ============================================================
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");

    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");

    if (role) localStorage.setItem("role", role);
    else localStorage.removeItem("role");
  }, [token, user, role]);

  // ============================================================
  // 🧍 REGISTER (Buyer or Seller)
  // ============================================================
  const register = async (data, userRole = "buyer") => {
    setLoading(true);
    try {
      const endpoint = `${BASE_URL}/${userRole}/register`;
      const res = await axios.post(endpoint, data);

      setToken(res.data.token);
      setUser(res.data.user);
      setRole(res.data.user.role || userRole);

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.token}`;

      toast.success(`${userRole} registered successfully 🎉`);

      // ✅ Return user object for redirection handling
      return { ok: true, user: res.data.user };
    } catch (err) {
      console.error("Register error:", err);
      toast.error(err?.response?.data?.message || "Registration failed");
      return { ok: false, message: err?.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // 🔑 LOGIN (Buyer or Seller)
  // ============================================================
  const login = async (email, password, userRole = "buyer") => {
    setLoading(true);
    try {
      const endpoint = `${BASE_URL}/${userRole}/login`;
      const res = await axios.post(endpoint, { email, password });

      setToken(res.data.token);
      setUser(res.data.user);
      setRole(res.data.user.role || userRole);

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.token}`;

      toast.success(`Welcome back, ${res.data.user.name}! 👋`);

      // ✅ Return user object for direct UI usage
      return { ok: true, user: res.data.user };
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err?.response?.data?.message || "Login failed");
      return { ok: false, message: err?.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // 🚪 LOGOUT
  // ============================================================
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setRole("");
    delete axios.defaults.headers.common["Authorization"];
    localStorage.clear();
    toast("Logged out 👋");
  }, []);

  // ============================================================
  // 🧠 FETCH CURRENT USER (Restore after refresh)
  // ============================================================
  const fetchMe = useCallback(async () => {
    if (!token) return null;
    try {
      const res = await axios.get(`${BASE_URL}/me`);
      if (res.data?.user) {
        setUser(res.data.user);
        setRole(res.data.user.role || "");
        return res.data.user;
      }
      return null;
    } catch (err) {
      console.error("❌ fetchMe failed:", err);
      logout();
      return null;
    }
  }, [token, logout]);

  // ============================================================
  // ♻️ Restore Session on Refresh
  // ============================================================
  useEffect(() => {
    const restoreSession = async () => {
      if (token && !user) {
        try {
          await fetchMe();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    restoreSession();
  }, [token, user, fetchMe]);

  // ============================================================
  // 🌐 Provide context
  // ============================================================
  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        fetchMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
