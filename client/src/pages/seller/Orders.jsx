import { useEffect, useState, useContext } from "react";
import axios from "axios";
import io from "socket.io-client";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";

export default function SellerOrders() {
  const { user, token } = useContext(AuthContext); // ✅ get seller info
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Setup socket once seller is logged in
  useEffect(() => {
    if (!user?._id) return;

    const socket = io("http://localhost:5000", { transports: ["websocket"] });
    socket.emit("registerSeller", user._id);
    console.log("📡 Registered seller for real-time updates:", user._id);

    // Refresh orders when relevant socket events arrive
    socket.on("orderCreated", (order) => {
      if (order.seller === user._id) {
        console.log("🆕 New order for you:", order._id);
        fetchOrders();
      }
    });

    socket.on("orderUpdated", (order) => {
      if (order.seller === user._id) {
        console.log("🔄 Order updated:", order._id);
        fetchOrders();
      }
    });

    socket.on("orderCancelled", (order) => {
      if (order.seller === user._id) {
        console.log("❌ Order cancelled:", order._id);
        fetchOrders();
      }
    });

    return () => socket.disconnect();
  }, [user?._id]);

  // ✅ Fetch seller’s orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/seller/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching seller orders:", err);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  // ✅ Update order status
  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/seller/orders/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Order status updated!");
      fetchOrders();
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status");
    }
  };

  // ✅ Download invoice
  const downloadInvoice = (id) => {
    window.open(
      `http://localhost:5000/api/seller/orders/${id}/invoice`,
      "_blank"
    );
  };

  const statuses = [
    "Pending",
    "Confirmed",
    "Packing",
    "Ready to Dispatch",
    "Shipped",
    "Delivered",
  ];

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600 dark:text-gray-300">
        Loading orders...
      </p>
    );

  if (orders.length === 0)
    return (
      <p className="text-center mt-10 text-gray-600 dark:text-gray-300">
        No orders found 📦
      </p>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">
        📦 Manage Orders
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Total (₹)</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <td className="p-3 font-mono text-sm">
                  {order._id.slice(-6).toUpperCase()}
                </td>
                <td className="p-3 text-sm">
                  {order.customer?.name || "N/A"}
                  <br />
                  <span className="text-gray-500 text-xs">
                    {order.customer?.email}
                  </span>
                </td>
                <td className="p-3 text-sm text-gray-600 dark:text-gray-300">
                  {order.customer?.address || "N/A"}
                </td>
                <td className="p-3 font-semibold">{order.totalAmount}</td>
                <td className="p-3">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="border rounded p-1 bg-gray-50 dark:bg-gray-700 text-sm"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => downloadInvoice(order._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition text-sm"
                  >
                    Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
