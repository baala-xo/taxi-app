
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


  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  
  if (profile && !profile.role) {
    redirect('/select-role');
  }

  if (error || !profile) {

    redirect('/select-role');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-4xl">
        {profile.role === "Driver" ? (
          <DriverDashboard />
        ) : (
          <CustomerDashboard />
        )}
      </div>
    </main>
  );
}