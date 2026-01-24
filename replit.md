# SLRI (Give Goa) - Community Impact Platform

## Overview
A Next.js 16 web application that connects GIM students with community engagement projects, enabling student-led initiatives aligned with UN Sustainable Development Goals.

## Project Architecture
- **Framework**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS 4, SCSS modules
- **UI Components**: Radix UI, shadcn/ui
- **Animation**: Framer Motion
- **Database/Auth**: Supabase (requires configuration)
- **Analytics**: Vercel Analytics

## Directory Structure
```
app/                    # Next.js App Router pages
  admin/               # Admin dashboard pages
  api/                 # API routes
  projects/            # Project listing and details
  dashboard/           # User dashboard
  preload/             # Loading animation components
components/            # Reusable UI components
  ui/                  # shadcn/ui components
lib/                   # Utilities and Supabase client
public/                # Static assets
styles/                # Global styles
```

## Development
- **Dev Server**: `npm run dev` (runs on port 5000)
- **Build**: `npm run build`
- **Start**: `npm run start`

## Environment Variables Required
The app uses Supabase for authentication and database. Set these environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Features
- Student project submissions
- Admin dashboard for project management
- Impact dashboard with statistics
- User authentication (via Supabase)
- Responsive design with dark mode support

## Notes
- The preload animation has been disabled for development stability
- Cross-origin requests are configured for Replit domains
- The app gracefully handles missing Supabase credentials
