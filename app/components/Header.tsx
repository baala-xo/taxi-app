// app/components/Header.tsx
'use client';

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { User } from "@supabase/supabase-js";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        // Fetch the user's role from the profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        setRole(profile?.role || null);
      } else {
        setRole(null);
      }
    };

    fetchUserAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      // Re-fetch everything when auth state changes (login/logout)
      fetchUserAndProfile();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Use a hard refresh to ensure all state is cleared across the app
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="font-bold text-xl text-foreground">
          TaxiApp
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* NEW: This link only appears if the logged-in user is a Customer */}
              {role === 'Customer' && (
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