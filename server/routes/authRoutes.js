import express from "express";
import {
  registerBuyer,
  loginBuyer,
  registerSeller,
  loginSeller,
} from "../controllers/authController.js";

const router = express.Router();

// 👤 Buyer Auth
router.post("/buyer/register", registerBuyer);
router.post("/buyer/login", loginBuyer);

// 🧑‍💼 Seller Auth
router.post("/seller/register", registerSeller);
router.post("/seller/login", loginSeller);

export default router;
