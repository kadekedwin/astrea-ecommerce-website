'use client'

import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'

interface Product {
  id: number
  name: string
  slug: string
  price: number
  originalPrice?: number
  stock: number
  category: number
  category_name: string
  rating: number
  reviews: number
  description: string
  img: string
  badge?: string
}

interface Category {
  id: number
  name: string
  slug: string
}

export default function Dashboard() {
  const [sortBy, setSortBy] = useState('name')
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ])
        const productsData = await productsRes.json()
        const categoriesData = await categoriesRes.json()

        // Add category_name to products
        const productsWithCategory = productsData.map((product: Product) => ({
          ...product,
          category_name: categoriesData.find((cat: Category) => cat.id === product.category)?.name || 'Unknown'
        }))

        setProducts(productsWithCategory)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  let displayProducts = products

  if (searchQuery) {
    displayProducts = displayProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  if (selectedCategory) {
    displayProducts = displayProducts.filter(product =>
      product.category.toString() === selectedCategory
    )
  }

  if (sortBy === 'price-low') {
    displayProducts = [...displayProducts].sort((a, b) => a.price - b.price)
  } else if (sortBy === 'price-high') {
    displayProducts = [...displayProducts].sort((a, b) => b.price - a.price)
  } else if (sortBy === 'rating') {
    displayProducts = [...displayProducts].sort((a, b) => b.rating - a.rating)
  } else if (sortBy === 'popular') {
    displayProducts = [...displayProducts].sort((a, b) => b.reviews - a.reviews)
  } else {
    displayProducts = [...displayProducts].sort((a, b) => a.name.localeCompare(b.name))
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-pulse-glow mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Memuat produk...</h3>
        <p className="text-gray-500">Mohon tunggu sebentar</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Produk Terlengkap</h1>
          <p className="text-gray-600 transition-all duration-300">
            Ditemukan <span className="font-semibold text-blue-600">{displayProducts.length}</span> produk
            {selectedCategory && (
              <span className="ml-1">
                dalam kategori <span className="font-semibold text-blue-600">{categories.find(c => c.id.toString() === selectedCategory)?.name}</span>
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-all duration-300 focus:shadow-lg hover:border-blue-400"
          >
            <option value="name">Urutkan: A-Z</option>
            <option value="price-low">Harga: Rendah ke Tinggi</option>
            <option value="price-high">Harga: Tinggi ke Rendah</option>
            <option value="rating">Rating Tertinggi</option>
            <option value="popular">Paling Populer</option>
          </select>

          <div className="flex border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-all duration-300 ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white shadow-inner transform scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm6 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zM3 12a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zm6 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-all duration-300 ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white shadow-inner transform scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 000 2h14a1 1 0 100-2H3zm0 4a1 1 0 000 2h14a1 1 0 100-2H3zm0 4a1 1 0 000 2h14a1 1 0 100-2H3z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 animate-fade-in">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative group">
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-all duration-300 focus:shadow-lg"
              />
              <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 transition-all duration-300 focus:shadow-lg hover:border-blue-400"
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
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6 animate-slide-down shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-blue-900 mb-2 text-lg">
                Kategori: {categories.find(c => c.id.toString() === selectedCategory)?.name}
              </h2>
              <p className="text-blue-700">Menampilkan semua produk dalam kategori ini</p>
            </div>
            <button
              onClick={() => setSelectedCategory('')}
              className="text-blue-600 hover:text-blue-800 transition-colors duration-300 p-2 hover:bg-blue-100 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {searchQuery && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6 animate-slide-down shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-green-900 mb-2 text-lg">
                Hasil Pencarian: &quot;{searchQuery}&quot;
              </h2>
              <p className="text-green-700">Ditemukan {displayProducts.length} produk yang cocok</p>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="text-green-600 hover:text-green-800 transition-colors duration-300 p-2 hover:bg-green-100 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {displayProducts.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <div className="text-8xl mb-6 animate-bounce-in">🔍</div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-3">Produk Tidak Ditemukan</h3>
          <p className="text-gray-500 text-lg mb-6">Coba ubah kata kunci pencarian atau filter kategori</p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('')
            }}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset Filter
          </button>
        </div>
      ) : (
        <div className={`grid gap-6 ${viewMode === 'grid'
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          : 'grid-cols-1'
        }`}>
          {displayProducts.map((item, index) => (
            <div
              key={item.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard p={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}