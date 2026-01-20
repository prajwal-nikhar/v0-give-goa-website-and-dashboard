'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Users, Target, TrendingUp, Globe } from "lucide-react"
import { useEffect, useState } from "react"
import { createBrowserClient } from '@supabase/ssr'
import { User } from "@supabase/supabase-js"

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data) {
        setUser(data.user);
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 lg:py-28 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Community Impact Through Student Action
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              SLRI connects GIM students with community engagement projects that drive sustainable development across
              Goa and beyond.
            </p>
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button asChild size="lg">
                  <Link href="/student-login">
                    Student Login <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/admin-login">Admin Login</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 lg:py-20 border-b">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center space-y-2">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">156</div>
              <div className="text-sm md:text-base text-muted-foreground">Total Projects</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">2,847</div>
              <div className="text-sm md:text-base text-muted-foreground">Students Engaged</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">89</div>
              <div className="text-sm md:text-base text-muted-foreground">Partner Organizations</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">17</div>
              <div className="text-sm md:text-base text-muted-foreground">SDG Goals Addressed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Driving Real Impact</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform connects students with meaningful community engagement opportunities aligned with the UN
              Sustainable Development Goals.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Student-Led Projects</CardTitle>
                <CardDescription>Empowering GIM students to lead community engagement initiatives</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Target className="h-10 w-10 text-primary mb-2" />
                <CardTitle>SDG Aligned</CardTitle>
                <CardDescription>Every project contributes to UN Sustainable Development Goals</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Real-Time Tracking</CardTitle>
                <CardDescription>Live dashboard with insights and analytics on project impact</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Pan-India Reach</CardTitle>
                <CardDescription>Projects spanning across Goa, Maharashtra, Karnataka, and beyond</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-primary/5">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Get Involved Today</h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Whether you're a student looking to make an impact or an organization seeking to partner with GIM, we'd
              love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button asChild size="lg">
                <Link href="/projects">Browse Projects</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/about">Learn More About SLRI</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
