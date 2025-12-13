import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, serviceType, budget, timeline, description } = body

    // 1. Send email notification
    if (process.env.RESEND_API_KEY && process.env.NOTIFICATION_EMAIL) {
      try {
        await resend.emails.send({
          from: 'Portfolio Notifications <onboarding@resend.dev>', // Resend test domain
          to: process.env.NOTIFICATION_EMAIL,
          replyTo: email,
          subject: `New Service Request: ${serviceType}`,
          html: `
            <h2>New Service Request from ${name}</h2>

            <h3>Contact Information:</h3>
            <ul>
              <li><strong>Name:</strong> ${name}</li>
              <li><strong>Email:</strong> ${email}</li>
            </ul>

            <h3>Project Details:</h3>
            <ul>
              <li><strong>Service Type:</strong> ${serviceType}</li>
              <li><strong>Budget:</strong> ${budget}</li>
              <li><strong>Timeline:</strong> ${timeline}</li>
            </ul>

            <h3>Description:</h3>
            <p>${description}</p>

            <hr />
            <p style="color: #666; font-size: 12px;">
              Submitted from your portfolio website.
              Reply to this email to contact ${name} directly.
            </p>
          `
        })
      } catch (emailError) {
        console.error('Email send failed:', emailError)
        // Don't fail the whole request if email fails
      }
    }

    // 2. Generate WhatsApp message URL (opens WhatsApp Web/App with pre-filled message)
    let whatsappUrl = null
    if (process.env.WHATSAPP_NUMBER) {
      const whatsappMessage = `*New Service Request*\n\n*From:* ${name}\n*Email:* ${email}\n*Service:* ${serviceType}\n*Budget:* ${budget}\n*Timeline:* ${timeline}\n\n*Description:*\n${description}`
      const encodedMessage = encodeURIComponent(whatsappMessage)
      whatsappUrl = `https://wa.me/${process.env.WHATSAPP_NUMBER}?text=${encodedMessage}`
    }

    return NextResponse.json({
      success: true,
      message: 'Notification sent',
      whatsappUrl
    })
  } catch (error) {
    console.error('Notification error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}
