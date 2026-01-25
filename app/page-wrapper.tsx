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
    const projectDashboardRegex = /^\/admin\/dashboard\/(.+)/;
    const match = pathname.match(projectDashboardRegex);

    if (match) {
      const projectId = match[1];
      const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(projectId);

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
        setPageName(pathname.replace('/', '') || 'home');
      }
    } else {
      setPageName(pathname.replace('/', '') || 'home');
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
