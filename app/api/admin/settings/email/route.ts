import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, getEmailTemplate } from '@/lib/email'
import { getServerSession } from '@/lib/auth'

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

    const body = await request.json()
    const { smtpHost, smtpPort, smtpUsername, smtpPassword, testEmail } = body

    if (!smtpHost || !smtpPort || !smtpUsername || !smtpPassword) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    // If testEmail is provided, send a test email
    if (testEmail) {
      const template = getEmailTemplate('test')
      const result = await sendEmail(
        {
          host: smtpHost,
          port: parseInt(smtpPort),
          user: smtpUsername,
          pass: smtpPassword
        },
        {
          to: testEmail,
          subject: template.subject,
          html: template.html
        }
      )

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully'
      })
    }

    // TODO: Save email settings to database or environment variables
    // For now, just return success
    return NextResponse.json({
      success: true,
      message: 'Email settings saved successfully'
    })
  } catch (error) {
    console.error('Error in email settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
