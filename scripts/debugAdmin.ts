import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('\n[INFO] --- PREPOC Admin Debug Script Started ---')
  console.log('[INFO] Starting database connection...')
  await prisma.$connect()
  console.log('[INFO] Database connection successful.')

  try {
    const adminCount = await prisma.adminUser.count()
    console.log(`\n[RESULT] Total AdminUser records: ${adminCount}`)

    if (adminCount > 0) {
      const admins = await prisma.adminUser.findMany({
        select: { email: true, role: true },
      })
      console.log('\n[RESULT] Admin Accounts:')
      admins.forEach((admin, index) => {
        console.log(`  ${index + 1}. Email: ${admin.email} | Role: ${admin.role}`)
      })
    } else {
      console.log('\n[RESULT] No admin accounts exist in the database.')
    }
  } catch (error) {
    console.error('[ERROR] An unexpected error occurred while querying the database:', error)
  }
}

main()
  .catch((e) => {
    console.error('[FATAL ERROR] Failed to run debug script:', e)
    process.exit(1)
  })
  .finally(async () => {
    console.log('\n[INFO] Closing database connection.')
    await prisma.$disconnect()
  })
