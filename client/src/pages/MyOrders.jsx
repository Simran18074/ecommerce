import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function MyOrders() {
  const { user, token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        "http://localhost:5000/api/orders/my-orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
    
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  // ❌ Cancel Order
  const cancelOrder = async (id) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      await axios.patch(
        `http://localhost:5000/api/orders/${id}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Order cancelled");
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to cancel order");
    }
  };

  // 🔄 Tracking Progress Bar UI
  const renderProgress = (status) => {
    const steps = ["Pending", "Shipped", "Delivered"];
    const current = steps.indexOf(status);
    return (
      <div className="flex items-center justify-between w-full mt-2">
        {steps.map((step, i) => (
          <div key={step} className="flex-1 flex items-center">
            <div
              className={`h-2 w-full rounded ${
                i <= current ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-700"
              }`}
            ></div>
            {i < steps.length - 1 && <div className="w-2"></div>}
          </div>
        ))}
      </div>
    );
  };

  if (!user)
    return (
      <p className="text-center mt-10 text-gray-600 dark:text-gray-300">
        Please log in to view your orders.
      </p>
    );

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600 dark:text-gray-300">
        Loading your orders...
      </p>
    );

  if (orders.length === 0)
    return (
      <p className="text-center mt-10 text-gray-600 dark:text-gray-300">
        You haven’t placed any orders yet 🛒
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">
        My Orders ({orders.length})
      </h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold dark:text-white">
                Order #{order._id.slice(-6).toUpperCase()}
              </h3>
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : order.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "Cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* 🚚 Progress Bar */}
            {order.status !== "Cancelled" && renderProgress(order.status)}

            <div className="divide-y divide-gray-200 dark:divide-gray-700 mt-3">
              {Array.isArray(order.products) &&
                order.products.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between py-3 items-center"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="font-medium dark:text-gray-100">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-indigo-600 dark:text-indigo-400">
                      ₹{item.price}
                    </p>
                  </div>
                ))}
            </div>

            <div className="flex justify-between items-center mt-4">
              <p className="font-semibold dark:text-gray-200">
                Total: ₹{order.totalAmount}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(order.createdAt).toLocaleDateString()}{" "}
                {new Date(order.createdAt).toLocaleTimeString()}
              </p>
            </div>

            {/* ❌ Cancel Button */}
            {order.status === "Pending" && (
              <button
                onClick={() => cancelOrder(order._id)}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
              >
                Cancel Order
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
