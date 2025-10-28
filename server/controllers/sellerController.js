import Order from "../models/Order.js";
import User from "../models/User.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const getSellerStats = async (req, res) => {
  try {
    const sellerId = req.userId; // ✅ from auth middleware
    const orders = await Order.find({ seller: sellerId });

    if (!orders.length) {
      return res.json({
        summary: {
          totalOrders: 0,
          pending: 0,
          delivered: 0,
          cancelled: 0,
          revenue: 0,
        },
        salesData: [],
      });
    }

    const totalOrders = orders.length;
    const pending = orders.filter((o) => o.status === "Pending").length;
    const delivered = orders.filter((o) => o.status === "Delivered").length;
    const cancelled = orders.filter((o) => o.status === "Cancelled").length;

    const revenue = orders
      .filter((o) => o.status === "Delivered")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // ✅ Monthly data
    const monthlySales = {};
    orders.forEach((order) => {
      const month = new Date(order.createdAt).toLocaleString("default", {
        month: "short",
      });
      if (!monthlySales[month]) monthlySales[month] = 0;
      monthlySales[month] += order.totalAmount || 0;
    });

    const monthsOrder = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const salesData = monthsOrder
      .filter((m) => monthlySales[m])
      .map((m) => ({ month: m, sales: monthlySales[m] }));

    res.json({
      summary: { totalOrders, pending, delivered, cancelled, revenue },
      salesData,
    });
  } catch (err) {
    console.error("❌ Error generating seller stats:", err);
    res.status(500).json({ message: "Failed to fetch seller stats" });
  }
};


export const getAllOrders = async (req, res) => {
  try {
    const sellerId = req.userId;
    const orders = await Order.find({ seller: sellerId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching seller orders:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    // ✅ Emit real-time update for dashboard
    const io = req.app.get("io");
    if (io) io.emit("orderUpdated", order);

    console.log(`📦 Order ${order._id} updated to ${status}`);
    res.json(order);
  } catch (err) {
    console.error("❌ Update status error:", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
};


export const generateInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("seller", "name email");

    if (!order) return res.status(404).json({ message: "Order not found" });

    // 🧠 Only buyer or seller can access
    if (
      req.userId.toString() !== order.user._id.toString() &&
      req.userId.toString() !== order.seller._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // ✅ Set headers for direct download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${order._id}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    // ✅ Create PDF and stream directly
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    // 🔹 Header
    doc
      .fontSize(22)
      .fillColor("#4F46E5")
      .text("E-Shop Invoice", { align: "center" })
      .moveDown(0.5);
    doc
      .fontSize(12)
      .fillColor("black")
      .text(`Invoice ID: INV-${order._id.slice(-6).toUpperCase()}`)
      .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`)
      .moveDown(1);

    // 🔹 Customer Info
    doc
      .fontSize(14)
      .fillColor("#111")
      .text("Bill To:", { underline: true })
      .moveDown(0.3);
    doc
      .fontSize(12)
      .text(`Name: ${order.user?.name || "N/A"}`)
      .text(`Email: ${order.user?.email || "N/A"}`)
      .moveDown(1);

    // 🔹 Items Table
    doc
      .fontSize(14)
      .fillColor("#111")
      .text("Order Details", { underline: true })
      .moveDown(0.5);
    order.items.forEach((item, i) => {
      doc
        .fontSize(12)
        .fillColor("black")
        .text(`${i + 1}. ${item.name}`, { continued: true })
        .text(` | ₹${item.price} × ${item.quantity}`, { align: "right" });
    });

    // 🔹 Total Summary
    doc.moveDown(1);
    doc
      .fontSize(13)
      .text(`Total Amount: ₹${order.totalAmount}`, { align: "right" })
      .text(`Status: ${order.status}`, { align: "right" })
      .moveDown(2);

    // 🔹 Footer
    doc
      .fontSize(12)
      .fillColor("#555")
      .text("Seller: E-Shop Pvt. Ltd.", { align: "center" })
      .text("Address: 123 Market Street, Delhi, India", { align: "center" })
      .text("Email: support@eshop.com", { align: "center" });

    doc.end();
  } catch (err) {
    console.error("❌ Invoice generation error:", err);
    res.status(500).json({ message: "Failed to generate invoice" });
  }
};
