'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User } from '@supabase/supabase-js'
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import UserProfile from "@/components/user-profile"
import { getSupabaseClient } from "@/lib/supabase"

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false);
  const pathname = usePathname()
  const [activeLink, setActiveLink] = React.useState(pathname)
  const [user, setUser] = React.useState<User | null>(null)
  const [isAdmin, setIsAdmin] = React.useState(false)
  const supabase = getSupabaseClient()

  React.useEffect(() => {
    setIsMounted(true);

    if (!supabase) return;

    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data) {
        setUser(data.user);
        setIsAdmin(data.user?.user_metadata?.role === 'admin');
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.user_metadata?.role === 'admin');
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

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
                  <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <div className="flex flex-col gap-6 mt-6">
                      <Link href="/" className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                          <span className="text-lg font-bold text-primary-foreground">S</span>
                        </div>
                        <span className="text-xl font-bold">SLRI</span>
                      </Link>

                      <nav className="flex flex-col gap-3">
                        {navItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => {
                              setActiveLink(item.href)
                              setIsOpen(false)
                            }}
                            className={cn(
                              "text-base font-medium transition-colors hover:text-primary py-2",
                              activeLink === item.href ? "text-primary" : "text-muted-foreground",
                            )}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </nav>

                      {!user && <div className="flex flex-col gap-3 mt-4 pt-6 border-t">
                        <Button asChild className="w-full">
                          <Link href="/admin-login" onClick={() => setIsOpen(false)}>
                            Admin Login
                          </Link>
                        </Button>
                      </div>}
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
