import dotenv from "dotenv";
dotenv.config();

console.log(
  "✅ Loaded ENV:",
  process.env.EMAIL_USER,
  process.env.EMAIL_PASS ? "PASS ✔" : "NO PASS ❌"
);

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
connectDB();

import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderROutes.js";
import authRoutes from "./routes/authRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import tempFixRoutes from "./routes/tempFixRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // change to frontend URL for security later
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

// 🧠 Map to track sellers and their connected sockets
const sellerSockets = new Map();

// ✅ Handle socket connections
io.on("connection", (socket) => {
  console.log("📡 New socket connected:", socket.id);

  // Seller registers their ID right after login
  socket.on("registerSeller", (sellerId) => {
    sellerSockets.set(sellerId, socket.id);
    console.log(`✅ Seller ${sellerId} registered socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    for (const [sellerId, socketId] of sellerSockets.entries()) {
      if (socketId === socket.id) {
        sellerSockets.delete(sellerId);
        console.log(`❌ Seller ${sellerId} disconnected`);
        break;
      }
    }
  });
});

// ✅ Make io and sellerSockets accessible to routes/controllers
app.set("io", io);
app.set("sellerSockets", sellerSockets);

// ✅ API routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/tempfix", tempFixRoutes);

// ✅ Start the combined HTTP + WebSocket server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running with real-time updates on port ${PORT}`)
);
