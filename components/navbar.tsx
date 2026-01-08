"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Impact Dashboard", href: "/dashboard" },
  { name: "Transport Requests", href: "/transport" },
  { name: "About GiveGoa", href: "/about" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [activeLink, setActiveLink] = React.useState("/")

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" onClick={() => setActiveLink("/")}>
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">G</span>
            </div>
            <span className="text-xl font-bold text-foreground">GiveGoa</span>
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
            <Button variant="ghost" size="icon" className="hidden md:flex" aria-label="Search">
              <Search className="h-5 w-5" />
            </Button>
            <Button asChild className="hidden md:flex" size="sm">
              <Link href="/admin">Admin Login</Link>
            </Button>

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
                      <span className="text-lg font-bold text-primary-foreground">G</span>
                    </div>
                    <span className="text-xl font-bold">GiveGoa</span>
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

                  <div className="flex flex-col gap-3 mt-4 pt-6 border-t">
                    <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                      <Search className="h-4 w-4" />
                      Search
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/admin" onClick={() => setIsOpen(false)}>
                        Admin Login
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
