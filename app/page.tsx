"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Script from "next/script";
import { ArrowRight, Users, Target, TrendingUp, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabase";

interface Stats {
  totalProjects: number;
  studentsEngaged: number;
  partnerOrgs: number;
  sdgGoals: number;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    studentsEngaged: 0,
    partnerOrgs: 0,
    sdgGoals: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseClient();

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (userData) {
        setUser(userData.user);
      }

      const { count: projectCount } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved");

      const { data: projects } = await supabase
        .from("projects")
        .select("student_names, organization_name, sdg, group_no")
        .eq("status", "approved");

      let studentsCount = 0;
      const orgsSet = new Set<string>();
      const sdgSet = new Set<string>();

      if (projects) {
        projects.forEach((p) => {
          // Count students from student_names array or estimate 4 per group if group_no exists
          if (p.student_names && Array.isArray(p.student_names)) {
            studentsCount += p.student_names.length;
          } else if (p.group_no) {
            studentsCount += 4; // Average group size for bulk uploaded projects
          }
          if (p.organization_name) {
            orgsSet.add(p.organization_name);
          }
          // Parse SDG field which may contain multiple goals (e.g., "SDG 1, SDG 4")
          if (p.sdg) {
            const sdgMatches = p.sdg.match(/SDG\s*\d+/gi);
            if (sdgMatches) {
              sdgMatches.forEach((s: string) =>
                sdgSet.add(s.toUpperCase().replace(/\s+/g, " ")),
              );
            } else {
              sdgSet.add(p.sdg);
            }
          }
        });
      }

      setStats({
        totalProjects: projectCount || 0,
        studentsEngaged: studentsCount || 0,
        partnerOrgs: orgsSet.size || 0,
        sdgGoals: sdgSet.size || 0,
      });

      setLoading(false);
    };

    fetchData();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

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
              SLRI connects GIM students with community engagement projects that
              drive sustainable development across Goa and beyond.
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
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
                {loading ? "..." : stats.totalProjects}
              </div>
              <div className="text-sm md:text-base text-muted-foreground">
                Total Projects
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
                {loading ? "..." : stats.studentsEngaged.toLocaleString()}
              </div>
              <div className="text-sm md:text-base text-muted-foreground">
                Students Engaged
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
                {loading ? "..." : stats.partnerOrgs}
              </div>
              <div className="text-sm md:text-base text-muted-foreground">
                Partner Organizations
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
                {loading ? "..." : stats.sdgGoals}
              </div>
              <div className="text-sm md:text-base text-muted-foreground">
                SDG Goals Addressed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Driving Real Impact
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform connects students with meaningful community
              engagement opportunities aligned with the UN Sustainable
              Development Goals.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <Target className="h-10 w-10 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">SDG Alignment</CardTitle>
                <CardDescription className="text-sm">
                  Projects mapped to UN Sustainable Development Goals
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <Users className="h-10 w-10 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Student-Led</CardTitle>
                <CardDescription className="text-sm">
                  Empowering students to drive community change
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <TrendingUp className="h-10 w-10 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Measurable Impact</CardTitle>
                <CardDescription className="text-sm">
                  Track and showcase real community outcomes
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <Globe className="h-10 w-10 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Community Focus</CardTitle>
                <CardDescription className="text-sm">
                  Building partnerships across Goa and beyond
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-primary/5">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Make an Impact?
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Join our community of changemakers and contribute to sustainable
              development through meaningful projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/projects">
                  Explore Projects <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              {user && (
                <Button asChild variant="outline" size="lg">
                  <Link href="/submit-project">Submit Your Project</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* ================= HIT COUNTER ================= */}
      <section className="py-8 flex justify-center">
        <div
          className="powr-hit-counter"
          id="ff6cf6f6_1772220324"
        ></div>

        <Script
          src="https://www.powr.io/powr.js?platform=html"
          strategy="afterInteractive"
        />
      </section>
    </div>
  );
}
