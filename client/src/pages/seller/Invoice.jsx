import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";

export default function Invoice() {
  const { orderId } = useParams();
  const { token } = useContext(AuthContext); // ✅ Auth token for secured endpoints
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🧠 Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        console.log("📦 Fetching order details for:", orderId);
        const res = await axios.get(
          `http://localhost:5000/api/orders/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrder(res.data);
      } catch (err) {
        console.error("❌ Error fetching order:", err);
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, token]);

  // 📥 Download PDF invoice
  const handleDownload = async () => {
    try {
      console.log("📄 Downloading invoice for:", orderId);
      const res = await axios.get(
        `http://localhost:5000/api/seller/orders/${orderId}/invoice`,
        {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ✅ Create blob link and trigger download
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      toast.success("Invoice downloaded!");
    } catch (err) {
      console.error("❌ Download error:", err);
      toast.error("Failed to download invoice");
    }
  };

  // 🕒 Loading and empty states
  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600 dark:text-gray-300">
        Loading invoice details...
      </p>
    );

  if (!order)
    return (
      <p className="text-center mt-10 text-gray-600 dark:text-gray-300">
        No order found 😢
      </p>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6"
    >
      {/* 🧾 Header */}
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
          <FileText size={24} /> Invoice
        </h2>
        <button
          onClick={handleDownload}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Download size={18} /> Download PDF
        </button>
      </div>

      {/* 📄 Invoice Info */}
      <div className="mb-6 text-gray-700 dark:text-gray-300">
        <p>
          <span className="font-semibold">Invoice ID:</span> INV-
          {order._id.slice(-6).toUpperCase()}
        </p>
        <p>
          <span className="font-semibold">Date:</span>{" "}
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
        <p>
          <span className="font-semibold">Customer:</span>{" "}
          {order.customer?.name || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Email:</span>{" "}
          {order.customer?.email || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Phone:</span>{" "}
          {order.customer?.phone || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Address:</span>{" "}
          {order.customer?.address || "N/A"}
        </p>
      </div>

      {/* 🛒 Product List */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="p-2 border dark:border-gray-600 text-left">#</th>
              <th className="p-2 border dark:border-gray-600 text-left">
                Product
              </th>
              <th className="p-2 border dark:border-gray-600 text-center">
                Qty
              </th>
              <th className="p-2 border dark:border-gray-600 text-center">
                Price
              </th>
              <th className="p-2 border dark:border-gray-600 text-center">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-2 border dark:border-gray-600">{i + 1}</td>
                <td className="p-2 border dark:border-gray-600">{item.name}</td>
                <td className="p-2 border dark:border-gray-600 text-center">
                  {item.quantity}
                </td>
                <td className="p-2 border dark:border-gray-600 text-center">
                  ₹{item.price}
                </td>
                <td className="p-2 border dark:border-gray-600 text-center">
                  ₹{item.price * item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 💰 Summary */}
      <div className="mt-6 flex justify-between items-center text-gray-800 dark:text-gray-100">
        <p className="text-lg font-semibold">
          Status:{" "}
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
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
        </p>
        <p className="text-xl font-bold text-indigo-600">
          Total: ₹{order.totalAmount}
        </p>
      </div>
    </motion.div>
  );
}
