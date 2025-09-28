import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('image') as File | null

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file received' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' }, { status: 400 })
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size too large. Maximum size is 5MB.' }, { status: 400 })
    }

    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15).replace(/[^a-zA-Z0-9]/g, '')
    const extension = file.type === 'image/jpeg' ? '.jpg' :
                     file.type === 'image/png' ? '.png' :
                     file.type === 'image/webp' ? '.webp' : '.jpg'
    const filename = `${timestamp}-${randomString}${extension}`

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filepath = path.join(uploadsDir, filename)
    await writeFile(filepath, buffer)

    const url = `/api/uploads/${filename}`

    return NextResponse.json({ url, filename })
  } catch {
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}