import { useEffect, useState, useContext } from "react";
import axios from "axios";
import io from "socket.io-client";
import { AuthContext } from "../../context/AuthContext"; // ✅ get logged-in seller
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";

export default function SellerDashboard() {
  const { user, token } = useContext(AuthContext); // ✅ seller info
  const [stats, setStats] = useState({
    totalOrders: 0,
    pending: 0,
    delivered: 0,
    cancelled: 0,
    revenue: 0,
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!user?._id) return;

    const socket = io("http://localhost:5000", {
      transports: ["websocket"],
    });

    // ✅ Register this seller
    socket.emit("registerSeller", user._id);
    console.log("🧾 Registered seller socket:", user._id);

    fetchStats();

    // ✅ Real-time listeners
    socket.on("orderCreated", (order) => {
      console.log("🆕 New order received:", order);
      if (order.seller === user._id) fetchStats();
    });

    socket.on("orderUpdated", (order) => {
      console.log("🔄 Order updated:", order);
      if (order.seller === user._id) fetchStats();
    });

    socket.on("orderCancelled", (order) => {
      console.log("❌ Order cancelled:", order);
      if (order.seller === user._id) fetchStats();
    });

    return () => socket.disconnect();
  }, [user?._id]);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/seller/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data.summary);
      setChartData(res.data.salesData);
    } catch (err) {
      console.error("Error fetching seller stats:", err);
    }
  };

  const cards = [
    { title: "Total Orders", value: stats.totalOrders, color: "bg-indigo-500" },
    { title: "Pending Orders", value: stats.pending, color: "bg-yellow-500" },
    {
      title: "Delivered Orders",
      value: stats.delivered,
      color: "bg-green-500",
    },
    { title: "Cancelled Orders", value: stats.cancelled, color: "bg-red-500" },
    {
      title: "Total Revenue",
      value: `₹${stats.revenue}`,
      color: "bg-purple-500",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 dark:text-white">
        📊 Seller Dashboard
      </h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`${card.color} text-white p-5 rounded-2xl shadow-lg`}
          >
            <h3 className="text-sm font-medium opacity-80">{card.title}</h3>
            <p className="text-2xl font-bold mt-1">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <h3 className="text-xl font-semibold mb-4 dark:text-gray-100">
          Monthly Sales Overview
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />
            <Bar dataKey="sales" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
