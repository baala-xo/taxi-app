
export type Profile = {
    id: string;
    full_name: string | null;
    role: 'Driver' | 'Customer';
    is_available: boolean;
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
  };

  export type RecommendedDriver = {
    id: string;
    full_name: string | null;
    average_rating: number;
    ride_count: number;
    is_verified: boolean;
  };