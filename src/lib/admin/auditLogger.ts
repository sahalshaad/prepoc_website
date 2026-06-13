import path from 'path'
import { readData, writeData } from '@/lib/dataStore'

export interface AuditLog {
  id: string
  timestamp: string
  adminId: string
  action: string
  entity: string
  entityId: string
  details?: unknown
}

/**
 * Asynchronously logs an admin action.
 * GUARANTEE: This function will never throw an error that breaks the main request.
 */
export async function logAdminAction(
  action: string,
  entity: string,
  entityId: string,
  details?: unknown,
  adminId: string = 'system'
) {
  // Fire and forget, but handle internally
  try {
    const dataPath = path.join(process.cwd(), 'src', 'data', 'auditLogs.json')
    
    // Default structure
    const defaultData = { AUDIT_LOGS: [] as AuditLog[] }
    
    // Read current
    const dataJson = await readData(dataPath, defaultData)
    const logs = dataJson.AUDIT_LOGS || []
    
    // Create new log entry
    const newLog: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
      adminId,
      action,
      entity,
      entityId,
      details
    }
    
    // Prepend to keep newest first, limit to 1000 logs maybe? (For now just push)
    logs.unshift(newLog)
    
    // Keep only last 2000 logs to prevent file bloat
    if (logs.length > 2000) {
      logs.length = 2000
    }
    
    dataJson.AUDIT_LOGS = logs
    
    // Write back
    await writeData(dataPath, dataJson)
  } catch (err) {
    // Deliberately swallow errors to prevent breaking the main request
    // Only log to standard error for infrastructure monitoring
    console.error('[AUDIT LOGGER ERROR] Failed to write audit log:', err)
  }
}
