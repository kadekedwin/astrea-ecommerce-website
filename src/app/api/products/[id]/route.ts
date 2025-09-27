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
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { name, slug, price, originalPrice, stock, category, rating, reviews, description, img, badge } = await request.json()
    await execute('UPDATE products SET name = ?, slug = ?, price = ?, originalPrice = ?, stock = ?, category = ?, rating = ?, reviews = ?, description = ?, img = ?, badge = ? WHERE id = ?', [name, slug, price, originalPrice, stock, category, rating, reviews, description, img, badge, id])
    return NextResponse.json({ id, name, slug, price, originalPrice, stock, category, rating, reviews, description, img, badge })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await execute('DELETE FROM products WHERE id = ?', [id])
    return NextResponse.json({ message: 'Product deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}