import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'

interface Product {
  id: number
  name: string
  slug: string
  price: number
  originalPrice?: number
  stock: number
  category: number
  rating: number
  reviews: number
  description: string
  img: string
  badge?: string
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000'}/api/products`, {
      cache: 'no-store'
    })
    if (!res.ok) return null
    const products: Product[] = await res.json()
    return products.find(p => p.slug === slug) || null
  } catch (error) {
    return null
  }
}

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000'}/api/products`, {
      cache: 'no-store'
    })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    return []
  }
}

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)
  const products = await getProducts()

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} products={products} />
}