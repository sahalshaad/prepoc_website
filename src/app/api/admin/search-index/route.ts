import { requireAdmin } from '@/lib/admin/auth'
import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

// Define the unified search item structure
export interface SearchIndexItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  href: string;
}

const PAGES: SearchIndexItem[] = [
  { id: 'page-dashboard', title: 'Dashboard', subtitle: 'Overview & metrics', category: 'Pages', href: '/admin/dashboard' },
  { id: 'page-about', title: 'About Page', subtitle: 'CMS Pages', category: 'Pages', href: '/admin/about' },
  { id: 'page-team', title: 'Team Directory', subtitle: 'CMS Pages', category: 'Pages', href: '/admin/team' },
  { id: 'page-portfolio', title: 'Portfolio Projects', subtitle: 'CMS Pages', category: 'Pages', href: '/admin/portfolio' },
  { id: 'page-careers', title: 'Careers & Vacancies', subtitle: 'CMS Pages', category: 'Pages', href: '/admin/careers' },
  { id: 'page-departments', title: 'Departments', subtitle: 'CMS Configuration', category: 'Pages', href: '/admin/departments' },
  { id: 'page-leads', title: 'Leads & Inquiries', subtitle: 'CRM', category: 'Pages', href: '/admin/leads' },
  { id: 'page-applications', title: 'Job Applications', subtitle: 'Recruitment', category: 'Pages', href: '/admin/job-applications' },
  { id: 'page-media', title: 'Media Library', subtitle: 'Assets', category: 'Pages', href: '/admin/media' },
  { id: 'page-settings', title: 'CMS Settings', subtitle: 'Configuration', category: 'Pages', href: '/admin/settings' },
  { id: 'page-navigation', title: 'Navigation', subtitle: 'Menu settings', category: 'Pages', href: '/admin/navigation' },
]

async function safeReadFile(fileName: string) {
  try {
    const content = await fs.readFile(path.join(process.cwd(), 'src', 'data', fileName), 'utf-8')
    return JSON.parse(content)
  } catch (err) {
    return null
  }
}

export async function GET() {
  try { await requireAdmin(); } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  try {
    const results: SearchIndexItem[] = [...PAGES]

    // 1. Team Members
    const aboutData = await safeReadFile('aboutData.json')
    if (aboutData?.TEAM_MEMBERS) {
      aboutData.TEAM_MEMBERS.forEach((m: any) => {
        if (m.isActive) {
          results.push({
            id: `team-${m.id}`,
            title: m.name,
            subtitle: `${m.department || 'Team'} • ${m.title}`,
            category: 'People',
            href: `/admin/team/${m.id}`
          })
        }
      })
    }

    // 2. Portfolio Projects
    const portfolioData = await safeReadFile('portfolioData.json')
    if (portfolioData?.PROJECTS) {
      portfolioData.PROJECTS.forEach((p: any) => {
        results.push({
          id: `portfolio-${p.id}`,
          title: p.title,
          subtitle: `Portfolio • ${p.category || 'Project'}`,
          category: 'Portfolio',
          href: `/admin/portfolio/${p.id}`
        })
      })
    }

    // 3. Job Vacancies
    try {
      const baseUrl = process.env.ERP_API_URL || 'http://localhost:8000';
      const resp = await fetch(`${baseUrl}/api/recruitment/jobs/`, {
        headers: { 'x-internal-admin-bypass': 'true' },
        cache: 'no-store'
      });
      if (resp.ok) {
        const json = await resp.json();
        const erpJobs = json.results || [];
        erpJobs.forEach((v: any) => {
          if (v.status === 'PUBLISHED') {
            results.push({
              id: `vacancy-${v.id}`,
              title: v.title,
              subtitle: `Careers • ${v.department_name || 'Department'} • ${v.employment_type === 'FULL_TIME' ? 'Full-time' : 'Job'}`,
              category: 'Careers',
              href: `/admin/careers/${v.id}`
            })
          }
        })
      }
    } catch (e) {
      console.error('Failed to index ERP jobs', e);
    }

    // 4. Departments
    const depsData = await safeReadFile('departmentsData.json')
    if (Array.isArray(depsData)) {
      depsData.forEach((d: any) => {
        if (d.isActive) {
          results.push({
            id: `dept-${d.id}`,
            title: d.name,
            subtitle: `Department • CMS Configuration`,
            category: 'Departments',
            href: `/admin/departments`
          })
        }
      })
    }

    // 5. Leads
    const leadsData = await safeReadFile('leadsData.json')
    if (leadsData?.LEADS) {
      leadsData.LEADS.forEach((l: any) => {
        results.push({
          id: `lead-${l.id}`,
          title: l.name,
          subtitle: `Lead • ${l.company || 'Unknown Company'}`,
          category: 'Leads',
          href: `/admin/leads`
        })
      })
    }

    // 6. Job Applications
    const appsData = await safeReadFile('jobApplicationsData.json')
    if (appsData?.APPLICATIONS) {
      appsData.APPLICATIONS.forEach((a: any) => {
        results.push({
          id: `app-${a.id}`,
          title: a.name,
          subtitle: `Application • ${a.vacancyTitle || 'Vacancy'}`,
          category: 'Applications',
          href: `/admin/job-applications`
        })
      })
    }

    return NextResponse.json({ success: true, data: results })
  } catch (error) {
    console.error('Failed to generate search index:', error)
    return NextResponse.json({ success: false, error: 'Failed to generate search index' }, { status: 500 })
  }
}
