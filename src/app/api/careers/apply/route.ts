import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'
import { readData, writeData } from '@/lib/dataStore'
import { checkRateLimit } from '@/lib/rateLimit'
import { isSafeUrl } from '@/utils/urlValidation'
import { JobApplication } from '@/types/admin'

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'jobApplicationsData.json')

export async function POST(req: NextRequest) {
  try {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
    const isAllowed = checkRateLimit(ip, 'careers_apply', 5, 60 * 60 * 1000)
    
    if (!isAllowed) {
      return NextResponse.json({ success: false, message: 'Too many applications. Please try again later.' }, { status: 429 })
    }

    const formData = await req.formData()
    
    const jobId = formData.get('jobId') as string
    const jobTitle = formData.get('jobTitle') as string
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const location = formData.get('location') as string
    const linkedinUrl = formData.get('linkedinUrl') as string
    const portfolioUrl = formData.get('portfolioUrl') as string
    const coverLetter = formData.get('coverLetter') as string
    const resumeFile = formData.get('resume') as File | null

    if (!jobId || !name || !email || !resumeFile) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    // URL Validation
    if (!isSafeUrl(linkedinUrl) || !isSafeUrl(portfolioUrl)) {
      return NextResponse.json({ success: false, error: 'Invalid URL format' }, { status: 400 })
    }

    // Validate resume size (10MB)
    if (resumeFile.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'Resume must be less than 10MB' }, { status: 400 })
    }

    // Validate resume format
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!validTypes.includes(resumeFile.type)) {
      return NextResponse.json({ success: false, error: 'Resume must be a PDF, DOC, or DOCX file' }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'resumes')
    await fs.mkdir(uploadDir, { recursive: true })

    const ext = resumeFile.name.split('.').pop()?.toLowerCase() || 'pdf'
    // Prevent executable extensions
    if (['exe', 'sh', 'bat', 'js', 'php'].includes(ext)) {
      return NextResponse.json({ success: false, error: 'Invalid file extension' }, { status: 400 })
    }

    const filename = `resume-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
    const filepath = path.join(uploadDir, filename)
    
    const arrayBuffer = await resumeFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    await fs.writeFile(filepath, buffer)

    const resumeUrl = `/uploads/resumes/${filename}`

    const application: JobApplication = {
      id: `app-${Date.now()}`,
      jobId,
      jobTitle,
      name,
      email,
      phone,
      location,
      linkedinUrl,
      portfolioUrl: portfolioUrl || undefined,
      coverLetter,
      resumeUrl,
      status: 'new',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const dataJson = await readData(DATA_PATH, { APPLICATIONS: [] })
    const existingApplications = (dataJson.APPLICATIONS || []) as JobApplication[]
    
    existingApplications.push(application)
    dataJson.APPLICATIONS = existingApplications
    
    await writeData(DATA_PATH, dataJson)

    return NextResponse.json({ success: true, data: application })
  } catch (err) {
    console.error('Failed to submit application:', err)
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
