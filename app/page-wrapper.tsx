'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import Preloads from './preload/preload';
import { Analytics } from '@vercel/analytics/next';
import { getSupabaseClient } from '@/lib/supabase';

export default function PageWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [pageName, setPageName] = useState('');
  const supabase = getSupabaseClient();

  useEffect(() => {
    // Reset loading state on every page navigation
    setIsLoading(true);
    
    const projectDashboardRegex = /^\/admin\/dashboard\/(.+)/;
    const projectDetailRegex = /^\/projects\/(.+)/;
    const adminProjectRegex = /^\/admin\/projects\/(.+)/;
    
    const dashboardMatch = pathname.match(projectDashboardRegex);
    const projectMatch = pathname.match(projectDetailRegex);
    const adminProjectMatch = pathname.match(adminProjectRegex);

    // Get a readable page name from the path
    const getPageName = (path: string) => {
      const segments = path.split('/').filter(Boolean);
      if (segments.length === 0) return 'home';
      // Use the last meaningful segment, capitalize it
      const lastSegment = segments[segments.length - 1];
      // Skip UUID-like segments
      if (/^[0-9a-fA-F-]{36}$/.test(lastSegment)) {
        return segments.length > 1 ? segments[segments.length - 2] : 'project';
      }
      return lastSegment.replace(/-/g, ' ');
    };

    if (dashboardMatch || projectMatch || adminProjectMatch) {
      const projectId = dashboardMatch?.[1] || projectMatch?.[1] || adminProjectMatch?.[1];
      const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(projectId || '');

      if (isUUID && supabase) {
        const fetchProjectTitle = async () => {
          const { data: project } = await supabase
            .from('projects')
            .select('title')
            .eq('id', projectId)
            .single();

          if (project) {
            setPageName(project.title);
          } else {
            setPageName('Project');
          }
        };

        fetchProjectTitle();
      } else {
        setPageName(getPageName(pathname));
      }
    } else {
      setPageName(getPageName(pathname));
    }
  }, [pathname, supabase]);

  const handlePreloadComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && pageName && (
          <Preloads key="preload" pageName={pageName} onComplete={handlePreloadComplete} />
        )}
      </AnimatePresence>
      <main className='min-h-screen'>{children}</main>
      <Analytics />
    </>
  );
}
