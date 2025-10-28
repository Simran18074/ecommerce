import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { sendOrderConfirmation } from "../utils/sendEmail.js";

// ============================================================
// 🧾 Get logged-in user's orders
// ============================================================
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate("items.product", "name price image")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching user orders:", err);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};

// ============================================================
// 🛒 Create a new order
// ============================================================
export const createOrder = async (req, res) => {
  try {
    console.log(
      "📥 Incoming order request →",
      JSON.stringify(req.body, null, 2)
    );

    const { items, totalAmount, customer } = req.body;

    // ✅ Auth check
    if (!req.userId) {
      console.log("❌ req.userId missing (auth issue)");
      return res.status(401).json({ message: "Unauthorized user" });
    }

    // ✅ Basic validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log("❌ No items in order body");
      return res.status(400).json({ message: "No items in the order." });
    }

    // ✅ Find product to get seller
    const firstProduct = await Product.findById(items[0].product);
    if (!firstProduct) {
      console.log("❌ Product not found:", items[0].product);
      return res.status(404).json({ message: "Product not found." });
    }

    const sellerId = firstProduct.seller;
    console.log("🧾 Seller ID:", sellerId);

    // ✅ Create order
    const order = await Order.create({
      user: req.userId,
      seller: sellerId,
      items,
      totalAmount,
      customer,
      status: "Pending",
    });

    console.log("✅ Order created successfully:", order._id);

    // ✅ Socket communication
    const io = req.app.get("io");
    const sellerSockets = req.app.get("sellerSockets");

    if (io && sellerSockets) {
      const sellerSocketId = sellerSockets.get(String(sellerId));
      if (sellerSocketId) {
        io.to(sellerSocketId).emit("orderCreated", order);
        console.log(
          `📡 Order sent to seller ${sellerId} (socket: ${sellerSocketId})`
        );
      } else {
        console.log(`⚠️ Seller ${sellerId} is not currently connected.`);
      }
    }

    // ✅ Send confirmation email
    const buyer = await User.findById(req.userId);
    if (buyer?.email) {
      try {
        await sendOrderConfirmation(buyer.email, {
          userName: buyer.name || "Customer",
          items,
          totalAmount,
          status: order.status,
        });
        console.log(`📩 Email sent to ${buyer.email}`);
      } catch (mailErr) {
        console.warn("⚠️ Email send failed:", mailErr.message);
      }
    }

    res.status(201).json(order);
  } catch (err) {
    console.error("💥 Order creation error:", err);
    res.status(500).json({ message: err.message || "Order creation failed." });
  }
};

// ============================================================
// 🚚 Update Order Status
// ============================================================
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found." });

    const io = req.app.get("io");
    const sellerSockets = req.app.get("sellerSockets");

    if (io && sellerSockets) {
      const sellerSocketId = sellerSockets.get(String(order.seller));
      if (sellerSocketId) io.to(sellerSocketId).emit("orderUpdated", order);
    }

    res.json(order);
  } catch (err) {
    console.error("❌ Failed to update order status:", err);
    res.status(500).json({ message: "Could not update order status." });
  }
};

// ============================================================
// ❌ Cancel Order (Buyer Only)
// ============================================================
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!order) return res.status(404).json({ message: "Order not found." });
    if (order.status !== "Pending")
      return res
        .status(400)
        .json({ message: "Cannot cancel order once shipped or delivered." });

    order.status = "Cancelled";
    await order.save();

    const io = req.app.get("io");
    const sellerSockets = req.app.get("sellerSockets");
    if (io && sellerSockets) {
      const sellerSocketId = sellerSockets.get(String(order.seller));
      if (sellerSocketId) io.to(sellerSocketId).emit("orderCancelled", order);
    }

    res.json(order);
  } catch (err) {
    console.error("❌ Cancel order error:", err);
    res.status(500).json({ message: "Failed to cancel order." });
  }
};
