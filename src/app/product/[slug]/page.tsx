'use client'

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

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

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function ProductDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, isInCart, getItemQuantity } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products`);
        if (response.ok) {
          const products = await response.json();
          const foundProduct = products.find((p: Product) => p.slug === slug);

          if (foundProduct) {
            // Fetch categories to get category name
            const categoriesRes = await fetch('/api/categories');
            if (categoriesRes.ok) {
              const categories: Category[] = await categoriesRes.json();
              const productWithCategory = {
                ...foundProduct,
                category_name: categories.find((cat: Category) => cat.id === foundProduct.category)?.name || 'Unknown'
              };
              setProduct(productWithCategory);

              // Get related products
              const related = products
                .filter((p: Product) => p.category === foundProduct.category && p.id !== foundProduct.id)
                .slice(0, 4)
                .map((p: Product) => ({
                  ...p,
                  category_name: categories.find((cat: Category) => cat.id === p.category)?.name || 'Unknown'
                }));
              setRelatedProducts(related);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Produk Tidak Ditemukan</h1>
        <Link href="/" className="text-blue-600 hover:underline">Kembali ke Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <nav className="mb-6 text-sm">
        <Link href="/" className="text-blue-600 hover:underline">Home</Link>
        <span className="mx-2 text-gray-500">/</span>
        <span className="text-gray-500">{product.category_name}</span>
        <span className="mx-2 text-gray-500">/</span>
        <span className="text-gray-800">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
            <img
              src={product.img}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[1,2,3,4].map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                  selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                }`}
              >
                <img
                  src={product.img}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {product.badge && (
            <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {product.badge}
            </span>
          )}

          <div>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {product.category_name}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {renderStars(product.rating)}
            </div>
            <span className="text-gray-600">{product.rating}</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">{product.reviews} ulasan</span>
          </div>

          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="flex items-center space-x-2">
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Deskripsi Produk</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <div className="flex items-center space-x-4">
              <span className="font-medium text-gray-800">Stok:</span>
              <span className={`font-semibold ${product.stock > 5 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock} tersisa
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-800">Jumlah:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) {
                      addToCart(product);
                    }
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {isInCart(product.id) ?
                    `Tambah Lagi (${getItemQuantity(product.id)} di keranjang)` :
                    'Tambah ke Keranjang'
                  }
                </button>
                <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              <Link
                href="/cart"
                className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors font-medium text-center block"
              >
                Beli Sekarang
              </Link>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Produk Serupa</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <Link key={item.id} href={`/product/${item.slug}`} className="block">
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">{item.name}</h3>
                  <div className="flex items-center mb-2">
                    {renderStars(item.rating)}
                    <span className="text-sm text-gray-600 ml-2">{item.rating}</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatPrice(item.price)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}