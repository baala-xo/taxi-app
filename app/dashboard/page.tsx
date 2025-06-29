// app/dashboard/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DriverDashboard from "../components/DriverDashboard";
import CustomerDashboard from "../components/CustomerDashboard";

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch the user's profile to determine their role
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // This handles the brief moment after signup before the profile is created.
  if (error || !profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p className="text-muted-foreground">Loading your profile...</p>
      </div>
    );
  }

  // Render the correct dashboard based on the user's role
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="container mx-auto">
        {profile.role === "Driver" ? (
          <DriverDashboard />
        ) : (
          <CustomerDashboard />
        )}
      </div>
    </div>
  );
}