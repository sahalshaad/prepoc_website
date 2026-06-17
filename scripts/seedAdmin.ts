import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import readline from 'readline'
import { Writable } from 'stream'

const prisma = new PrismaClient()

// Helper to mask password input
function promptUser(query: string, hideInput: boolean = false): Promise<string> {
  return new Promise((resolve) => {
    let muted = false

    const mutableStdout = new Writable({
      write(chunk, encoding, callback) {
        if (!muted) {
          process.stdout.write(chunk, encoding)
        }
        callback()
      },
    })

    const rl = readline.createInterface({
      input: process.stdin,
      output: mutableStdout,
      terminal: true,
    })

    process.stdout.write(query)
    muted = hideInput

    rl.question('', (answer) => {
      rl.close()
      if (hideInput) console.log() // Print newline after hidden input
      resolve(answer)
    })
  })
}

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
  console.log('\n--- PREPOC Admin Seeding ---\n')

  const existingSuperAdmin = await prisma.adminUser.findFirst({
    where: { role: 'SUPER_ADMIN' },
  })

  if (existingSuperAdmin) {
    console.error('Super admin already exists. Seeding aborted.')
    process.exit(1)
  }

  let email = await promptUser('Admin Email [admin@prepoc.in]: ')
  if (!email.trim()) {
    email = 'admin@prepoc.in'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    console.error('Invalid email format.')
    process.exit(1)
  }

  let password = ''
  let confirmPassword = ''

  while (true) {
    password = await promptUser('Admin Password: ', true)
    if (!validatePassword(password)) {
      console.log('\nPlease try a stronger password.\n')
      continue
    }

    confirmPassword = await promptUser('Confirm Password: ', true)
    if (password !== confirmPassword) {
      console.log('Passwords do not match. Try again.\n')
      continue
    }
    
    break
  }

  console.log('\nCreating SUPER_ADMIN account...')

  const saltRounds = 12
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const admin = await prisma.adminUser.create({
    data: {
      email,
      passwordHash,
      role: 'SUPER_ADMIN',
      requiresPasswordChange: false, // Since they just set it manually securely
    },
  })

  console.log(`\nSuccessfully created SUPER_ADMIN: ${admin.email}\n`)
}

main()
  .catch((e) => {
    console.error('Error seeding admin user:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
