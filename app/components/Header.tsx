
'use client';

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@supabase/supabase-js";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ full_name: string | null, image_url: string | null, role: string | null } | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {

        const { data: userProfile } = await supabase
          .from('profiles')
          .select('full_name, image_url, role')
          .eq('id', user.id)
          .single();
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
    };

    fetchUserAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {

      fetchUserAndProfile();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();

    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex justify-between items-center p-4">
      <Link href="/" className="font-bold text-3xl font-tamil text-foreground">
      உலா
</Link>
        <div className="flex items-center space-x-4">
          {user && profile ? (
            <>

              {profile.role === 'Customer' && (
                <Link 
                  href="/driver-registration" 
                  className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Become a Driver
                </Link>
              )}
              <Link 
                href="/dashboard" 
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-destructive hover:opacity-90 text-destructive-foreground font-semibold py-2 px-4 rounded-md text-sm"
              >
                Logout
              </button>
              {/* This is the new user avatar */}
              <Link href="/account">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={profile.image_url || undefined} alt={profile.full_name || 'User Avatar'} />
                  <AvatarFallback>{profile.full_name?.charAt(0).toUpperCase() || 'A'}</AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-primary hover:opacity-90 text-primary-foreground font-semibold py-2 px-4 rounded-md text-sm"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}