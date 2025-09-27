import { NextRequest, NextResponse } from 'next/server'
import { query, execute } from '@/lib/db'

export async function GET() {
  try {
    const products = await query('SELECT * FROM products')
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, slug, price, originalPrice, stock, category, rating, reviews, description, img, badge } = data
    const result = await execute('INSERT INTO products (name, slug, price, originalPrice, stock, category, rating, reviews, description, img, badge) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, slug, price, originalPrice, stock, category, rating, reviews, description, img, badge]) as {insertId: number}
    return NextResponse.json({ id: result.insertId, ...data })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}