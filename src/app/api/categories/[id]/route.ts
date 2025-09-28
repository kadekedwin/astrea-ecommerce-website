import { NextRequest, NextResponse } from 'next/server'
import { execute } from '@/lib/db'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { name, slug } = await request.json()
    await execute('UPDATE categories SET name = ?, slug = ? WHERE id = ?', [name, slug, id])
    return NextResponse.json({ id, name, slug })
  } catch {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await execute('DELETE FROM categories WHERE id = ?', [id])
    return NextResponse.json({ message: 'Category deleted' })
  } catch {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}