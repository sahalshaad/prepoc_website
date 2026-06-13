import fs from 'fs/promises'
import { existsSync, readdirSync, unlinkSync, statSync } from 'fs'
import path from 'path'
import crypto from 'crypto'
import lockfile from 'proper-lockfile'

export async function readData<T>(filePath: string, defaultData: T): Promise<T> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(fileContent) as T
  } catch (err: unknown) {
    if (err instanceof Error && (err as any).code === 'ENOENT') {
      return defaultData
    }
    throw err
  }
}

export async function writeData<T>(filePath: string, data: T): Promise<void> {
  // Ensure the directory exists
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  
  // Clean up any old orphaned temp files for this specific filePath
  cleanupStaleTempFiles(filePath)

  let release: (() => Promise<void>) | null = null
  
  // Create an empty file if it doesn't exist so we can lock it
  try {
    await fs.access(filePath)
  } catch {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2))
    return
  }

  try {
    // Acquire lock with a timeout and stale lock recovery (locks older than 10s are considered stale)
    release = await lockfile.lock(filePath, { 
      retries: 5, 
      stale: 10000,
      update: 2000 
    })

    const tempFile = `${filePath}.${crypto.randomBytes(6).toString('hex')}.tmp`
    await fs.writeFile(tempFile, JSON.stringify(data, null, 2))
    await fs.rename(tempFile, filePath)

  } finally {
    if (release) {
      await release()
    }
  }
}

/**
 * Automatically cleans up any .tmp files associated with the target file 
 * that are older than 5 minutes to prevent disk bloat after crashes.
 */
function cleanupStaleTempFiles(targetFilePath: string) {
  try {
    const dir = path.dirname(targetFilePath)
    const base = path.basename(targetFilePath)
    if (!existsSync(dir)) return

    const files = readdirSync(dir)
    const now = Date.now()

    for (const file of files) {
      if (file.startsWith(base) && file.endsWith('.tmp')) {
        const tempFilePath = path.join(dir, file)
        const stats = statSync(tempFilePath)
        // If older than 5 minutes (300000 ms), delete it
        if (now - stats.mtimeMs > 300000) {
          unlinkSync(tempFilePath)
        }
      }
    }
  } catch (err) {
    console.warn('Failed to cleanup stale temp files:', err)
  }
}
