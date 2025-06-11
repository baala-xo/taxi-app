
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState, useCallback } from 'react';
import type { Ride, RecommendedDriver } from '@/types';
import Image from 'next/image';

export default function CustomerDashboard() {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const [drivers, setDrivers] = useState<RecommendedDriver[]>([]);
  const [rideHistory, setRideHistory] = useState<Ride[]>([]);

  const [bookingDriverId, setBookingDriverId] = useState<string | null>(null);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [ratingRideId, setRatingRideId] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');


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
  
  const handleDummyPayment = async (rideId: number) => {
    const { error } = await supabase.from('rides').update({ payment_status: 'paid' }).eq('id', rideId);
    if (error) { alert('Payment failed.'); }
    else { alert('Payment successful!'); fetchData(); }
  };

  if (loading) return <div className="p-8 text-center">Finding best drivers...</div>;

  return (
    <div>

      <h1 className="text-2xl font-bold">Recommended Drivers</h1>
      <p className="mt-2 text-gray-500">Our top drivers, sorted just for you.</p>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {drivers.length > 0 ? drivers.map((driver, index) => (
          <div key={driver.id} className="border rounded-lg shadow-lg overflow-hidden flex flex-col bg-gray-100 dark:bg-gray-800">
            <div className="relative w-full aspect-square">
              <Image src="/default-driver.png" alt={driver.full_name || 'Driver profile picture'} fill className="object-cover" sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" />
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="font-bold text-lg">{driver.full_name || `Driver ${driver.id.substring(0,6)}`}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                <span className="font-bold text-yellow-400">{Number(driver.average_rating).toFixed(1)} ★</span>
                <span>({driver.ride_count} rides)</span>
              </div>
              <div className="mt-4 flex-grow flex flex-col justify-end">
                {bookingDriverId !== driver.id && (<button onClick={() => setBookingDriverId(driver.id)} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors">Book Now</button>)}
              </div>
            </div>
            {bookingDriverId === driver.id && (
              <div className="p-4 border-t bg-gray-200 dark:bg-gray-900">
                <div className="space-y-2">
                  <input type="text" placeholder="Pickup Location" value={pickup} onChange={(e) => setPickup(e.target.value)} className="w-full p-2 rounded bg-white dark:bg-gray-700"/>
                  <input type="text" placeholder="Dropoff Location" value={dropoff} onChange={(e) => setDropoff(e.target.value)} className="w-full p-2 rounded bg-white dark:bg-gray-700"/>
                </div>
                <div className="mt-4 flex items-center justify-end space-x-2">
                  <button onClick={() => setBookingDriverId(null)} className="text-gray-500 text-sm">Cancel</button>
                  <button onClick={handleConfirmBooking} disabled={isBooking} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded text-sm disabled:bg-gray-400">{isBooking ? 'Booking...' : 'Confirm'}</button>
                </div>
              </div>
            )}
          </div>
        )) : <div className="col-span-full p-8 text-center bg-gray-100 dark:bg-gray-800 rounded-lg"><p>No drivers are available right now.</p></div>}
      </div>
      

      <div className="mt-16">
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
                  {ride.payment_status === 'paid' ? (<p className="text-sm font-semibold text-green-500">Paid</p>) : (<p className="text-sm font-semibold text-red-500">Payment Due</p>)}
                </div>
              </div>

              {ratingRideId !== ride.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                  {ride.payment_status !== 'paid' && (
                    <button onClick={() => handleDummyPayment(ride.id)} disabled={ride.status !== 'completed'} title={ride.status !== 'completed' ? 'Ride must be completed before payment' : 'Pay for this ride'} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500 disabled:cursor-not-allowed">Pay Now</button>
                  )}
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