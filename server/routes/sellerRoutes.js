import express from "express";
import {
  getAllOrders,
  updateOrderStatus,
  generateInvoice,
  getSellerStats,
} from "../controllers/sellerController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// ✅ Seller-only routes
router.get("/stats", auth("seller"), getSellerStats);
router.get("/orders", auth("seller"), getAllOrders);
router.patch("/orders/:id/status", auth("seller"), updateOrderStatus);
router.get("/orders/:id/invoice", auth("seller"), generateInvoice);

export default router;
