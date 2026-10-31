import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { type EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams, origin: internalOrigin } = new URL(request.url)
  // Behind Nginx/Cloudflare, request.url reflects the internal address (localhost:3000).
  // Rebuild the public origin from the forwarded headers instead.
  const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host')
  const origin = forwardedHost && !forwardedHost.startsWith('localhost')
    ? `https://${forwardedHost}`
    : internalOrigin
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  
  const defaultNext = type === 'recovery' ? '/admin/update-password' : '/admin/dashboard'
  const next = searchParams.get('redirect_to') || searchParams.get('next') || defaultNext

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Successfully authenticated via PKCE Code -> redirecting to destination
      return NextResponse.redirect(`${origin}${next}`)
    }
    
    // Fallback if there was an error with the code exchange
    return NextResponse.redirect(`${origin}/admin/login?error=Invalid_Login_Link`)
  }

  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }

    return NextResponse.redirect(`${origin}/admin/login?error=Invalid_Login_Link`)
  }

  // Fallback if there is no code or token_hash
  return NextResponse.redirect(`${origin}/admin/login`)
}
