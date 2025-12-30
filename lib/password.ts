import bcrypt from 'bcryptjs'

// Use 12 rounds for better security (recommended minimum for 2024+)
// Cost factor of 12 = ~250ms per hash, good balance of security vs UX
const SALT_ROUNDS = 12

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}
