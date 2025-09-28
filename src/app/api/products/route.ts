import { NextRequest, NextResponse } from 'next/server'
import { query, execute } from '@/lib/db'

export async function GET() {
  try {
    const products = await query('SELECT * FROM products')
    return NextResponse.json(products)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const name = data.name
    const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-')
    const price = parseFloat(data.price) || 0
    const originalPrice = data.originalPrice ? parseFloat(data.originalPrice) : null
    const stock = parseInt(data.stock) || 0
    const category = data.category ? parseInt(data.category) : null
    const rating = data.rating ? parseFloat(data.rating) : null
    const reviews = data.reviews ? parseInt(data.reviews) : null
    const description = data.description || null
    const img = data.img || null
    const badge = data.badge || null

    const result = await execute('INSERT INTO products (name, slug, price, originalPrice, stock, category, rating, reviews, description, img, badge) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, slug, price, originalPrice, stock, category, rating, reviews, description, img, badge]) as {insertId: number}
    return NextResponse.json({ id: result.insertId, name, slug, price, originalPrice, stock, category, rating, reviews, description, img, badge })
  } catch {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}