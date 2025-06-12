
# Taxi Booking System

A full-stack taxi booking platform built using Next.js and Supabase, developed as part of a technical assessment. This project demonstrates modern full-stack development with real-time interactions, role-based access, and server-side automation.

## Features

- **Authentication**  
  Users can sign up and log in without a password using Supabase magic links.

- **Role-Based Access Control**  
  Distinct interfaces and capabilities for customers and drivers, based on user roles.

- **Driver Dashboard**  
  Drivers can:
  - View total earnings
  - Manage current bookings
  - Browse ride history with customer feedback
  - Toggle their availability status

- **Customer Dashboard**  
  Customers can:
  - Book rides
  - View their ride history
  - Rate and provide feedback on rides
  - Simulate payments with a dummy system

- **Driver Recommendation Engine**  
  Ranks drivers based on a calculated score derived from their average rating and number of completed rides.

- **Database Automation**  
  Uses PostgreSQL triggers to auto-create user profiles and RPC functions for efficient backend computations.

## Tech Stack

- **Framework:** Next.js (App Router)  
- **Backend:** Supabase  
- **Database:** PostgreSQL  
- **Styling:** Tailwind CSS  
- **Language:** TypeScript

## Getting Started (Local Development)

### 1. Clone the Repository

```bash
git clone https://github.com/baala-xo/taxi-app.git
cd taxi-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

- Create a new project on [Supabase](https://supabase.com).
- In the project root, create a `.env.local` file and add the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Set Up the Database Schema

- Go to your Supabase projectâ€™s SQL Editor.
- Run the SQL commands from the `schema.sql` file to set up the database (tables, functions, and policies).

### 5. Start the Development Server

```bash
npm run dev
```

Open your browser and go to [http://localhost:3000](http://localhost:3000).

## Testing the Application

To fully test the app, use two separate browser windows or tabs to simulate a customer and a driver.

| Driver Workflow                                      | Customer Workflow                                     |
| --------------------------------------------------- | ---------------------------------------------------- |
| 1. Sign up with a new email.                        | 1. Sign up with a different email address.           |
| 2. Choose the "Driver" role.                        | 2. Choose the "Customer" role.                       |
| 3. Enable "Available for Hire" from the dashboard.  | 3. The available driver will appear on your screen.  |
| 4. Wait for a booking to appear.                    | 4. Click "Book Now" to confirm a ride.               |
| 5. After the ride appears, mark it as complete.     | 5. Once completed, refresh the dashboard.            |
| 6. View updated earnings and average rating.        | 6. Go to "Ride History" to pay and rate the trip.    |

## Repository

You can find the full project source code here:  
[https://github.com/baala-xo/taxi-app/tree/main](https://github.com/baala-xo/taxi-app/tree/main)