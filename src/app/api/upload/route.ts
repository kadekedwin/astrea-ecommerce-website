import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    console.log('Upload request received')
    const data = await request.formData()
    console.log('FormData keys:', Array.from(data.keys()))
    
    const file: File | null = data.get('image') as File | null

    if (!file || !(file instanceof File)) {
      console.error('No valid file received in form data')
      return NextResponse.json({ error: 'No file received' }, { status: 400 })
    }

    console.log('File received:', file.name, 'Type:', file.type, 'Size:', file.size)

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      console.error('Invalid file type:', file.type)
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      console.error('File too large:', file.size, 'bytes')
      return NextResponse.json({ error: 'File size too large. Maximum size is 5MB.' }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.type === 'image/jpeg' ? '.jpg' :
                     file.type === 'image/png' ? '.png' :
                     file.type === 'image/webp' ? '.webp' : '.jpg'
    const filename = `${timestamp}-${randomString}${extension}`

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      console.error('Error creating uploads directory:', error)
      return NextResponse.json({ error: 'Failed to create uploads directory' }, { status: 500 })
    }

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filepath = path.join(uploadsDir, filename)
    console.log('Saving file to:', filepath)
    await writeFile(filepath, buffer)

    // Return the public URL
    const url = `/uploads/${filename}`
    console.log('File uploaded successfully:', url)

    return NextResponse.json({ url, filename })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}