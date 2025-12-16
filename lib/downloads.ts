import crypto from 'crypto'
import { AuditAction } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export const DOWNLOAD_LIMIT = 3
export const DOWNLOAD_WINDOW_DAYS = 14
export const DOWNLOAD_TOKEN_TTL_SECONDS = 300 // 5 minutes
export const STALE_DOWNLOAD_MAX_AGE_HOURS = 24

export interface DownloadTokenPayload {
  d: string // downloadId
  u: string // userId
  p: string // productId
  l: string // licenseId
  exp: number // epoch seconds
}

function getTokenSecret(): string {
  const secret =
    process.env.DOWNLOAD_TOKEN_SECRET || process.env.NEXTAUTH_SECRET

  if (!secret) {
    throw new Error(
      'Missing DOWNLOAD_TOKEN_SECRET or NEXTAUTH_SECRET for download tokens'
    )
  }

  return secret
}

export function createDownloadToken(payload: DownloadTokenPayload): string {
  const secret = getTokenSecret()
  const base = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = crypto
    .createHmac('sha256', secret)
    .update(base)
    .digest('base64url')

  return `${base}.${signature}`
}

export function verifyDownloadToken(
  token: string
): DownloadTokenPayload | null {
  const [base, signature] = token.split('.')
  if (!base || !signature) return null

  const secret = getTokenSecret()
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(base)
    .digest('base64url')

  if (expectedSignature !== signature) return null

  try {
    const json = Buffer.from(base, 'base64url').toString('utf8')
    const payload = JSON.parse(json) as DownloadTokenPayload

    if (typeof payload.exp !== 'number') return null
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp < now) return null

    return payload
  } catch {
    return null
  }
}

export function hashIp(ip: string | null): string {
  if (!ip) {
    return 'unknown'
  }

  const secret = process.env.IP_HASH_SECRET || process.env.NEXTAUTH_SECRET
  if (!secret) {
    // Without a secret we cannot meaningfully hash the IP.
    // Fall back to a stable, non-identifying placeholder.
    return 'unknown'
  }

  return crypto.createHmac('sha256', secret).update(ip).digest('hex')
}

function isPrivateOrLocalHost(hostname: string): boolean {
  const host = hostname.toLowerCase()

  if (host === 'localhost' || host === '127.0.0.1' || host === '::1') {
    return true
  }

  if (host.startsWith('10.')) return true
  if (host.startsWith('192.168.')) return true
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host)) return true

  return false
}

export function getSafeProductFileUrl(
  rawUrl: string,
  requestHost?: string | null
): URL {
  let url: URL
  try {
    // Require absolute or scheme-relative HTTPS URLs
    url = new URL(rawUrl)
  } catch {
    throw new Error('INVALID_FILE_URL')
  }

  if (url.protocol !== 'https:') {
    throw new Error('INVALID_FILE_URL_PROTOCOL')
  }

  const hostname = url.hostname

  if (isPrivateOrLocalHost(hostname)) {
    throw new Error('FILE_URL_HOST_NOT_ALLOWED')
  }

  const allowedHostsEnv =
    process.env.DOWNLOAD_FILE_ALLOWED_HOSTS ||
    process.env.DIGITAL_PRODUCT_FILE_HOSTS

  if (allowedHostsEnv) {
    const allowed = new Set(
      allowedHostsEnv
        .split(',')
        .map(h => h.trim().toLowerCase())
        .filter(Boolean)
    )

    if (!allowed.has(hostname.toLowerCase())) {
      throw new Error('FILE_URL_HOST_NOT_ALLOWLISTED')
    }
  }

  return url
}

export async function logDownloadEvent(options: {
  userId: string | null
  action: AuditAction
  resourceId: string
  ipHash?: string
  userAgent?: string | null
  details?: Record<string, unknown>
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: options.userId ?? undefined,
        action: options.action,
        resource: 'DigitalProduct',
        resourceId: options.resourceId,
        ipHash: options.ipHash,
        userAgent: options.userAgent ?? undefined,
        details: options.details ?? undefined,
      },
    })
  } catch (error) {
    // Audit logging must never break downloads
    console.error('Failed to write download audit log', error)
  }
}

export async function cleanupStalePendingDownloads(now: Date = new Date()) {
  const cutoff = new Date(
    now.getTime() - STALE_DOWNLOAD_MAX_AGE_HOURS * 60 * 60 * 1000
  )

  try {
    await prisma.download.deleteMany({
      where: {
        successful: false,
        downloadedAt: {
          lt: cutoff,
        },
      },
    })
  } catch (error) {
    console.error('Failed to cleanup stale downloads', error)
  }
}
