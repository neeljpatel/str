import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // if "redirect_to" or "next" is in param, use it as the redirect payload
  const next = searchParams.get('redirect_to') || searchParams.get('next') || '/admin/dashboard'

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

  // Fallback if there is no code
  return NextResponse.redirect(`${origin}/admin/login`)
}
