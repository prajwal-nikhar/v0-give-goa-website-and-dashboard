'use client'

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/lib/supabase';

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = getSupabaseClient();

  useEffect(() => {
    if (!supabase) return;
    
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

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (!user) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" alt={user.email ?? ''} />
            <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end" forceMount>
        <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium leading-none">{user.user_metadata.full_name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
        </div>
        <div className="mt-2 space-y-2">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>Logout</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
