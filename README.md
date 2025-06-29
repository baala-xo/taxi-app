# 🚕 Taxi Booking Platform

This is a feature-complete, full-stack taxi booking application built with a modern tech stack. It features role-based access for drivers and customers, a real-time booking system, an interactive map interface, and a data-driven recommendation engine to sort available drivers based on performance.

**Live Demo:** [https://taxi-app-steel.vercel.app/](https://taxi-app-steel.vercel.app/)

<br>

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

## Key Features

- **Role-Based Portals**: Separate dashboards for Customers (booking, history, rating) and Drivers (availability, earnings, ride management).
- **Google OAuth**: Secure user onboarding with Google Authentication.
- **New User Onboarding**: All users sign up as a "Customer" by default and have the option to register as a "Driver".
- **Interactive Map Booking**: Users can visually select pickup/destination points using the browser's Geolocation API and debounced address suggestions.
- **Driver Recommendation Engine**: A PostgreSQL RPC function scores and sorts available drivers based on their average rating, total rides, and verification status.
- **Complete Ride Lifecycle**: Full end-to-end flow from booking to completion, followed by a dummy payment simulation and a 5-star rating system.
- **Advanced Backend Logic**: Utilizes PostgreSQL Triggers for automatic profile creation on user signup.
- **Modern Theming**: A CSS variable-driven system integrated with Tailwind CSS for consistent light and dark modes.

## Tech Stack & Libraries

### **Frontend**
-   **Framework**: Next.js (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS (v4 engine)
-   **UI State**: React Hooks (`useState`, `useEffect`, `useCallback`)
-   **Animations**: `tailwindcss-animate`
-   **Utilities**: `clsx`, `tailwind-merge`, `use-debounce`

### **Backend & Database**
-   **Platform**: Supabase
-   **Authentication**: Supabase Auth (Google OAuth Provider)
-   **Database**: Postgres
-   **API**: Supabase Auto-generated RESTful API & custom RPC Functions (PL/pgSQL)

### **Mapping**
-   **Library**: Leaflet & React-Leaflet
-   **Geocoding API**: Nominatim (OpenStreetMap)
-   **Geospatial Utility**: Turf.js

### **Deployment**
-   **Platform**: Vercel

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
    -   You will need to create your own free Supabase project and set up a Google Cloud OAuth Client to get the necessary keys.
    -   Create a `.env.local` file in the project root.
    -   Add your keys to the file:
    ```
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    NEXT_PUBLIC_BASE_URL=http://localhost:3000
    ```

4.  **Setup Database Schema**
    -   Navigate to the **SQL Editor** in your Supabase project.
    -   Execute the contents of the `schema.sql` file (if provided) to create all necessary tables, functions, and policies.

5.  **Run Development Server**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.
