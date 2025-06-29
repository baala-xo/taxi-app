// app/components/DriverDashboard.tsx
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState, useCallback, useMemo } from 'react';
import type { Ride } from '@/types';

export default function DriverDashboard() {
  const supabase = createClientComponentClient();
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [rides, setRides] = useState<Ride[]>([]);

  // --- LOGIC AND DATA FETCHING (UNCHANGED) ---
  const fetchDriverData = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
      const [profileResponse, ridesResponse] = await Promise.all([
        supabase.from('profiles').select('is_available').eq('id', user.id).single(),
        supabase.from('rides').select('*').eq('driver_id', user.id).order('created_at', { ascending: false }),
      ]);
      if (profileResponse.data) setIsAvailable(profileResponse.data.is_available);
      if (ridesResponse.data) setRides(ridesResponse.data);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchDriverData();
  }, [fetchDriverData]);

  const handleAvailabilityToggle = async () => {
    if (userId === null || isAvailable === null) return;
    const newStatus = !isAvailable;
    setIsAvailable(newStatus);
    const { error } = await supabase.from('profiles').update({ is_available: newStatus }).eq('id', userId);
    if (error) { setIsAvailable(!newStatus); alert('Failed to update status.'); }
  };

  const handleCompleteRide = async (rideId: number) => {
    const { error } = await supabase.from('rides').update({ status: 'completed' }).eq('id', rideId);
    if (error) alert('Could not update ride status.');
    else fetchDriverData();
  };
  
  const { totalEarnings, currentBookings, completedRides } = useMemo(() => {
    const completed = rides.filter(r => r.status === 'completed');
    const earnings = completed.reduce((sum, ride) => sum + (ride.price || 0), 0);
    const bookings = rides.filter(r => r.status === 'booked');
    return { totalEarnings: earnings, currentBookings: bookings, completedRides: completed };
  }, [rides]);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>;

  // --- JSX WITH THEME CLASSES APPLIED ---
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Driver Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="p-4 bg-card text-card-foreground border-border border rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Earnings</h3>
          <p className="text-3xl font-bold text-green-500">${totalEarnings.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-card text-card-foreground border-border border rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Availability</h3>
          <div className="flex items-center justify-between mt-2">
            <span className="font-medium">Available for Hire</span>
            <button onClick={handleAvailabilityToggle} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isAvailable ? 'bg-green-500' : 'bg-gray-500'}`}><span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isAvailable ? 'translate-x-6' : 'translate-x-1'}`}/></button>
          </div>
        </div>
      </div>

      {/* Section: Current Bookings */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-foreground">My Current Bookings</h2>
        <div className="mt-4 space-y-4">
          {currentBookings.length > 0 ? currentBookings.map((ride) => (
            <div key={ride.id} className="p-4 bg-card text-card-foreground border-border border rounded-lg flex items-center justify-between">
              <div>
                <p><b>From:</b> {ride.pickup_location} <b>To:</b> {ride.dropoff_location}</p>
                <p className="text-lg font-bold">${ride.price}</p>
              </div>
              <button onClick={() => handleCompleteRide(ride.id)} className="bg-primary hover:opacity-90 text-primary-foreground font-bold py-2 px-4 rounded-md">Mark as Complete</button>
            </div>
          )) : <div className="p-8 text-center bg-card border-border border rounded-lg"><p className="text-muted-foreground">You have no active bookings.</p></div>}
        </div>
      </div>

      {/* Section: Completed Ride History */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-foreground">Completed Ride History</h2>
        <div className="mt-4 space-y-4">
           {completedRides.length > 0 ? completedRides.map((ride) => (
            <div key={ride.id} className="p-4 bg-card text-card-foreground border-border border rounded-lg">
              <p><b>From:</b> {ride.pickup_location} <b>To:</b> {ride.dropoff_location}</p>
              <div className="mt-2 pt-2 border-t border-border flex justify-between items-center">
                <div className="flex items-baseline space-x-3">
                  <p className="text-lg font-bold text-green-500">${ride.price}</p>
                  {ride.payment_status === 'paid' ? 
                    (<span className="text-xs font-semibold px-2 py-1 bg-green-200 text-green-800 rounded-full">Paid</span>) : 
                    (<span className="text-xs font-semibold px-2 py-1 bg-red-200 text-red-800 rounded-full">Unpaid</span>)
                  }
                </div>
                <div>
                  <p className="font-semibold text-right">{ride.rating ? <span className="text-yellow-400">{ride.rating} ★</span> : 'Not rated'}</p>
                  <p className="text-sm text-muted-foreground text-right italic">{ride.feedback || 'No feedback'}</p>
                </div>
              </div>
            </div>
           )) : <div className="p-8 text-center bg-card border-border border rounded-lg"><p className="text-muted-foreground">You have no completed rides.</p></div>}
        </div>
      </div>
    </div>
  );
}