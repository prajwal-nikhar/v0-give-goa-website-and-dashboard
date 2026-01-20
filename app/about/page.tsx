import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Quote, Target, Heart, TrendingUp, Users, Globe, Award, Lightbulb } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 lg:py-28 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="text-sm">
              About SLRI
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Empowering Students to Create Lasting Impact
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty">
              SLRI is GIM's flagship community engagement platform connecting students with meaningful projects that
              drive sustainable development and social change.
            </p>
          </div>
        </div>
      </section>

      {/* What is SLRI */}
      <section className="py-12 md:py-16 lg:py-20 border-b">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">What is SLRI?</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  SLRI is a transformative initiative by Goa Institute of Management (GIM) that bridges the gap
                  between academic learning and real-world social impact. We believe that true education extends beyond
                  classrooms and into communities.
                </p>
                <p>
                  Our platform connects GIM students with community engagement opportunities across Goa and beyond,
                  enabling them to lead projects that address pressing social, environmental, and economic challenges
                  aligned with the UN Sustainable Development Goals.
                </p>
                <p>
                  Through SLRI, students don't just learn about sustainable development, they actively contribute to
                  it, gaining practical experience while making a meaningful difference in the lives of others.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/gim-students-community.jpg"
                alt="GIM students working with community"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-12 md:py-16 lg:py-20 border-b bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <Card className="bg-background">
              <CardHeader>
                <Target className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed">
                To create a generation of socially conscious leaders who actively contribute to sustainable development
                and positive social change through meaningful community engagement.
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardHeader>
                <Heart className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed">
                To provide GIM students with structured opportunities to engage with communities, develop leadership
                skills, and implement projects that create measurable impact aligned with the UN Sustainable Development
                Goals.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-12 md:py-16 lg:py-20 border-b">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-10 md:mb-12 text-center">Our Journey</h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
                    1
                  </div>
                  <div className="w-0.5 h-full bg-border mt-2" />
                </div>
                <div className="pb-8">
                  <div className="text-sm text-muted-foreground mb-1">2018</div>
                  <h3 className="text-xl font-semibold mb-2">The Beginning</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    SLRI was launched as a pilot initiative with 20 students working on 5 community projects in rural
                    Goa, focusing on education and environmental conservation.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="w-0.5 h-full bg-border mt-2" />
                </div>
                <div className="pb-8">
                  <div className="text-sm text-muted-foreground mb-1">2019-2020</div>
                  <h3 className="text-xl font-semibold mb-2">Rapid Growth</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    The initiative expanded to include 50+ projects across multiple sectors, partnering with 25+ NGOs
                    and government organizations. Over 200 students participated in community engagement activities.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="w-0.5 h-full bg-border mt-2" />
                </div>
                <div className="pb-8">
                  <div className="text-sm text-muted-foreground mb-1">2021-2022</div>
                  <h3 className="text-xl font-semibold mb-2">Digital Transformation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Launch of the SLRI digital platform for project tracking, impact measurement, and stakeholder
                    engagement. Introduction of data-driven reporting for accreditation purposes.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
                    4
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">2023-Present</div>
                  <h3 className="text-xl font-semibold mb-2">Pan-India Impact</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    SLRI now coordinates 150+ active projects across multiple states with 89 partner organizations,
                    engaging over 2,800 students and impacting thousands of lives across communities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Highlights */}
      <section className="py-12 md:py-16 lg:py-20 border-b bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Impact by the Numbers</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Measurable outcomes from our community engagement initiatives over the past 6 years
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
            <Card className="bg-background text-center">
              <CardContent className="pt-6">
                <TrendingUp className="h-10 w-10 text-primary mx-auto mb-4" />
                <div className="text-4xl font-bold text-primary mb-2">156</div>
                <div className="text-sm text-muted-foreground">Total Projects Completed</div>
              </CardContent>
            </Card>

            <Card className="bg-background text-center">
              <CardContent className="pt-6">
                <Users className="h-10 w-10 text-primary mx-auto mb-4" />
                <div className="text-4xl font-bold text-primary mb-2">2,847</div>
                <div className="text-sm text-muted-foreground">Students Engaged</div>
              </CardContent>
            </Card>

            <Card className="bg-background text-center">
              <CardContent className="pt-6">
                <Globe className="h-10 w-10 text-primary mx-auto mb-4" />
                <div className="text-4xl font-bold text-primary mb-2">89</div>
                <div className="text-sm text-muted-foreground">Partner Organizations</div>
              </CardContent>
            </Card>

            <Card className="bg-background text-center">
              <CardContent className="pt-6">
                <Award className="h-10 w-10 text-primary mx-auto mb-4" />
                <div className="text-4xl font-bold text-primary mb-2">45,000+</div>
                <div className="text-sm text-muted-foreground">Lives Directly Impacted</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <Card className="bg-background">
              <CardHeader>
                <Lightbulb className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Innovation</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                25+ innovative solutions developed by students addressing local community challenges
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardHeader>
                <Target className="h-8 w-8 text-primary mb-2" />
                <CardTitle>SDG Alignment</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Projects contributing to all 17 UN Sustainable Development Goals
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardHeader>
                <Award className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Recognition</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                8 national awards and recognition for excellence in community engagement
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Student Stories */}
      <section className="py-12 md:py-16 lg:py-20 border-b">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Student Stories</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from students who have been transformed through their SLRI experience
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <Card className="bg-background">
              <CardHeader>
                <div className="h-20 w-20 rounded-full bg-muted mx-auto mb-4 overflow-hidden">
                  <img src="/student-priya.jpg" alt="Priya Sharma" className="w-full h-full object-cover" />
                </div>
                <CardTitle className="text-center">Priya Sharma</CardTitle>
                <CardDescription className="text-center">MBA 2024 | Rural Education Initiative</CardDescription>
              </CardHeader>
              <CardContent>
                <Quote className="h-6 w-6 text-primary mb-2" />
                <p className="text-muted-foreground italic leading-relaxed">
                  "Leading the Rural Education Initiative taught me more about leadership and empathy than any textbook
                  ever could. Seeing the impact we made on children's lives was truly transformational."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardHeader>
                <div className="h-20 w-20 rounded-full bg-muted mx-auto mb-4 overflow-hidden">
                  <img src="/student-rahul.jpg" alt="Rahul Desai" className="w-full h-full object-cover" />
                </div>
                <CardTitle className="text-center">Rahul Desai</CardTitle>
                <CardDescription className="text-center">MBA 2023 | Sustainable Farming Project</CardDescription>
              </CardHeader>
              <CardContent>
                <Quote className="h-6 w-6 text-primary mb-2" />
                <p className="text-muted-foreground italic leading-relaxed">
                  "Working with local farmers opened my eyes to the challenges of sustainable agriculture. This
                  experience shaped my career path towards social entrepreneurship."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardHeader>
                <div className="h-20 w-20 rounded-full bg-muted mx-auto mb-4 overflow-hidden">
                  <img src="/student-ananya.jpg" alt="Ananya Verma" className="w-full h-full object-cover" />
                </div>
                <CardTitle className="text-center">Ananya Verma</CardTitle>
                <CardDescription className="text-center">MBA 2024 | Women's Empowerment Initiative</CardDescription>
              </CardHeader>
              <CardContent>
                <Quote className="h-6 w-6 text-primary mb-2" />
                <p className="text-muted-foreground italic leading-relaxed">
                  "Empowering women in rural communities taught me the true meaning of resilience and determination. The
                  relationships I built continue to inspire me every day."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partner Testimonials */}
      <section className="py-12 md:py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Partners Say</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Testimonials from our partner organizations and faculty mentors
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            <Card className="bg-background">
              <CardHeader>
                <CardTitle>Dr. Sunita Rao</CardTitle>
                <CardDescription>Faculty Coordinator, GIM</CardDescription>
              </CardHeader>
              <CardContent>
                <Quote className="h-6 w-6 text-primary mb-2" />
                <p className="text-muted-foreground italic leading-relaxed">
                  "SLRI has transformed how we approach experiential learning at GIM. Students don't just study
                  sustainable development—they actively create it. The growth I've witnessed in our students through
                  these projects is remarkable."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardHeader>
                <CardTitle>Maria Fernandes</CardTitle>
                <CardDescription>Director, Education for All Foundation</CardDescription>
              </CardHeader>
              <CardContent>
                <Quote className="h-6 w-6 text-primary mb-2" />
                <p className="text-muted-foreground italic leading-relaxed">
                  "Partnering with GIM through SLRI has been transformative for our organization. The students bring
                  fresh perspectives, innovative solutions, and genuine commitment to making a difference in our
                  communities."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
