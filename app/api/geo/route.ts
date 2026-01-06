import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const headerValue =
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-country')

  const country = headerValue?.trim()
  return NextResponse.json({
    ok: true,
    country: country ? country.toUpperCase() : null,
  })
}
