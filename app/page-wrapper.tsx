'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import Preloads from './preload/preload';
import { Analytics } from '@vercel/analytics/next';
import { createClient } from '@supabase/supabase-js';

export default function PageWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [pageName, setPageName] = useState('');

  useEffect(() => {
    setIsLoading(true);

    const projectDashboardRegex = /^\/admin\/dashboard\/(.+)/;
    const match = pathname.match(projectDashboardRegex);

    if (match) {
      const projectId = match[1];
      const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(projectId);

      if (isUUID) {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const fetchProjectTitle = async () => {
          const { data: project } = await supabase
            .from('projects')
            .select('title')
            .eq('id', projectId)
            .single();

          if (project) {
            setPageName(project.title);
          } else {
            setPageName('Project'); // Fallback
          }
        };

        fetchProjectTitle();
      } else {
        setPageName(pathname.replace('/', '') || 'home');
      }
    } else {
      setPageName(pathname.replace('/', '') || 'home');
    }
  }, [pathname]);

  const handlePreloadComplete = () => {
    setIsLoading(false);
  };

  return (
    <AnimatePresence mode='wait'>
      {isLoading ? (
        <Preloads
          pageName={pageName}
          onComplete={handlePreloadComplete}
        />
      ) : (
        <>
          <main className='min-h-screen'>{children}</main>
          <Analytics />
        </>
      )}
    </AnimatePresence>
  );
}
