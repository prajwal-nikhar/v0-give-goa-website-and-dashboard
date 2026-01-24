import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return res
  }
  
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()

  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/admin-login', req.url))
    }

    const userRole = user.user_metadata?.role;

    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/admin-login', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*'],
}
