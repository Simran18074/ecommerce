// routes/tempFixRoutes.js
import express from "express";
import Product from "../models/Product.js";
import mongoose from "mongoose";

const router = express.Router();

router.patch("/fix-products/:sellerId", async (req, res) => {
  try {
    const { sellerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({ message: "Invalid sellerId" });
    }

    const result = await Product.updateMany(
      { seller: { $exists: false } }, // only those without seller
      { $set: { seller: sellerId } }
    );

    res.json({
      message: "✅ Seller IDs added",
      updatedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("❌ Fix products error:", err);
    res.status(500).json({ message: "Failed to update products" });
  }
});

export default router;
