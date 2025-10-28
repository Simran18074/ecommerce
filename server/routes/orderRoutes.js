import express from "express";
import {
  getMyOrders,
  createOrder,
  cancelOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// User routes
router.get("/my-orders", auth(), getMyOrders);
router.post("/", auth(), createOrder);
router.patch("/:id/cancel", auth(), cancelOrder);
router.patch("/:id/status", auth("seller"), updateOrderStatus);

export default router;
