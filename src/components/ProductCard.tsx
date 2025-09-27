import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '../app/context/CartContext'
import { Toast } from '../app/components/Toast'

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

interface ProductCardProps {
  p: Product
}

export default function ProductCard({ p }: ProductCardProps) {
  const { addToCart, isInCart, getItemQuantity } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsAdding(true)
    addToCart(p)
    setShowToast(true)
    setTimeout(() => setIsAdding(false), 500)
  }

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLiked(!isLiked)
    // Here you could add logic to save to wishlist/localStorage or API
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span
            key={i}
            className="text-yellow-400"
          >
            ★
          </span>
        )
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span
            key={i}
            className="text-yellow-400 relative"
          >
            <span className="absolute inset-0 text-gray-300">★</span>
            <span className="relative" style={{ clipPath: 'inset(0 50% 0 0)' }}>★</span>
          </span>
        )
      } else {
        stars.push(
          <span
            key={i}
            className="text-gray-300"
          >
            ★
          </span>
        )
      }
    }
    return stars
  }

  return (
    <div className="relative group">
      <Toast
        message={`${p.name} ditambahkan ke keranjang!`}
        show={showToast}
        onHide={() => setShowToast(false)}
      />

      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-3 hover:scale-[1.02] border border-gray-100 hover:border-gray-300 relative">
        <div className="relative overflow-hidden bg-gray-50 rounded-2xl">
          <div className="aspect-square overflow-hidden">
            {p.img && p.img.trim() !== '' ? (
              <img
                src={p.img}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Enhanced badge with better animation */}
          {p.badge && (
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                {p.badge}
              </span>
            </div>
          )}

          {/* Stock indicator */}
          <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
            <button
              onClick={handleLikeToggle}
              className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                isLiked
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 shadow-lg'
              }`}
            >
              <svg className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <div className={`px-2 py-1 rounded-full text-xs font-medium min-w-[2rem] text-center ${
              p.stock > 10
                ? 'bg-green-100 text-green-800 border border-green-200'
                : p.stock > 0
                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {p.stock > 0 ? p.stock : '0'}
            </div>
          </div>

          {/* Quick action overlay - removed to fix layout issues */}
          {/* <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <Link
              href={`/product/${p.slug}`}
              className="bg-white/90 text-gray-700 p-2 rounded-full hover:bg-white transition-all duration-300 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </Link>
          </div> */}
        </div>

        <div className="p-5">
          {/* Category badge */}
          <div className="mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              {p.category_name}
            </span>
          </div>

          {/* Product title */}
          <h3 className="font-bold text-gray-900 mb-2 text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
            {p.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{p.description}</p>

          {/* Rating */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {renderStars(p.rating)}
              </div>
              <span className="text-sm text-gray-600 font-medium ml-1">
                {p.rating}
              </span>
              <span className="text-xs text-gray-500">
                ({p.reviews})
              </span>
            </div>
          </div>

          {/* Price section */}
          <div className="mb-4">
            <div className="flex flex-col space-y-1">
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(p.price)}
              </span>
              {p.originalPrice && p.originalPrice > p.price && (
                <div className="flex items-center space-x-2">
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(p.originalPrice)}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap max-w-[3rem] overflow-hidden">
                    -{Math.min(Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100), 99)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Link
              href={`/product/${p.slug}`}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium text-center block transform hover:scale-[1.02] hover:shadow-md"
            >
              Lihat Detail
            </Link>

            <button
              onClick={handleAddToCart}
              disabled={isAdding || p.stock === 0}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-center transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                isInCart(p.id)
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : p.stock === 0
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isAdding ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  <span>Menambah...</span>
                </span>
              ) : isInCart(p.id) ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>{getItemQuantity(p.id)} di Keranjang</span>
                </span>
              ) : p.stock === 0 ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span>Stok Habis</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13l-1.1 5M7 13l4-8m4 8v8a2 2 0 002 2h2a2 2 0 002-2v-3"></path>
                  </svg>
                  <span>Tambah ke Keranjang</span>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}