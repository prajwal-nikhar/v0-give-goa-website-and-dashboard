'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User } from '@supabase/supabase-js'
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import UserProfile from "@/components/user-profile"
import { getSupabaseClient } from "@/lib/supabase"

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false);
  const [authChecked, setAuthChecked] = React.useState(false);
  const pathname = usePathname()
  const [activeLink, setActiveLink] = React.useState(pathname)
  const [user, setUser] = React.useState<User | null>(null)
  const [isAdmin, setIsAdmin] = React.useState(false)
  const supabaseRef = React.useRef(getSupabaseClient())

  React.useEffect(() => {
    setIsMounted(true);
    const supabase = supabaseRef.current;

    if (!supabase) {
      setAuthChecked(true);
      return;
    }

    const fetchUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setUser(data.user);
          setIsAdmin(data.user?.user_metadata?.role === 'admin');
        }
      } finally {
        setAuthChecked(true);
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.user_metadata?.role === 'admin');
      setAuthChecked(true);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "Impact Dashboard", href: "/dashboard" },
    { name: "About SLRI", href: "/about" },
    isAdmin
      ? { name: "Admin Dashboard", href: "/admin" }
      : { name: "Submit Project", href: "/submit-project" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" onClick={() => setActiveLink("/")}>
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">S</span>
            </div>
            <span className="text-xl font-bold text-foreground">SLRI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setActiveLink(item.href)}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  activeLink === item.href ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {isMounted && (
              <>
                {!user && <Button asChild className="hidden md:flex" size="sm">
                  <Link href="/admin-login">Admin Login</Link>
                </Button>}
                <UserProfile />

                {/* Mobile Menu */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild className="md:hidden">
                    <Button variant="ghost" size="icon" aria-label="Menu">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <div className="flex flex-col h-full">
                      <div className="px-6 py-6 border-b">
                        <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
                          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-xl font-bold text-primary-foreground">S</span>
                          </div>
                          <span className="text-2xl font-bold">SLRI</span>
                        </Link>
                      </div>

                      <nav className="flex flex-col px-6 py-6 gap-1 flex-1">
                        {navItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => {
                              setActiveLink(item.href)
                              setIsOpen(false)
                            }}
                            className={cn(
                              "text-lg font-medium transition-colors hover:text-primary hover:bg-muted px-4 py-3 rounded-lg",
                              activeLink === item.href ? "text-primary bg-primary/10" : "text-muted-foreground",
                            )}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </nav>

                      <div className="px-6 py-6 border-t mt-auto">
                        {user ? (
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 px-2">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-lg font-medium text-primary">{user.email?.[0].toUpperCase()}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user.email}</p>
                                {isAdmin && <p className="text-xs text-primary">Admin</p>}
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              className="w-full h-12 text-base"
                              onClick={async () => {
                                const supabase = supabaseRef.current;
                                if (supabase) {
                                  await supabase.auth.signOut();
                                  setIsOpen(false);
                                  window.location.href = '/';
                                }
                              }}
                            >
                              Sign Out
                            </Button>
                          </div>
                        ) : (
                          <Button asChild className="w-full h-12 text-base">
                            <Link href="/admin-login" onClick={() => setIsOpen(false)}>
                              Admin Login
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
