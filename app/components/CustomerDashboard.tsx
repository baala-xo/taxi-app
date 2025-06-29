'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState, useCallback } from 'react';
import type { Ride, RecommendedDriver } from '@/types';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useDebouncedCallback } from 'use-debounce';
import type { LatLng } from 'leaflet';

export default function CustomerDashboard() {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // State for multi-stage booking flow
  const [stage, setStage] = useState<'location' | 'drivers'>('location');
  
  const [drivers, setDrivers] = useState<RecommendedDriver[]>([]);
  const [rideHistory, setRideHistory] = useState<Ride[]>([]);

  // State for forms and map
  const [pickup, setPickup] = useState('');
  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null);
  const [dropoff, setDropoff] = useState('');
  const [destinationCoords, setDestinationCoords] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([11.0168, 76.9558]);
  
  const [pickupSuggestions, setPickupSuggestions] = useState<any[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<any[]>([]);
  
  const [isBooking, setIsBooking] = useState(false);
  const [ratingRideId, setRatingRideId] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  // Dynamically import the Map component to ensure it only runs on the client-side
  const Map = dynamic(() => import('@/app/components/Map'), { 
    ssr: false 
  });
  
  // --- HELPER FUNCTIONS ---

  const getAddressFromCoords = async (lat: number, lon: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await response.json();
      return data.display_name || `Lat: ${lat.toFixed(4)}, Lng: ${lon.toFixed(4)}`;
    } catch (error) {
      console.error("Error fetching address:", error);
      return `Lat: ${lat.toFixed(4)}, Lng: ${lon.toFixed(4)}`;
    }
  };
  
  const getPlaceSuggestions = useDebouncedCallback(async (query: string, type: 'pickup' | 'dropoff') => {
    if (query.length < 3) {
      type === 'pickup' ? setPickupSuggestions([]) : setDropoffSuggestions([]);
      return;
    }
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=5`);
    const data = await response.json();
    type === 'pickup' ? setPickupSuggestions(data) : setDropoffSuggestions(data);
  }, 500);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
      const { data: historyData, error: historyError } = await supabase.from('rides').select('*').eq('customer_id', user.id).order('created_at', { ascending: false });
      if (historyError) console.error('Error fetching ride history:', historyError);
      else setRideHistory(historyData || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // --- EVENT HANDLERS ---

  const handleGetCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const coords: [number, number] = [latitude, longitude];
      setPickupCoords(coords);
      setMapCenter(coords);
      const address = await getAddressFromCoords(latitude, longitude);
      setPickup(address);
    }, (error) => {
      alert("Could not get your location. Please check browser permissions.");
    });
  };

  const handleMapClick = async (latlng: LatLng) => {
    const { lat, lng } = latlng;
    const coords: [number, number] = [lat, lng];
    setDestinationCoords(coords);
    const address = await getAddressFromCoords(lat, lng);
    setDropoff(address);
  };

  const selectSuggestion = (s: any, type: 'pickup' | 'dropoff') => {
    const coords: [number, number] = [parseFloat(s.lat), parseFloat(s.lon)];
    if (type === 'pickup') {
      setPickup(s.display_name);
      setPickupCoords(coords);
      setMapCenter(coords);
      setPickupSuggestions([]);
    } else {
      setDropoff(s.display_name);
      setDestinationCoords(coords);
      setDropoffSuggestions([]);
    }
  };

  const handleFindDrivers = async () => {
    setLoading(true);
    const {data} = await supabase.rpc('get_recommended_drivers');
    setDrivers(data || []);
    setLoading(false);
    setStage('drivers');
  }
  
  const handleConfirmBooking = async (driverId: string) => {
    if (!currentUserId || !driverId || !pickup || !dropoff) return alert('Please ensure location is set.');
    setIsBooking(true);
    const newRide = { customer_id: currentUserId, driver_id: driverId, status: 'booked' as const, pickup_location: pickup, dropoff_location: dropoff, price: Math.floor(Math.random() * 50) + 10 };
    const { error } = await supabase.from('rides').insert(newRide);
    if (error) { alert('Failed to book ride.'); console.error(error); } 
    else {
      alert('Ride booked successfully!');
      setStage('location'); setPickup(''); setDropoff(''); setPickupCoords(null); setDestinationCoords(null);
      fetchData();
    }
    setIsBooking(false);
  };

  const handleRatingSubmit = async () => { /* ... same as before ... */ };
  const handleDummyPayment = async (rideId: number) => { /* ... same as before ... */ };

  if (loading && !rideHistory.length) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div>
      {stage === 'location' && (
        <div>
          <h1 className="text-2xl font-bold text-foreground">Where would you like to go?</h1>
          <p className="mt-2 text-muted-foreground">Type an address or use the map to set your route.</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              <div className="relative">
                <label className="text-sm font-medium text-muted-foreground">Pickup Location</label>
                <div className="relative">
                  <input type="text" placeholder="Type pickup address..." value={pickup} onChange={(e) => { setPickup(e.target.value); getPlaceSuggestions(e.target.value, 'pickup'); }} className="mt-1 w-full p-3 pr-12 rounded-lg bg-input text-foreground border-border border"/>
                  <button onClick={handleGetCurrentLocation} title="Use my current location" className="absolute top-1/2 right-1 -translate-y-1/2 p-2 text-2xl text-muted-foreground hover:text-primary">📍</button>
                </div>
                {pickupSuggestions.length > 0 && (<div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg">{pickupSuggestions.map(s => <div key={s.place_id} onClick={() => selectSuggestion(s, 'pickup')} className="p-3 hover:bg-muted cursor-pointer text-sm">{s.display_name}</div>)}</div>)}
              </div>
              <div className="relative">
                <label className="text-sm font-medium text-muted-foreground">Destination</label>
                <input type="text" placeholder="Type or click map for destination" value={dropoff} onChange={(e) => { setDropoff(e.target.value); getPlaceSuggestions(e.target.value, 'dropoff'); }} className="mt-1 w-full p-3 rounded-lg bg-input text-foreground border-border border"/>
                {dropoffSuggestions.length > 0 && (<div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg">{dropoffSuggestions.map(s => <div key={s.place_id} onClick={() => selectSuggestion(s, 'dropoff')} className="p-3 hover:bg-muted cursor-pointer text-sm">{s.display_name}</div>)}</div>)}
              </div>
              <button onClick={handleFindDrivers} disabled={!pickup || !dropoff || loading} className="w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-lg transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Finding..." : "Find Available Drivers"}
              </button>
            </div>
            <div className="h-[350px] md:h-full w-full border-border border rounded-lg overflow-hidden">
              <Map center={mapCenter} pickup={pickupCoords} destination={destinationCoords} onMapClick={handleMapClick} />
            </div>
          </div>
        </div>
      )}
      {stage === 'drivers' && (
        <div>
          <div className="flex items-center gap-4 mb-2"><button onClick={() => setStage('location')} className="text-sm text-muted-foreground hover:text-foreground">← Back to Locations</button></div>
          <h1 className="text-2xl font-bold text-foreground">Recommended Drivers</h1>
          <p className="mt-2 text-muted-foreground">Our top drivers, sorted for you.</p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {drivers.map((driver) => (
              <div key={driver.id} className="border-border border rounded-lg shadow-lg overflow-hidden flex flex-col bg-card text-card-foreground">
                <div className="relative w-full aspect-square"><Image src="/default-driver.png" alt={driver.full_name || 'Driver'} fill className="object-cover" /></div>
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex items-center gap-2"><h3 className="font-bold text-lg">{driver.full_name || `Driver...`}</h3>{driver.is_verified && ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-blue-500"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>)}</div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1"><span className="font-bold text-yellow-400">{Number(driver.average_rating).toFixed(1)} ★</span><span>({driver.ride_count} rides)</span></div>
                  <div className="mt-4 flex-grow flex flex-col justify-end"><button onClick={() => handleConfirmBooking(driver.id)} disabled={isBooking} className="w-full bg-primary hover:opacity-90 text-primary-foreground font-bold py-2 px-4 rounded-md">{isBooking ? 'Booking...' : 'Book This Driver'}</button></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- THIS IS THE FULL, UNABBREVIATED RIDE HISTORY SECTION --- */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-foreground">My Ride History</h2>
        <div className="mt-6 space-y-4">
          {rideHistory.length > 0 ? rideHistory.map((ride) => (
            <div key={ride.id} className="p-4 bg-card border-border border rounded-lg">
              <div className="flex justify-between items-start">
                <div><p className="font-semibold text-card-foreground">Ride with Driver {ride.driver_id.substring(0,8)}</p><p className="text-sm text-muted-foreground">Status: <span className="font-medium capitalize">{ride.status}</span></p>{ride.rating && <p className="text-sm text-muted-foreground">You rated: <span className="text-yellow-400">{ride.rating} ★</span></p>}</div>
                <div className="text-right"><p className="font-bold text-lg text-foreground">${ride.price}</p>{ride.payment_status === 'paid' ? (<p className="text-sm font-semibold text-green-500">Paid</p>) : (<p className="text-sm font-semibold text-destructive">Payment Due</p>)}</div>
              </div>
              {ratingRideId !== ride.id && (
                <div className="mt-4 pt-4 border-t border-border flex justify-end space-x-3">
                  {ride.payment_status !== 'paid' && (<button onClick={() => handleDummyPayment(ride.id)} disabled={ride.status !== 'completed'} title={ride.status !== 'completed' ? 'Ride must be completed before payment' : 'Pay for this ride'} className="bg-primary hover:opacity-90 text-primary-foreground font-bold py-2 px-4 rounded-md disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed">Pay Now</button>)}
                  {ride.status === 'completed' && !ride.rating && (<button onClick={() => { setRatingRideId(ride.id); setRating(0); setFeedback(''); }} className="bg-secondary hover:opacity-90 text-secondary-foreground font-bold py-2 px-4 rounded-md">Rate Ride</button>)}
                </div>
              )}
              {ratingRideId === ride.id && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center space-x-1">{[1, 2, 3, 4, 5].map(star => (<button key={star} onClick={() => setRating(star)} className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-muted-foreground/50'}`}>★</button>))}</div>
                  <textarea placeholder="Leave feedback (optional)" onChange={(e) => setFeedback(e.target.value)} className="mt-4 w-full p-2 rounded-md bg-input text-foreground h-20"/>
                  <div className="mt-4 flex items-center justify-end space-x-2">
                    <button onClick={() => setRatingRideId(null)} className="text-sm text-muted-foreground">Cancel</button>
                    <button onClick={handleRatingSubmit} className="bg-primary hover:opacity-90 text-primary-foreground font-bold py-2 px-4 rounded-md">Submit Review</button>
                  </div>
                </div>
              )}
            </div>
          )) : <div className="p-8 text-center bg-card rounded-lg"><p className="text-muted-foreground">You have no past rides.</p></div>}
        </div>
      </div>
    </div>
  );
}