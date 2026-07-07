import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { config } from 'dotenv'

// Load environment variables from .env.local
config({ path: '.env.local' })

const prisma = new PrismaClient()

// Password Policy Validation
function validatePassword(password: string): boolean {
  // Min 12 chars, upper, lower, number, special
  const minLength = password.length >= 12
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (!minLength) console.error('Password must be at least 12 characters long.')
  if (!hasUpper) console.error('Password must contain an uppercase letter.')
  if (!hasLower) console.error('Password must contain a lowercase letter.')
  if (!hasNumber) console.error('Password must contain a number.')
  if (!hasSpecial) console.error('Password must contain a special character.')

  return minLength && hasUpper && hasLower && hasNumber && hasSpecial
}

async function main() {
  console.log('\n[INFO] --- PREPOC Admin Seeding Started ---')
  console.log('[INFO] Starting database connection...')
  await prisma.$connect()
  console.log('[INFO] Database connection successful.')

  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    console.error('[ERROR] Missing ADMIN_EMAIL or ADMIN_PASSWORD environment variables.')
    process.exit(1)
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    console.error(`[ERROR] Invalid email format: ${email}`)
    process.exit(1)
  }

  if (!validatePassword(password)) {
    console.error('[ERROR] The provided password does not meet security requirements.')
    process.exit(1)
  }

  try {
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email },
    })

    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    if (existingAdmin) {
      console.log(`[INFO] Existing admin found for email: ${email}. Updating password...`)
      await prisma.adminUser.update({
        where: { email },
        data: {
          passwordHash,
          requiresPasswordChange: false,
          passwordChangedAt: new Date(),
        },
      })
      console.log(`[SUCCESS] Password updated successfully for: ${email}`)
    } else {
      console.log(`[INFO] No existing admin found. Creating new SUPER_ADMIN...`)
      const admin = await prisma.adminUser.create({
        data: {
          email,
          passwordHash,
          role: 'SUPER_ADMIN',
          requiresPasswordChange: false,
        },
      })
      console.log(`[SUCCESS] Successfully created SUPER_ADMIN: ${admin.email}`)
    }
  } catch (error) {
    console.error('[ERROR] An unexpected error occurred during seeding:', error)
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error('[FATAL ERROR] Failed to run seed script:', e)
    process.exit(1)
  })
  .finally(async () => {
    console.log('[INFO] Closing database connection.')
    await prisma.$disconnect()
  })
