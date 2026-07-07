import { NextResponse, NextRequest } from 'next/server'
import path from 'path'
import { readData } from '@/lib/dataStore'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const baseUrl = process.env.ERP_API_URL || 'http://localhost:8000';
    const response = await fetch(`${baseUrl}/api/recruitment/jobs/`, {
      // Use no-store to always fetch fresh data from ERP
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from ERP: ${response.statusText}`);
    }

    const json = await response.json();
    const erpJobs = json.results || [];

    const activeVacancies = erpJobs.map((job: any) => ({
      id: job.id,
      title: job.title,
      department: job.department_name || '',
      location: job.location || '',
      type: job.employment_type === 'FULL_TIME' ? 'Full-time' : 
            job.employment_type === 'PART_TIME' ? 'Part-time' : 'Contract',
      description: job.description || '',
      requirements: job.requirements || '',
      responsibilities: job.responsibilities || '',
      benefits: job.benefits || '',
      isActive: job.status === 'PUBLISHED',
      createdAt: job.created_at,
      updatedAt: job.updated_at
    }));

    return NextResponse.json(
      { success: true, data: activeVacancies },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store'
        }
      }
    )
  } catch (err: any) {
    console.error('Failed to load careers data from ERP:', err)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to load careers data',
      details: err.message,
      attemptedUrl: `${process.env.ERP_API_URL || 'http://localhost:8000'}/api/recruitment/jobs/`
    }, { status: 500 })
  }
}
