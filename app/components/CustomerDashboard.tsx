// app/components/CustomerDashboard.tsx
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState, useCallback } from 'react';
import type { Ride, RecommendedDriver } from '@/types';

export default function CustomerDashboard() {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const [drivers, setDrivers] = useState<RecommendedDriver[]>([]);
  const [rideHistory, setRideHistory] = useState<Ride[]>([]);

  // State for forms
  const [bookingDriverId, setBookingDriverId] = useState<string | null>(null);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [ratingRideId, setRatingRideId] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  // --- DATA FETCHING ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
      
      const [driversRes, historyRes] = await Promise.all([
        supabase.rpc('get_recommended_drivers'),
        supabase.from('rides').select('*').eq('customer_id', user.id).order('created_at', { ascending: false })
      ]);

      if (driversRes.error) console.error('Error fetching recommended drivers:', driversRes.error);
      else setDrivers(driversRes.data || []);

      if (historyRes.error) console.error('Error fetching ride history:', historyRes.error);
      else setRideHistory(historyRes.data || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // --- LOGIC HANDLERS ---
  const handleConfirmBooking = async () => {
    if (!currentUserId || !bookingDriverId || !pickup || !dropoff) return;
    setIsBooking(true);
    const newRide = { customer_id: currentUserId, driver_id: bookingDriverId, status: 'booked' as const, pickup_location: pickup, dropoff_location: dropoff, price: Math.floor(Math.random() * 50) + 10 };
    const { error } = await supabase.from('rides').insert(newRide);
    if (error) { alert('Failed to book ride.'); console.error(error); }
    else { alert('Ride booked successfully!'); setBookingDriverId(null); setPickup(''); setDropoff(''); fetchData(); }
    setIsBooking(false);
  };

  const handleRatingSubmit = async () => {
    if (rating === 0 || !ratingRideId) return alert('Please select a star rating.');
    const { error } = await supabase.from('rides').update({ rating, feedback }).eq('id', ratingRideId);
    if (error) alert('Failed to submit review.');
    else { alert('Review submitted successfully!'); setRatingRideId(null); fetchData(); }
  };
  
  // --- DUMMY PAYMENT LOGIC IS HERE ---
  const handleDummyPayment = async (rideId: number) => {
    const { error } = await supabase.from('rides').update({ payment_status: 'paid' }).eq('id', rideId);
    if (error) {
      alert('Payment failed.');
    } else {
      alert('Payment successful!');
      fetchData();
    }
  };

  if (loading) return <div className="p-8 text-center">Finding best drivers...</div>;

  return (
    <div>
      {/* Section 1: Book a Ride */}
      <h1 className="text-2xl font-bold">Recommended Drivers</h1>
      <p className="mt-2 text-gray-500">Our top drivers, sorted just for you.</p>
      <div className="mt-6 space-y-4">
        {drivers.length > 0 ? drivers.map((driver) => (
          <div key={driver.id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-lg">Driver {driver.id.substring(0, 8)}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="font-bold text-yellow-400">{Number(driver.average_rating).toFixed(1)} ★</span>
                  <span>({driver.ride_count} rides)</span>
                </div>
              </div>
              {bookingDriverId !== driver.id && (<button onClick={() => setBookingDriverId(driver.id)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Book Now</button>)}
            </div>
            {bookingDriverId === driver.id && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-4">
                  <input type="text" placeholder="Enter Pickup Location" value={pickup} onChange={(e) => setPickup(e.target.value)} className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700"/>
                  <input type="text" placeholder="Enter Dropoff Location" value={dropoff} onChange={(e) => setDropoff(e.target.value)} className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700"/>
                </div>
                <div className="mt-4 flex items-center justify-end space-x-2">
                  <button onClick={() => setBookingDriverId(null)} className="text-gray-500 hover:text-gray-400">Cancel</button>
                  <button onClick={handleConfirmBooking} disabled={isBooking} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">{isBooking ? 'Booking...' : 'Confirm Booking'}</button>
                </div>
              </div>
            )}
          </div>
        )) : <div className="p-8 text-center bg-gray-100 dark:bg-gray-800 rounded-lg"><p>No drivers are available right now.</p></div>}
      </div>
      
      {/* Section 2: Ride History */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold">My Ride History</h2>
        <div className="mt-6 space-y-4">
          {rideHistory.length > 0 ? rideHistory.map((ride) => (
            <div key={ride.id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">Ride with Driver {ride.driver_id.substring(0,8)}</p>
                  <p className="text-sm">Status: <span className="font-medium capitalize">{ride.status}</span></p>
                  {ride.rating && <p className="text-sm">You rated: {ride.rating} ★</p>}
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${ride.price}</p>
                  {ride.payment_status === 'paid' ? 
                    (<p className="text-sm font-semibold text-green-500">Paid</p>) : 
                    (<p className="text-sm font-semibold text-red-500">Payment Due</p>)
                  }
                </div>
              </div>

{ratingRideId !== ride.id && (
  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">

  
    {ride.payment_status !== 'paid' && (
      <button
        onClick={() => handleDummyPayment(ride.id)}
        // The button is disabled if the ride is not 'completed'
        disabled={ride.status !== 'completed'}
        // This title attribute creates the hover message
        title={ride.status !== 'completed' ? 'Ride must be completed before payment(driver has to mark this ride as completed in his dashboard)' : 'Pay for this ride'}
        // These styles make the button look disabled
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        Pay Now
      </button>
    )}

    {/* The "Rate Ride" button logic remains the same */}
    {ride.status === 'completed' && !ride.rating && (
      <button onClick={() => { setRatingRideId(ride.id); setRating(0); setFeedback(''); }} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">Rate Ride</button>
    )}
  </div>
)}
              {ratingRideId === ride.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-1">{[1, 2, 3, 4, 5].map(star => (<button key={star} onClick={() => setRating(star)} className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-400'}`}>★</button>))}</div>
                  <textarea placeholder="Leave feedback (optional)" onChange={(e) => setFeedback(e.target.value)} className="mt-4 w-full p-2 rounded bg-gray-200 dark:bg-gray-700 h-20"/>
                  <div className="mt-4 flex items-center justify-end space-x-2">
                    <button onClick={() => setRatingRideId(null)} className="text-gray-500">Cancel</button>
                    <button onClick={handleRatingSubmit} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Submit Review</button>
                  </div>
                </div>
              )}
            </div>
          )) : <div className="p-8 text-center bg-gray-100 dark:bg-gray-800 rounded-lg"><p>You have no past rides.</p></div>}
        </div>
      </div>
    </div>
  );
}