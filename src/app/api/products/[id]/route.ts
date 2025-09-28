import { NextRequest, NextResponse } from 'next/server'
import { query, execute } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const products = await query('SELECT * FROM products WHERE id = ?', [id]) as unknown[]
    if (products.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json(products[0])
  } catch {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
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
    
    await execute('UPDATE products SET name = ?, slug = ?, price = ?, originalPrice = ?, stock = ?, category = ?, rating = ?, reviews = ?, description = ?, img = ?, badge = ? WHERE id = ?', [name, slug, price, originalPrice, stock, category, rating, reviews, description, img, badge, parseInt(id)])
    return NextResponse.json({ id: parseInt(id), name, slug, price, originalPrice, stock, category, rating, reviews, description, img, badge })
  } catch {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await execute('DELETE FROM products WHERE id = ?', [id])
    return NextResponse.json({ message: 'Product deleted' })
  } catch {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}