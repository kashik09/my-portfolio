export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getEmailConfig, sendEmail, getEmailTemplate } from '@/lib/email'
import { getServerSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { requireAdminStepUp } from '@/lib/admin-stepup'

// POST /api/admin/settings/email - Save email settings and send test
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'OWNER')) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    const stepUp = await requireAdminStepUp(request, session)
    if (stepUp) return stepUp

    const body = await request.json()
    const {
      smtpHost,
      smtpPort,
      smtpUsername,
      smtpPassword,
      smtpSecure,
      testEmail
    } = body

    const secure =
      typeof smtpSecure === 'boolean'
        ? smtpSecure
        : typeof smtpSecure === 'string'
          ? smtpSecure === 'true'
          : false

    // If testEmail is provided, send a test email using saved settings first.
    if (testEmail) {
      try {
        // Get email config from DB first, then fall back to env vars
        const config = await getEmailConfig()

        const template = getEmailTemplate('test')
        const result = await sendEmail(config, {
          to: testEmail,
          subject: template.subject,
          html: template.html
        })

        if (!result.success) {
          return NextResponse.json(
            {
              success: false,
              error: result.error || 'Failed to send test email',
              details: result.details
            },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          message: 'Test email sent successfully'
        })
      } catch (configError) {
        const message = configError instanceof Error ? configError.message : 'Email not configured'
        return NextResponse.json(
          {
            success: false,
            error: message,
            details: process.env.NODE_ENV !== 'production' ? configError : undefined,
          },
          { status: 400 }
        )
      }
    }

    if (!smtpHost || !smtpPort || !smtpUsername || !smtpPassword) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    const parsedPort = Number(smtpPort)
    if (!Number.isFinite(parsedPort) || parsedPort <= 0) {
      return NextResponse.json(
        { success: false, error: 'SMTP port must be a valid number' },
        { status: 400 }
      )
    }

    await prisma.siteSettings.upsert({
      where: { id: 'site_settings_singleton' },
      update: {
        smtpHost,
        smtpPort: parsedPort,
        smtpUsername,
        smtpPassword,
        smtpSecure: secure,
      },
      create: {
        id: 'site_settings_singleton',
        smtpHost,
        smtpPort: parsedPort,
        smtpUsername,
        smtpPassword,
        smtpSecure: secure,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Email settings saved successfully'
    })
  } catch (error) {
    console.error('Error in email settings:', error)
    const message = error instanceof Error ? error.message : 'Failed to process request'
    return NextResponse.json(
      {
        success: false,
        error: message,
        details: process.env.NODE_ENV !== 'production' ? error : undefined
      },
      { status: 500 }
    )
  }
}
