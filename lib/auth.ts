import { getServerSession as getNextAuthServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

// ============================================
// TYPE DEFINITIONS
// ============================================

export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR'

export interface SessionUser {
  id: string
  email: string
  name?: string
  role: UserRole
  image?: string
}

export interface AuthSession {
  user: SessionUser
  expires: string
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get the current server session
 * @returns Session or null if not authenticated
 */
export async function getServerSession(): Promise<AuthSession | null> {
  const session = await getNextAuthServerSession(authOptions)
  return session as AuthSession | null
}

/**
 * Require authentication - redirect to login if not authenticated
 * @param redirectTo - Optional redirect URL after login
 * @returns Session (guaranteed to be non-null)
 */
export async function requireAuth(
  redirectTo?: string
): Promise<AuthSession> {
  const session = await getServerSession()

  if (!session) {
    const callbackUrl = redirectTo || '/login'
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)
  }

  return session
}

/**
 * Require admin role - redirect if not admin
 * @param redirectTo - Optional redirect URL for non-admins
 * @returns Session with admin user
 */
export async function requireAdmin(
  redirectTo: string = '/'
): Promise<AuthSession> {
  const session = await requireAuth()

  if (session.user.role !== 'ADMIN') {
    redirect(redirectTo)
  }

  return session
}

/**
 * Check if user has a specific role
 * @param role - Role to check
 * @returns Boolean indicating if user has the role
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const session = await getServerSession()

  if (!session) return false

  return session.user.role === role
}

/**
 * Check if user is admin
 * @returns Boolean indicating if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole('ADMIN')
}

/**
 * Check if user is authenticated
 * @returns Boolean indicating if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerSession()
  return !!session
}

/**
 * Get current user ID
 * @returns User ID or null if not authenticated
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getServerSession()
  return session?.user.id || null
}

/**
 * Get current user
 * @returns User or null if not authenticated
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getServerSession()
  return session?.user || null
}

// ============================================
// CLIENT-SIDE HOOKS (to be used in client components)
// ============================================

/**
 * Check if user has permission to perform an action
 * @param userId - User ID to check
 * @param resourceOwnerId - ID of the resource owner
 * @param requiredRole - Optional role required for action
 */
export function hasPermission(
  userId: string,
  resourceOwnerId: string,
  userRole: UserRole,
  requiredRole?: UserRole
): boolean {
  // User owns the resource
  if (userId === resourceOwnerId) return true

  // User is admin (admins can do anything)
  if (userRole === 'ADMIN') return true

  // Check if user has required role
  if (requiredRole && userRole === requiredRole) return true

  return false
}

/**
 * Format user display name
 * @param user - User object
 * @returns Formatted display name
 */
export function getUserDisplayName(user: SessionUser): string {
  return user.name || user.email.split('@')[0]
}
