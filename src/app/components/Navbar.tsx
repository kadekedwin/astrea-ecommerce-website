'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItems } = useCart();

  const isActive = (path: string) => pathname === path;
  const cartItemCount = getTotalItems();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="Astrea Logo"
              className="w-10 h-10 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const nextSibling = target.nextSibling as HTMLElement;
                if (nextSibling) nextSibling.style.display = 'flex';
              }}
            />
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="font-bold text-xl text-gray-800">Astrea</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md font-medium transition-colors ${
                isActive('/') || isActive('/dashboard') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/cart"
              className={`px-3 py-2 rounded-md font-medium transition-colors relative ${
                isActive('/cart') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Keranjang
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <Link
              href="/checkout"
              className={`px-3 py-2 rounded-md font-medium transition-colors ${
                isActive('/checkout') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Checkout
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md font-medium ${
                  isActive('/') || isActive('/dashboard') ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/cart"
                className={`px-3 py-2 rounded-md font-medium relative ${
                  isActive('/cart') ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Keranjang
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <Link
                href="/checkout"
                className={`px-3 py-2 rounded-md font-medium ${
                  isActive('/checkout') ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}