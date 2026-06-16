import { NextResponse } from 'next/server'
import path from 'path'
import { readData } from '@/lib/dataStore'
import { ServiceCMS } from '@/types/admin'

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'servicesData.json')
    const dataJson = await readData(dataPath, { SERVICES: [] })

    // Only return active services, sorted by displayOrder
    const activeServices = (dataJson.SERVICES || [])
      .filter((s: ServiceCMS) => s.isActive)
      .sort((a: ServiceCMS, b: ServiceCMS) => (a.displayOrder || 0) - (b.displayOrder || 0))

    return NextResponse.json({ success: true, data: activeServices })
  } catch (err) {
    console.error('Failed to fetch public services:', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch services' }, { status: 500 })
  }
}
