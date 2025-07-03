
export type Profile = {
  id: string;
  full_name: string | null;
  role: 'Driver' | 'Customer';
  is_available: boolean;
  image_url: string | null; 
  is_verified: boolean;
};


export type Ride = {
id: number;
created_at: string;
customer_id: string;
driver_id: string;
status: 'booked' | 'completed' | 'cancelled';
pickup_location?: string;
dropoff_location?: string;
price?: number;
rating?: number;
feedback?: string;
payment_status?: string;
profiles: {
  full_name: string | null;
} | null;
};
export type RecommendedDriver = {
  id: string;
  full_name: string | null;
  image_url: string | null;
  average_rating: number;
  ride_count: number;
  is_verified: boolean;
};