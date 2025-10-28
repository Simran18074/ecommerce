import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import toast from "react-hot-toast";

export default function Home({ searchQuery }) {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const { addToCart } = useContext(CartContext);

  // ✅ Fetch products
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        setProducts(res.data);
        setFiltered(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  // 🔍 Search Filter
  useEffect(() => {
    if (searchQuery) {
      const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFiltered(filteredProducts);
    } else {
      setFiltered(products);
    }
  }, [searchQuery, products]);

  // 🏷️ Category Filter
  const handleCategory = (cat) => {
    setCategory(cat);
    if (cat === "All") setFiltered(products);
    else setFiltered(products.filter((p) => p.category === cat));
  };

  // 💫 Skeleton while loading
  if (loading)
    return (
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-4 shadow animate-pulse space-y-3"
          >
            <div className="w-full aspect-square bg-gray-300 rounded-xl"></div>
            <div className="h-4 bg-gray-300 w-3/4 rounded"></div>
            <div className="h-3 bg-gray-200 w-1/2 rounded"></div>
            <div className="h-5 bg-gray-300 w-1/3 rounded"></div>
          </div>
        ))}
      </div>
    );

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart 🛒`, { duration: 1500 });
  };

  return (
    <div className="p-6">
      {/* 🏷️ Category Filter */}
      <div className="flex flex-wrap justify-center mb-6 gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            className={`px-4 py-2 rounded-full ${
              category === cat
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-800"
            } hover:bg-indigo-500 hover:text-white transition`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 🛍️ Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <p className="text-center col-span-full text-gray-600">
            No products found 😢
          </p>
        ) : (
          filtered.map((p) => (
            <div
              key={p._id}
              className="bg-white text-black rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transform transition p-4"
            >
              {/* ✅ Square Image */}
              <div className="w-full aspect-square overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center">
                <img
                  src={p.image}
                  alt={p.name}
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                />
              </div>

              <h3 className="text-lg font-semibold mt-3">{p.name}</h3>
              <p className="text-gray-500 text-sm line-clamp-2">
                {p.description}
              </p>
              <p className="text-xl font-bold mt-2 text-indigo-700">
                ₹{p.price}
              </p>
              <button
                onClick={() => handleAddToCart(p)}
                className="bg-indigo-600 text-white px-4 py-2 mt-3 rounded-xl w-full hover:bg-indigo-700 transition"
              >
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
