import { requireAdmin } from '@/lib/admin/auth'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { readData, writeData } from '@/lib/dataStore'
import { DepartmentSchema } from '@/lib/schemas'
import { logAdminAction } from '@/lib/admin/auditLogger'
import { DepartmentCMS } from '@/types/admin'

const DEPS_PATH = path.join(process.cwd(), 'src', 'data', 'departmentsData.json')

export async function GET() {
  try { await requireAdmin(); } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  try {
    const deps = await readData<DepartmentCMS[]>(DEPS_PATH, [])
    deps.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))

    const teamData = await readData<Record<string, unknown>>(path.join(process.cwd(), 'src', 'data', 'aboutData.json'), { TEAM_MEMBERS: [] })
    
    let erpJobs: any[] = [];
    try {
      const baseUrl = process.env.ERP_API_URL || 'http://localhost:8000';
      const resp = await fetch(`${baseUrl}/api/recruitment/jobs/`, {
        headers: { 'x-internal-admin-bypass': 'true' },
        cache: 'no-store'
      });
      if (resp.ok) {
        const json = await resp.json();
        erpJobs = json.results || [];
      }
    } catch (e) {
      console.error('Failed to fetch jobs for department counts', e);
    }

    const enhancedDeps = deps.map(d => {
      const teamCount = Array.isArray(teamData.TEAM_MEMBERS) ? teamData.TEAM_MEMBERS.filter((m: any) => m.department === d.name || m.department === d.id).length : 0
      const vacancyCount = erpJobs.filter((v: any) => v.department_name === d.name || v.department_name === d.id).length
      return { ...d, teamCount, vacancyCount }
    })

    return NextResponse.json({ success: true, data: enhancedDeps })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  try {
    const body = await req.json()
    const parseResult = DepartmentSchema.safeParse(body)
    if (!parseResult.success) {
      return NextResponse.json({ success: false, errors: parseResult.error.errors }, { status: 400 })
    }

    const { name } = body
    const deps = await readData<DepartmentCMS[]>(DEPS_PATH, [])
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    
    if (deps.some(d => d.id === id)) {
      return NextResponse.json({ success: false, error: 'Department already exists' }, { status: 400 })
    }

    const newDep: DepartmentCMS = {
      id,
      name,
      isActive: true,
      displayOrder: deps.length > 0 ? Math.max(...deps.map(d => d.displayOrder || 0)) + 1 : 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    deps.push(newDep)
    await writeData(DEPS_PATH, deps)
    await logAdminAction('CREATE', 'DEPARTMENT', id, { name })
    
    return NextResponse.json({ success: true, data: newDep })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try { await requireAdmin(); } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  try {
    const body = await req.json()
    const { id, name, isActive, displayOrder, action, departments } = body
    
    const deps = await readData<DepartmentCMS[]>(DEPS_PATH, [])

    if (action === 'reorder' && departments) {
      for (const d of deps) {
        const matching = departments.find((updated: Record<string, unknown>) => updated.id === d.id)
        if (matching && matching.displayOrder !== undefined) {
          d.displayOrder = matching.displayOrder
        }
      }
      deps.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
      await writeData(DEPS_PATH, deps)
      await logAdminAction('REORDER', 'DEPARTMENT', 'all')
      return NextResponse.json({ success: true, data: deps })
    }

    const target = deps.find(d => d.id === id)
    if (!target) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })

    // Validate partial update
    const parseResult = DepartmentSchema.partial().safeParse({ name, isActive, displayOrder })
    if (!parseResult.success) {
      return NextResponse.json({ success: false, errors: parseResult.error.errors }, { status: 400 })
    }

    if (name !== undefined) target.name = name
    if (isActive !== undefined) target.isActive = isActive
    if (displayOrder !== undefined) target.displayOrder = displayOrder
    target.updatedAt = new Date().toISOString()

    await writeData(DEPS_PATH, deps)
    await logAdminAction('UPDATE', 'DEPARTMENT', id, { name })
    return NextResponse.json({ success: true, data: target })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try { await requireAdmin(); } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 })

    const deps = await readData<DepartmentCMS[]>(DEPS_PATH, [])
    const target = deps.find(d => d.id === id)
    if (!target) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })

    // Check dependencies safely
    let inUse = false
    const teamData = await readData<Record<string, unknown>>(path.join(process.cwd(), 'src', 'data', 'aboutData.json'), { TEAM_MEMBERS: [] })
    if (Array.isArray(teamData.TEAM_MEMBERS) && teamData.TEAM_MEMBERS.some((m: any) => m.department === target.name || m.department === target.id)) {
      inUse = true
    }

    let erpJobs: any[] = [];
    try {
      const baseUrl = process.env.ERP_API_URL || 'http://localhost:8000';
      const resp = await fetch(`${baseUrl}/api/recruitment/jobs/`, {
        headers: { 'x-internal-admin-bypass': 'true' },
        cache: 'no-store'
      });
      if (resp.ok) {
        const json = await resp.json();
        erpJobs = json.results || [];
      }
    } catch (e) {
      console.error('Failed to fetch jobs for dependency check', e);
    }
    
    if (erpJobs.some((v: any) => v.department_name === target.name || v.department_name === target.id)) {
      inUse = true
    }

    if (inUse) {
      return NextResponse.json({ success: false, error: 'This department is currently in use and cannot be deleted.' }, { status: 400 })
    }

    const updatedDeps = deps.filter(d => d.id !== id)
    await writeData(DEPS_PATH, updatedDeps)
    await logAdminAction('DELETE', 'DEPARTMENT', id)
    
    return NextResponse.json({ success: true, data: target })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
