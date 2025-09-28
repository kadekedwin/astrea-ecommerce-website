import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    console.log('Image request received')
    const { filename } = await params
    console.log('Requested filename:', filename)

    // Validate filename to prevent directory traversal
    if (!filename || filename.includes('..')) {
      console.log('Invalid filename:', filename)
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
    }

    const filepath = path.join(process.cwd(), 'public', 'uploads', filename)
    console.log('Serving image - CWD:', process.cwd(), 'Filepath:', filepath)

    // Check if file exists
    if (!existsSync(filepath)) {
      console.log('File not found at:', filepath)
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    console.log('File exists, reading...')

    // Read the file
    const fileBuffer = await readFile(filepath)
    const uint8Array = new Uint8Array(fileBuffer)
    
    console.log('File read successfully, size:', uint8Array.length)

    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase()
    const contentType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
                       ext === '.png' ? 'image/png' :
                       ext === '.webp' ? 'image/webp' : 'application/octet-stream'
    
    console.log('Serving file with content-type:', contentType)

    // Return the file with appropriate headers
    console.log('Returning file response')
    return new NextResponse(uint8Array, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    })
  } catch (error) {
    console.error('Error serving file:', error)
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 })
  }
}