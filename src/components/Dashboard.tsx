'use client'

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  stock: number;
  category: number;
  rating: number;
  reviews: number;
  description: string;
  img: string;
  badge?: string;
  category_name: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function Dashboard() {
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ]);

        if (productsRes.ok && categoriesRes.ok) {
          const productsData = await productsRes.json();
          const categoriesData = await categoriesRes.json();

          const productsWithCategories = productsData.map((product: Product) => ({
            ...product,
            category_name: categoriesData.find((cat: Category) => cat.id === product.category)?.name || 'Unknown'
          }));

          setProducts(productsWithCategories);
          setCategories(categoriesData);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  let displayProducts = products;

  if (searchQuery) {
    displayProducts = displayProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (selectedCategory) {
    displayProducts = displayProducts.filter(product =>
      product.category.toString() === selectedCategory
    );
  }

  if (sortBy === "price-low") {
    displayProducts = [...displayProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    displayProducts = [...displayProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    displayProducts = [...displayProducts].sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "popular") {
    displayProducts = [...displayProducts].sort((a, b) => b.reviews - a.reviews);
  } else {
    displayProducts = [...displayProducts].sort((a, b) => a.name.localeCompare(b.name));
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="sync-loading"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produk Terlengkap</h1>
          <p className="text-gray-600 mt-1">
            Ditemukan {displayProducts.length} produk
            {selectedCategory && ` dalam kategori ${categories.find(c => c.id.toString() === selectedCategory)?.name}`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="name">Urutkan: A-Z</option>
            <option value="price-low">Harga: Rendah ke Tinggi</option>
            <option value="price-high">Harga: Tinggi ke Rendah</option>
            <option value="rating">Rating Tertinggi</option>
            <option value="popular">Paling Populer</option>
          </select>

          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-600"}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm6 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zM3 12a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zm6 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-600"}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 000 2h14a1 1 0 100-2H3zm0 4a1 1 0 000 2h14a1 1 0 100-2H3zm0 4a1 1 0 000 2h14a1 1 0 100-2H3z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">Semua Kategori</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedCategory && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h2 className="font-semibold text-blue-900 mb-2">
            Kategori: {categories.find(c => c.id.toString() === selectedCategory)?.name}
          </h2>
          <p className="text-blue-700">Menampilkan semua produk dalam kategori ini</p>
        </div>
      )}

      {searchQuery && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <h2 className="font-semibold text-green-900 mb-2">
            Hasil Pencarian: &quot;{searchQuery}&quot;
          </h2>
          <p className="text-green-700">Ditemukan {displayProducts.length} produk yang cocok</p>
        </div>
      )}

      {displayProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl text-gray-300 mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Produk Tidak Ditemukan</h3>
          <p className="text-gray-500">Coba ubah kata kunci pencarian atau filter kategori</p>
        </div>
      ) : (
        <div className={`grid gap-6 ${viewMode === "grid"
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "grid-cols-1"
        }`}>
          {displayProducts.map((item) => (
            <ProductCard key={item.id} p={item} />
          ))}
        </div>
      )}
    </div>
  );
}