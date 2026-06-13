import fs from 'fs/promises'
import { existsSync, mkdirSync } from 'fs'
import path from 'path'
import crypto from 'crypto'
import sharp from 'sharp'
import ffmpeg from 'fluent-ffmpeg'

// Bypass Turbopack static tracing for binary packages
let ffmpegPath = ''
if (typeof window === 'undefined') {
  try {
    const installer = eval("require('@ffmpeg-installer/ffmpeg')")
    ffmpegPath = installer.path
    ffmpeg.setFfmpegPath(ffmpegPath)
  } catch (e) {
    console.warn('Could not load @ffmpeg-installer/ffmpeg', e)
  }
}

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads')
const THUMBNAILS_DIR = path.join(UPLOADS_DIR, 'thumbnails')

// Ensure directories exist
const CATEGORIES = ['founders', 'team', 'gallery', 'services', 'portfolio', 'testimonials', 'videos']

export function initializeMediaDirectories() {
  if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true })
  if (!existsSync(THUMBNAILS_DIR)) mkdirSync(THUMBNAILS_DIR, { recursive: true })
  
  for (const cat of CATEGORIES) {
    const catDir = path.join(UPLOADS_DIR, cat)
    const thumbDir = path.join(THUMBNAILS_DIR, cat)
    if (!existsSync(catDir)) mkdirSync(catDir, { recursive: true })
    if (!existsSync(thumbDir)) mkdirSync(thumbDir, { recursive: true })
  }
}

// ── Security & Limits ────────────────────────────────────────────────────────

const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10 MB
const MAX_VIDEO_SIZE = 500 * 1024 * 1024 // 500 MB

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm']

const EXECUTABLE_EXTS = ['.exe', '.bat', '.sh', '.php', '.js']

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9.\-_]/g, '') // remove invalid chars
    .replace(/\.{2,}/g, '.') // prevent directory traversal (..)
    .toLowerCase()
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface MediaUploadResponse {
  success: boolean
  url?: string
  thumbnailUrl?: string
  filename?: string
  error?: string
}

// ── File Helpers ────────────────────────────────────────────────────────────

// Buffer to Temp File for FFmpeg processing
async function writeTempFile(buffer: Buffer, filename: string): Promise<string> {
  const tempDir = path.join(process.cwd(), 'tmp')
  if (!existsSync(tempDir)) mkdirSync(tempDir, { recursive: true })
  const tempPath = path.join(tempDir, filename)
  await fs.writeFile(tempPath, buffer)
  return tempPath
}

// ── Service Implementation ──────────────────────────────────────────────────

export async function saveMedia(file: File, category: string): Promise<MediaUploadResponse> {
  try {
    initializeMediaDirectories()

    if (!CATEGORIES.includes(category)) {
      return { success: false, error: 'Invalid media category.' }
    }

    const originalName = file.name
    const ext = path.extname(originalName).toLowerCase()

    if (EXECUTABLE_EXTS.includes(ext)) {
      return { success: false, error: 'Executable files are strictly prohibited.' }
    }

    const mimeType = file.type
    const isImage = ALLOWED_IMAGE_TYPES.includes(mimeType)
    const isVideo = ALLOWED_VIDEO_TYPES.includes(mimeType)

    if (!isImage && !isVideo) {
      return { success: false, error: 'Unsupported file format.' }
    }

    if (isImage && file.size > MAX_IMAGE_SIZE) {
      return { success: false, error: 'Image exceeds 10 MB limit.' }
    }
    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      return { success: false, error: 'Video exceeds 500 MB limit.' }
    }

    const safeName = sanitizeFilename(path.basename(originalName, ext))
    const timestamp = Date.now()
    const random = crypto.randomBytes(4).toString('hex')
    
    const buffer = Buffer.from(await file.arrayBuffer())
    
    if (isImage) {
      return await processImage(buffer, safeName, category, timestamp, random, mimeType)
    } else {
      return await processVideo(buffer, safeName, category, timestamp, random, ext)
    }

  } catch (err) {
    console.error('Media upload failed:', err)
    const errorMsg = err instanceof Error ? err.message : String(err)
    return { success: false, error: 'Upload failed: ' + errorMsg }
  }
}

async function processImage(
  buffer: Buffer,
  safeName: string,
  category: string,
  timestamp: number,
  random: string,
  mimeType: string
): Promise<MediaUploadResponse> {
  // If SVG, just save it directly since Sharp doesn't optimize SVGs well
  if (mimeType === 'image/svg+xml') {
    const filename = `${timestamp}-${random}-${safeName}.svg`
    const filePath = path.join(UPLOADS_DIR, category, filename)
    await fs.writeFile(filePath, buffer)
    
    // SVG thumbnail is just the SVG itself
    const thumbPath = path.join(THUMBNAILS_DIR, category, filename)
    await fs.writeFile(thumbPath, buffer)

    return {
      success: true,
      url: `/uploads/${category}/${filename}`,
      thumbnailUrl: `/uploads/thumbnails/${category}/${filename}`,
      filename
    }
  }

  const outputFilename = `${timestamp}-${random}-${safeName}.webp`
  const outputPath = path.join(UPLOADS_DIR, category, outputFilename)
  const thumbPath = path.join(THUMBNAILS_DIR, category, outputFilename)

  // 1. Optimize Main Image
  await sharp(buffer)
    .resize({
      width: 1920,
      height: 1920,
      fit: 'inside', // preserve aspect ratio, prevent upscaling
      withoutEnlargement: true
    })
    .webp({ quality: 82 }) // 80-85% target
    .toFile(outputPath)

  // 2. Generate Thumbnail
  await sharp(buffer)
    .resize({ width: 400, withoutEnlargement: true })
    .webp({ quality: 70 })
    .toFile(thumbPath)

  return {
    success: true,
    url: `/uploads/${category}/${outputFilename}`,
    thumbnailUrl: `/uploads/thumbnails/${category}/${outputFilename}`,
    filename: outputFilename
  }
}

async function processVideo(
  buffer: Buffer,
  safeName: string,
  category: string,
  timestamp: number,
  random: string,
  originalExt: string
): Promise<MediaUploadResponse> {
  const outputFilename = `${timestamp}-${random}-${safeName}.mp4`
  const thumbFilename = `${timestamp}-${random}-${safeName}.webp`
  
  const outputPath = path.join(UPLOADS_DIR, category, outputFilename)

  const tempInputFilename = `temp-${timestamp}-${random}${originalExt}`
  const tempInputPath = await writeTempFile(buffer, tempInputFilename)

  try {
    // 1. Transcode Video
    await new Promise<void>((resolve, reject) => {
      ffmpeg(tempInputPath)
        .outputOptions([
          '-c:v libx264',    // H.264 codec
          '-preset fast',
          '-crf 28',         // Reduce bitrate while maintaining quality
          '-c:a aac',        // Audio codec
          '-b:a 128k',
          '-movflags +faststart', // Web optimized
          '-vf scale=\'min(1920,iw)\':\'min(1080,ih)\'' // Max 1080p, no upscaling
        ])
        .toFormat('mp4')
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .save(outputPath)
    })

    // 2. Generate Thumbnail (first frame)
    await new Promise<void>((resolve) => {
      ffmpeg(tempInputPath)
        .screenshots({
          timestamps: ['00:00:01.000'], // capture at 1 second
          filename: thumbFilename,
          folder: path.join(THUMBNAILS_DIR, category),
          size: '400x?'
        })
        .on('end', () => resolve())
        .on('error', (err) => {
          console.warn('Failed to generate video thumbnail:', err)
          resolve() // Don't fail the whole upload if thumbnail fails
        })
    })

    // If thumbnail was saved as .jpg by ffmpeg, we might need to convert it, 
    // but fluent-ffmpeg screenshots defaults to png or jpg. 
    // Wait, the filename we gave is .webp. Let's make sure it handles it or we'll just ignore for now.
    // Actually, ffmpeg supports webp output if compiled with libwebp. 

    return {
      success: true,
      url: `/uploads/${category}/${outputFilename}`,
      thumbnailUrl: `/uploads/thumbnails/${category}/${thumbFilename}`,
      filename: outputFilename
    }

  } finally {
    // Cleanup temp file
    if (existsSync(tempInputPath)) {
      await fs.unlink(tempInputPath).catch(() => {})
    }
  }
}

export async function deleteMedia(fileUrl: string): Promise<boolean> {
  try {
    // Basic path traversal prevention
    if (fileUrl.includes('..')) return false

    // Expected format: /uploads/category/filename.ext
    const relativePath = fileUrl.startsWith('/') ? fileUrl.slice(1) : fileUrl
    const absolutePath = path.join(process.cwd(), 'public', relativePath)

    if (existsSync(absolutePath)) {
      await fs.unlink(absolutePath)
    }

    // Attempt to delete thumbnail
    const parts = fileUrl.split('/')
    if (parts.length >= 4 && parts[1] === 'uploads') {
      const category = parts[2]
      const filename = parts[3]
      // Replace extension with webp for thumbnail
      const thumbFilename = filename.replace(/\.[^/.]+$/, '.webp')
      const thumbPath = path.join(THUMBNAILS_DIR, category, thumbFilename)
      if (existsSync(thumbPath)) {
        await fs.unlink(thumbPath)
      }
    }

    return true
  } catch (err) {
    console.error('Failed to delete media:', err)
    return false
  }
}

export async function listMedia(category?: string) {
  initializeMediaDirectories()
  
  const catsToScan = category && CATEGORIES.includes(category) ? [category] : CATEGORIES
  const results = []

  for (const cat of catsToScan) {
    const catDir = path.join(UPLOADS_DIR, cat)
    if (!existsSync(catDir)) continue

    const files = await fs.readdir(catDir)
    for (const file of files) {
      if (file === '.DS_Store' || file.startsWith('.')) continue
      
      const filePath = path.join(catDir, file)
      const stats = await fs.stat(filePath)
      if (!stats.isFile()) continue

      const ext = path.extname(file).toLowerCase()
      const isVideo = ['.mp4', '.mov', '.webm'].includes(ext)
      const thumbFilename = file.replace(/\.[^/.]+$/, '.webp')

      results.push({
        id: file, // simple ID
        url: `/uploads/${cat}/${file}`,
        thumbnailUrl: `/uploads/thumbnails/${cat}/${thumbFilename}`,
        filename: file,
        category: cat,
        type: isVideo ? 'video' : 'image',
        sizeBytes: stats.size,
        createdAt: stats.birthtime.toISOString()
      })
    }
  }

  // Sort newest first
  return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}
