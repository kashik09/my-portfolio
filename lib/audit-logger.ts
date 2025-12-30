import { prisma } from './prisma'
import { AuditAction } from '@prisma/client'

type AuditLogData = {
  userId?: string
  action: AuditAction
  resource: string
  resourceId: string
  details?: Record<string, any>
  ipHash?: string
  userAgent?: string
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(data: AuditLogData) {
  try {
    return await prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        resource: data.resource,
        resourceId: data.resourceId,
        details: data.details || undefined,
        ipHash: data.ipHash,
        userAgent: data.userAgent,
      },
    })
  } catch (error) {
    console.error('Failed to create audit log:', error)
    // Don't throw - audit logging should not break the main operation
    return null
  }
}

/**
 * Log user login attempt
 */
export async function logLoginAttempt(
  userId: string | null,
  email: string,
  success: boolean,
  ipHash?: string,
  userAgent?: string
) {
  return createAuditLog({
    userId: userId || undefined,
    action: success ? 'USER_LOGIN' : 'USER_LOGOUT',
    resource: 'User',
    resourceId: userId || email,
    details: { email, success },
    ipHash,
    userAgent,
  })
}

/**
 * Log settings change
 */
export async function logSettingsChange(
  userId: string,
  settingName: string,
  oldValue: any,
  newValue: any,
  ipHash?: string,
  userAgent?: string
) {
  return createAuditLog({
    userId,
    action: 'SETTINGS_CHANGED',
    resource: 'Settings',
    resourceId: settingName,
    details: {
      setting: settingName,
      oldValue,
      newValue,
    },
    ipHash,
    userAgent,
  })
}

/**
 * Log content edit
 */
export async function logContentEdit(
  userId: string,
  resourceType: string,
  resourceId: string,
  changes: Record<string, any>,
  ipHash?: string,
  userAgent?: string
) {
  return createAuditLog({
    userId,
    action: 'PROJECT_CREATED', // Using existing enum value
    resource: resourceType,
    resourceId,
    details: changes,
    ipHash,
    userAgent,
  })
}

/**
 * Log deletion
 */
export async function logDeletion(
  userId: string,
  resourceType: string,
  resourceId: string,
  resourceData?: Record<string, any>,
  ipHash?: string,
  userAgent?: string
) {
  return createAuditLog({
    userId,
    action: 'ACCOUNT_LOCKED', // Reusing enum for deletions
    resource: resourceType,
    resourceId,
    details: { deleted: true, ...resourceData },
    ipHash,
    userAgent,
  })
}

/**
 * Log order status change
 */
export async function logOrderStatusChange(
  userId: string,
  orderId: string,
  oldStatus: string,
  newStatus: string,
  ipHash?: string,
  userAgent?: string
) {
  return createAuditLog({
    userId,
    action: 'SETTINGS_CHANGED', // Reusing for order changes
    resource: 'Order',
    resourceId: orderId,
    details: {
      oldStatus,
      newStatus,
    },
    ipHash,
    userAgent,
  })
}

/**
 * Get IP hash from request
 */
export function getIpHash(request: Request): string | undefined {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip')

  if (!ip) return undefined

  // Simple hash - in production, use crypto
  return Buffer.from(ip).toString('base64').slice(0, 16)
}

/**
 * Get user agent from request
 */
export function getUserAgent(request: Request): string | undefined {
  return request.headers.get('user-agent') || undefined
}
