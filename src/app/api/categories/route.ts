import { NextRequest, NextResponse } from 'next/server'
import { query, execute } from '@/lib/db'

export async function GET() {
  try {
    const categories = await query('SELECT * FROM categories')
    return NextResponse.json(categories)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, slug } = await request.json()
    const result = await execute('INSERT INTO categories (name, slug) VALUES (?, ?)', [name, slug]) as {insertId: number}
    return NextResponse.json({ id: result.insertId, name, slug })
  } catch {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}