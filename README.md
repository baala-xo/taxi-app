# 🚕 Taxi Booking System

A full-stack taxi booking platform built with Next.js and Supabase for a technical assessment.

## Features

- **Authentication:** Passwordless sign-up and login via magic links.
- **Role-Based Access Control:** Distinct portals and functionality for `Customer` and `Driver` roles.
- **Driver Dashboard:** Displays total earnings, current bookings, ride history with ratings, and an availability toggle.
- **Customer Dashboard:** Allows booking rides, viewing ride history, submitting ratings and feedback, and a dummy payment system.
- **Recommendation Engine:** Sorts available drivers based on a score calculated from their average rating and total number of completed rides.
- **Database Automation:** Utilizes PostgreSQL Triggers for automatic user profile creation and RPC Functions for efficient server-side calculations.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Backend-as-a-Service:** Supabase
- **Database:** Postgres
- **Styling:** Tailwind CSS
- **Language:** TypeScript

## Local Development Setup

1.  **Clone Repository**

    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Setup Environment Variables**

    - Create a new Supabase project.
    - Create a `.env.local` file in the project root.
    - Add your Supabase Project URL and Anon Key:

    ```
    NEXT_PUBLIC_SUPABASE_URL=YOUR_PROJECT_URL_HERE
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
    NEXT_PUBLIC_BASE_URL=http://localhost:3000
    ```

4.  **Setup Database Schema**

    - Navigate to the Supabase SQL Editor.
    - Execute the contents of the `schema.sql` file to create all necessary tables, functions, and policies.

5.  **Run Development Server**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Testing Workflow

To test the end-to-end functionality, use two browser windows to simulate a Driver and a Customer simultaneously.

| Driver Workflow (Browser 1)                                | Customer Workflow (Browser 2)                                |
| :--------------------------------------------------------- | :----------------------------------------------------------- |
| 1. Sign up for a new account.                              | 1. Sign up with a second, different email address.           |
| 2. Select the **"Driver"** role.                           | 2. Select the **"Customer"** role.                           |
| 3. From the dashboard, toggle **"Available for Hire"** ON. | 3. See the available Driver appear on the dashboard.         |
| 4. Wait for the booking to appear.                         | 4. Click **"Book Now"** and confirm the ride details.        |
| 5. Click **"Mark as Complete"** on the new booking.        | 5. After the ride is complete, refresh the dashboard.        |
| 6. Refresh to see updated earnings and rating.             | 6. In "Ride History", **"Pay Now"** and **"Rate"** the trip. |
