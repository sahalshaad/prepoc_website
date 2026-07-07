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
    // Rate limit by IP + Email (Temporarily increased to 50 for testing)
    const isAllowed = checkRateLimit(identifier, 'careers_apply', 50, 60 * 60 * 1000)
    
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

    // Split name into first and last name for ERP backend
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Applicant';

    // Forward the application to ERP backend
    const erpFormData = new FormData();
    erpFormData.append('first_name', firstName);
    erpFormData.append('last_name', lastName);
    erpFormData.append('email', email);
    if (phone) erpFormData.append('phone', phone);
    if (coverLetter) erpFormData.append('cover_letter', coverLetter);
    erpFormData.append('resume', resumeFile);

    const baseUrl = process.env.ERP_API_URL || 'https://erp.prepoc.in';
    const applyUrl = `${baseUrl}/api/v1/public/recruitment/jobs/${jobId}/apply/`;
    
    console.log(`Forwarding application for ${email} to ${applyUrl}`);
    const response = await fetch(applyUrl, {
      method: 'POST',
      body: erpFormData,
      // Note: Do not set Content-Type header when sending FormData via fetch.
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ERP Backend rejected application: ${response.status} ${errorText}`);
      try {
        const errorJson = JSON.parse(errorText);
        return NextResponse.json({ success: false, error: errorJson.error || 'Failed to submit application to ERP system.' }, { status: response.status });
      } catch (e) {
        return NextResponse.json({ success: false, error: 'Failed to submit application to ERP system.' }, { status: 500 });
      }
    }

    const result = await response.json();

    // Success response
    return NextResponse.json({ 
      success: true, 
      data: {
        reference: result.reference || `app-${Date.now()}`
      } 
    })
  } catch (err) {
    console.error('Failed to submit application:', err)
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
