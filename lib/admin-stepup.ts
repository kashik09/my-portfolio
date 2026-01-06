import { NextResponse } from 'next/server'
import type { AuthSession } from '@/lib/auth'
import {
  ADMIN_STEPUP_COOKIE,
  verifySignedToken,
} from '@/lib/admin-security'

type StepUpPayload = {
  u: string
  exp: number
}

export async function requireAdminStepUp(
  request: Request,
  session: AuthSession | null
): Promise<NextResponse | null> {
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const cookieHeader = request.headers.get('cookie') || ''
  const stepUpToken = cookieHeader
    .split(';')
    .map(value => value.trim())
    .find(value => value.startsWith(`${ADMIN_STEPUP_COOKIE}=`))
    ?.split('=')[1]

  if (!stepUpToken) {
    return NextResponse.json(
      { success: false, error: 'STEP_UP_REQUIRED', code: 'STEP_UP_REQUIRED' },
      { status: 401 }
    )
  }

  try {
    const payload = await verifySignedToken<StepUpPayload>(stepUpToken)
    if (!payload || payload.u !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'STEP_UP_REQUIRED', code: 'STEP_UP_REQUIRED' },
        { status: 401 }
      )
    }
  } catch {
    return NextResponse.json(
      { success: false, error: 'STEP_UP_REQUIRED', code: 'STEP_UP_REQUIRED' },
      { status: 401 }
    )
  }

  return null
}
