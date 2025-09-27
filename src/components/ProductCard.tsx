'use client'

import Link from "next/link";
import { useCart } from "../app/context/CartContext";
import { useState } from "react";
import Toast from "../app/components/Toast";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  stock: number;
  category: number;
  category_name: string;
  rating: number;
  reviews: number;
  description: string;
  img: string;
  badge?: string;
}

interface ProductCardProps {
  p: Product;
}

export default function ProductCard({ p }: ProductCardProps) {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    addToCart(p);
    setShowToast(true);
    setTimeout(() => setIsAdding(false), 500);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="text-yellow-400">☆</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }
    return stars;
  };

  return (
    <div className="relative">
      <Toast
        message={`${p.name} ditambahkan ke keranjang!`}
        show={showToast}
        onHide={() => setShowToast(false)}
      />

      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
        <div className="relative">
          <img
            src={p.img}
            alt={p.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {p.badge && (
            <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              {p.badge}
            </span>
          )}
        </div>

        <div className="p-4">
          <div className="mb-2">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {p.category_name}
            </span>
          </div>

          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {p.name}
          </h3>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{p.description}</p>

          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {renderStars(p.rating)}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {p.rating} ({p.reviews} reviews)
            </span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-lg font-bold text-gray-900">
                {formatPrice(p.price)}
              </div>
              {p.originalPrice && p.originalPrice > p.price && (
                <div className="text-sm text-gray-500 line-through">
                  {formatPrice(p.originalPrice)}
                </div>
              )}
            </div>
            <div className="text-sm text-gray-600">
              Stock: {p.stock}
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/product/${p.slug}`}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
            >
              Detail
            </Link>
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`px-4 py-2 border rounded-lg transition-colors ${
                isInCart(p.id)
                  ? 'border-green-600 text-green-600 bg-green-50'
                  : 'border-blue-600 text-blue-600 hover:bg-blue-50'
              } ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isAdding ? (
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : isInCart(p.id) ? (
                <div className="flex items-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-1 text-sm">{getItemQuantity(p.id)}</span>
                </div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 0L2 1H1m6 16a1 1 0 11-2 0 1 1 0 012 0zm10 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}