import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import User from "./models/User.js";
import connectDB from "./config/db.js";

dotenv.config();
await connectDB();

const seedProducts = async () => {
  try {
    // 🧩 Step 1: Find or create a default seller
    let seller = await User.findOne({ role: "seller" });

    if (!seller) {
      seller = await User.create({
        name: "Default Seller",
        email: "seller@example.com",
        password: "123456", // 🔐 will be hashed automatically
        role: "seller",
      });
      console.log("✅ Default seller created:", seller._id);
    } else {
      console.log("👤 Existing seller found:", seller._id);
    }

    // 🧩 Step 2: Define multiple product entries
    const products = [
      // 🩳 Clothing
      {
        name: "Denim Jacket",
        description: "Stylish blue denim jacket for all seasons",
        price: 2499,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUyZ9yNlwoQFVSk3FgsxnKPrWUk6b1DOC6LA&s",
        category: "Clothing",
        seller: seller._id,
      },
      {
        name: "Cotton T-Shirt",
        description: "Soft breathable cotton t-shirt with modern fit",
        price: 799,
        image:
          "https://m.media-amazon.com/images/I/81qpsL7-EKL._AC_UY1100_.jpg",
        category: "Clothing",
        seller: seller._id,
      },
      {
        name: "Men’s Jeans",
        description: "Classic slim-fit stretchable denim jeans",
        price: 1599,
        image: "https://redtape.com/cdn/shop/files/RDM1084A_1.jpg?v=1754286431",
        category: "Clothing",
        seller: seller._id,
      },

      // 👟 Footwear
      {
        name: "Nike Shoes",
        description: "Comfortable running shoes with breathable mesh",
        price: 3500,
        image:
          "https://assetscdn1.paytm.com/images/catalog/product/F/FO/FOONIKE-RUNALLDSMAR262972E61C911/0..jpg",
        category: "Footwear",
        seller: seller._id,
      },
      {
        name: "Adidas Slides",
        description: "Durable and lightweight slides for casual wear",
        price: 1299,
        image:
          "https://assets.adidas.com/images/w_600,f_auto,q_auto/0bc1ed752f4a4dd182525ba32704da94_9366/Adilette_22_Slides_Green_JH7794_01_00_standard.jpg",
        category: "Footwear",
        seller: seller._id,
      },
      {
        name: "Woodland Boots",
        description: "Rugged outdoor boots with superior grip",
        price: 4599,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTao5bXpI8w3xgs3jYMnonDdiblTUDQjlhWew&s",
        category: "Footwear",
        seller: seller._id,
      },

      // 💻 Electronics
      {
        name: "Smart Watch",
        description: "Track your fitness and health in style",
        price: 4999,
        image: "https://m.media-amazon.com/images/I/61h8lcXTyeL.jpg",
        category: "Electronics",
        seller: seller._id,
      },
      {
        name: "Bluetooth Headphones",
        description: "Noise-cancelling over-ear headphones with deep bass",
        price: 2999,
        image: "https://m.media-amazon.com/images/I/61CGHv6kmWL._AC_UL320_.jpg",
        category: "Electronics",
        seller: seller._id,
      },
      {
        name: "Gaming Mouse",
        description: "RGB wired gaming mouse with programmable buttons",
        price: 1499,
        image:
          "https://www.power-x.in/cdn/shop/files/Front.jpg?v=1737709078&width=3000",
        category: "Electronics",
        seller: seller._id,
      },
      {
        name: "Mechanical Keyboard",
        description: "Backlit mechanical keyboard with blue switches",
        price: 3499,
        image:
          "https://images-cdn.ubuy.co.in/63400c68afe02d2b0c7aeb85-mechanical-gaming-keyboard-87-keys-small.jpg",
        category: "Electronics",
        seller: seller._id,
      },
      {
        name: "Power Bank 20000mAh",
        description: "Fast-charging power bank with dual USB ports",
        price: 1899,
        image: "https://media.tatacroma.com/275992_0_pmprjy.png",
        category: "Electronics",
        seller: seller._id,
      },
      {
        name: "Wireless Earbuds",
        description: "Compact TWS earbuds with noise cancellation",
        price: 2599,
        image:
          "https://www.boat-lifestyle.com/cdn/shop/files/ACCG6DS7WDJHGWSH_0.png?v=1727669669",
        category: "Electronics",
        seller: seller._id,
      },

      // 👜 Accessories
      {
        name: "Laptop Bag",
        description: "Durable waterproof laptop backpack 15.6-inch",
        price: 1200,
        image:
          "https://m.media-amazon.com/images/I/31G4L00mBjL._SR290,290_.jpg",
        category: "Accessories",
        seller: seller._id,
      },
      {
        name: "Leather Wallet",
        description: "Premium leather wallet with RFID protection",
        price: 899,
        image:
          "https://imagescdn.vanheusenindia.com/img/app/product/3/39726061-15077966.jpg?auto=format&w=390",
        category: "Accessories",
        seller: seller._id,
      },
      {
        name: "Sunglasses",
        description: "UV-protected stylish sunglasses for men & women",
        price: 1099,
        image:
          "https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/656x464/9df78eab33525d08d6e5fb8d27136e95//v/i/Gold-Black-Full-Rim-Geometric-Vincent-Chase-LIVEWIRE-VC-S14506-C2-Polarized-Sunglasses_G_7270.jpg",
        category: "Accessories",
        seller: seller._id,
      },

      // 🏠 Home & Kitchen
      {
        name: "Electric Kettle",
        description: "Stainless steel automatic shut-off kettle",
        price: 1599,
        image: "https://m.media-amazon.com/images/I/71KS-plFc1L.jpg",
        category: "Home & Kitchen",
        seller: seller._id,
      },
      {
        name: "Non-stick Frying Pan",
        description: "Durable non-stick coating pan for healthy cooking",
        price: 999,
        image: "https://m.media-amazon.com/images/I/61rBaKkgtBL.jpg",
        category: "Home & Kitchen",
        seller: seller._id,
      },
      {
        name: "Vacuum Cleaner",
        description: "Powerful handheld vacuum cleaner for car & home",
        price: 2499,
        image:
          "https://m.media-amazon.com/images/I/81P2NgteuQL._AC_UF350,350_QL80_.jpg",
        category: "Home & Kitchen",
        seller: seller._id,
      },
      {
        name: "Table Lamp",
        description: "LED study lamp with adjustable brightness",
        price: 799,
        image:
          "https://m.media-amazon.com/images/I/71D2YNJoNNL._AC_UF1000,1000_QL80_.jpg",
        category: "Home & Kitchen",
        seller: seller._id,
      },
      {
        name: "Coffee Mug Set",
        description: "Set of 2 ceramic coffee mugs for daily use",
        price: 499,
        image:
          "https://kaunteya.in/cdn/shop/products/20210925_123126-e1632908817170.jpg?v=1687169726",
        category: "Home & Kitchen",
        seller: seller._id,
      },
    ];

    // 🧩 Step 3: Replace old data and insert new
    await Product.deleteMany();
    await Product.insertMany(products);

    console.log(`✅ Seeded ${products.length} products successfully!`);
    process.exit();
  } catch (error) {
    console.error("❌ Error while seeding:", error);
    process.exit(1);
  }
};

seedProducts();
