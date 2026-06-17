import { requireAdmin } from '@/lib/admin/auth'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { z } from 'zod'
import { readData, writeData } from '@/lib/dataStore'
import { ServiceItemSchema } from '@/lib/schemas'
import { logAdminAction } from '@/lib/admin/auditLogger'
import { ServiceCMS } from '@/types/admin'

const BulkServicesSchema = z.array(ServiceItemSchema)

export async function GET() {
  try { await requireAdmin(); } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  try {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'servicesData.json')
    const dataJson = await readData(dataPath, { SERVICES: [] })
    return NextResponse.json({ success: true, data: dataJson.SERVICES || [] })
  } catch (err) {
    console.error('Failed to load services:', err)
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  try {
    const body = await req.json()
    const { service, services } = body

    const dataPath = path.join(process.cwd(), 'src', 'data', 'servicesData.json')
    const dataJson = await readData(dataPath, { SERVICES: [] })

    if (services) {
      // Bulk update
      const parseResult = BulkServicesSchema.safeParse(services)
      if (!parseResult.success) {
        return NextResponse.json({ success: false, errors: parseResult.error.errors }, { status: 400 })
      }

      dataJson.SERVICES = services
      await writeData(dataPath, dataJson)
      await logAdminAction('BULK_UPDATE', 'SERVICE', 'all')
      return NextResponse.json({ success: true, data: dataJson.SERVICES })
    }

    if (service) {
      // Create or update single service
      const parseResult = ServiceItemSchema.safeParse(service)
      if (!parseResult.success) {
        return NextResponse.json({ success: false, errors: parseResult.error.errors }, { status: 400 })
      }

      const existingIndex = dataJson.SERVICES.findIndex((s: ServiceCMS) => s.id === service.id)
      if (existingIndex >= 0) {
        dataJson.SERVICES[existingIndex] = { ...dataJson.SERVICES[existingIndex], ...service, updatedAt: new Date().toISOString() }
        await logAdminAction('UPDATE', 'SERVICE', service.id)
      } else {
        const newService = {
          ...service,
          id: service.id || crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        dataJson.SERVICES.push(newService)
        await logAdminAction('CREATE', 'SERVICE', newService.id)
      }

      await writeData(dataPath, dataJson)
      return NextResponse.json({ success: true, data: dataJson.SERVICES })
    }

    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
  } catch (err) {
    console.error('Failed to save service(s):', err)
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try { await requireAdmin(); } catch (e) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Service ID required' }, { status: 400 })
    }

    const dataPath = path.join(process.cwd(), 'src', 'data', 'servicesData.json')
    const dataJson = await readData(dataPath, { SERVICES: [] })

    const initialLength = dataJson.SERVICES.length
    dataJson.SERVICES = dataJson.SERVICES.filter((s: ServiceCMS) => s.id !== id)

    if (dataJson.SERVICES.length === initialLength) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 })
    }

    await writeData(dataPath, dataJson)
    await logAdminAction('DELETE', 'SERVICE', id)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Failed to delete service:', err)
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
