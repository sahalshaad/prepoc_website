import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'
import { readData, writeData } from '@/lib/dataStore'
import { checkRateLimit } from '@/lib/rateLimit'
import { isSafeUrl } from '@/utils/urlValidation'
import { JobApplication } from '@/types/admin'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    
    const jobId = formData.get('jobId') as string
    const jobTitle = formData.get('jobTitle') as string || 'Unknown Job'
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string || ''
    const location = formData.get('location') as string || ''
    const linkedinUrl = formData.get('linkedinUrl') as string || ''
    const portfolioUrl = formData.get('portfolioUrl') as string || ''
    const coverLetter = formData.get('coverLetter') as string || ''
    const resumeFile = formData.get('resume') as File | null

    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
    const identifier = `${ip}:${email || ''}`
    // Rate limit by IP + Email
    const isAllowed = checkRateLimit(identifier, 'careers_apply', 5, 60 * 60 * 1000)
    
    if (!isAllowed) {
      console.error('[Apply Error] Rate limit exceeded for:', identifier)
      return NextResponse.json({ success: false, error: 'Too many applications. Please try again later.' }, { status: 429 })
    }

    if (!jobId || !name || !email || !resumeFile) {
      console.error('[Apply Error] Missing fields:', { jobId: !!jobId, name: !!name, email: !!email, resumeFile: !!resumeFile })
      return NextResponse.json({ success: false, error: 'Missing required fields (jobId, name, email, resume)' }, { status: 400 })
    }

    // URL Validation
    if ((linkedinUrl && !isSafeUrl(linkedinUrl))) {
      console.error('[Apply Error] Invalid LinkedIn URL:', linkedinUrl)
      return NextResponse.json({ success: false, error: 'Invalid LinkedIn URL format' }, { status: 400 })
    }
    if ((portfolioUrl && !isSafeUrl(portfolioUrl))) {
      console.error('[Apply Error] Invalid Portfolio URL:', portfolioUrl)
      return NextResponse.json({ success: false, error: 'Invalid Portfolio URL format' }, { status: 400 })
    }

    if (!(resumeFile instanceof Blob)) {
      console.error('[Apply Error] Resume is not a file/blob. Type:', typeof resumeFile)
      return NextResponse.json({ success: false, error: 'Resume must be a file' }, { status: 400 })
    }

    if (resumeFile.size > 10 * 1024 * 1024) {
      console.error('[Apply Error] Resume too large:', resumeFile.size)
      return NextResponse.json({ success: false, error: 'Resume must be less than 10MB' }, { status: 400 })
    }

    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/octet-stream']
    const ext = resumeFile.name.split('.').pop()?.toLowerCase() || 'pdf'
    if (!validTypes.includes(resumeFile.type) || !['pdf', 'doc', 'docx'].includes(ext)) {
      console.error('[Apply Error] Invalid file type:', { type: resumeFile.type, ext })
      return NextResponse.json({ success: false, error: 'Resume must be a PDF, DOC, or DOCX file. Detected type: ' + resumeFile.type }, { status: 400 })
    }

    // Save resume to public/uploads/resumes
    const bytes = await resumeFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const filename = `${uniqueSuffix}-${resumeFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'resumes')
    await fs.mkdir(uploadDir, { recursive: true })
    
    const filepath = path.join(uploadDir, filename)
    await fs.writeFile(filepath, buffer)
    
    const resumeUrl = `/uploads/resumes/${filename}`

    // Save to local jobApplicationsData.json
    const dataPath = path.join(process.cwd(), 'src', 'data', 'jobApplicationsData.json')
    const dataJson = await readData(dataPath, { APPLICATIONS: [] })
    
    // Check if already applied
    const existing = (dataJson.APPLICATIONS || []) as JobApplication[]
    const alreadyApplied = existing.find(a => a.jobId === jobId && a.email === email)
    if (alreadyApplied) {
      return NextResponse.json({ success: false, error: 'You have already applied for this position.' }, { status: 400 })
    }

    const newApp: JobApplication = {
      id: `app-${Date.now()}`,
      jobId,
      jobTitle,
      name,
      email,
      phone,
      location,
      linkedinUrl,
      portfolioUrl,
      coverLetter,
      resumeUrl,
      status: 'new',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    existing.push(newApp)
    dataJson.APPLICATIONS = existing
    
    await writeData(dataPath, dataJson)

    // Success response
    return NextResponse.json({ 
      success: true, 
      data: {
        reference: newApp.id
      } 
    })
  } catch (err) {
    console.error('Failed to submit application:', err)
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
