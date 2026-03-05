'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

export default function DashboardPage() {
  const powerBiUrl = process.env.NEXT_PUBLIC_POWERBI_EMBED_URL;

  return (
    <div className='min-h-screen bg-background'>
      <header className='border-b bg-card'>
        <div className='container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-10'>
          <div className='flex flex-col gap-3'>
            <div>
              <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>SLRI Live Dashboard</h1>
              <p className='text-base md:text-lg text-muted-foreground mt-3 leading-relaxed'>
                Real-time insights into community engagement projects led by GIM students
              </p>
            </div>
            <p className='text-sm md:text-base text-muted-foreground max-w-4xl leading-relaxed'>
              This dashboard provides real-time analytics on student initiatives contributing to sustainable 
              development across Goa and beyond. Data is updated automatically from the GiveGoa repository.
            </p>
          </div>
        </div>
      </header>

      <main className='container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-10'>
        {powerBiUrl ? (
          <Card className='mb-8'>
            <CardHeader className='pb-6'>
              <CardTitle className='text-xl'>Power BI Analytics</CardTitle>
              <CardDescription className='text-base'>
                Interactive dashboard with real-time project insights and analytics
              </CardDescription>
            </CardHeader>
            <CardContent className='pt-0'>
              <div className='w-full rounded-lg overflow-hidden border' style={{ height: '80vh' }}>
                <iframe
                  title="Power BI Dashboard"
                  width="100%"
                  height="100%"
                  src={powerBiUrl}
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className='mb-8'>
            <CardContent className='py-20 text-center'>
              <p className='text-muted-foreground'>Power BI dashboard not configured.</p>
            </CardContent>
          </Card>
        )}

        <div className='mt-8 p-5 bg-muted/50 rounded-lg border'>
          <p className='text-sm text-muted-foreground text-center flex items-center justify-center gap-2'>
            <Calendar className='h-4 w-4 flex-shrink-0' />
            <span>Dashboard updated in real-time | Data sourced from GiveGoa Repository</span>
          </p>
        </div>
      </main>
    </div>
  )
}
