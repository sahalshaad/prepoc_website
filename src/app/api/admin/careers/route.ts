import { requireAdmin } from '@/lib/admin/auth'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { readData, writeData } from '@/lib/dataStore'
import { JobVacancySchema } from '@/lib/schemas'
import { logAdminAction } from '@/lib/admin/auditLogger'
import { JobVacancy } from '@/types/admin'

export async function GET() {
  try { await requireAdmin(); } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  try {
    const baseUrl = process.env.ERP_API_URL || 'https://erp.prepoc.in';
    const response = await fetch(`${baseUrl}/api/recruitment/jobs/`, {
      headers: {
        'x-internal-admin-bypass': 'true'
      },
      cache: 'no-store'
    });
    
    if (!response.ok) throw new Error(`Failed to fetch from ERP: ${response.statusText}`);

    const json = await response.json();
    const erpJobs = json.results || [];

    const vacancies = erpJobs.map((job: any) => ({
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

    return NextResponse.json({ success: true, data: vacancies })
  } catch (err) {
    console.error('Failed to load careers data from ERP:', err)
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  return NextResponse.json({ 
    success: false, 
    error: 'Job management is now handled exclusively in the ERP Dashboard. Please edit or delete jobs there.' 
  }, { status: 400 })
}
