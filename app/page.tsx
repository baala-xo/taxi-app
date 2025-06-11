
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <main className="container mx-auto px-4 py-16 md:py-24">

        <section className="text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Taxi Booking App
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
            Hi! This is the full-stack taxi booking app I built for my assessment.
            Below is a quick guide on how to test the core features.
          </p>
          <div className="mt-8">
            <Link 
              href="/login" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
            >
              Start Testing
            </Link>
          </div>
        </section>


        <section className="mt-20 md:mt-28">
          <h2 className="text-3xl font-bold text-center">How to Test</h2>
          <div className="text-center text-gray-500 dark:text-gray-400 mb-10 max-w-3xl mx-auto">
            <p className="font-semibold text-amber-500 bg-amber-500/10 p-3 rounded-lg">
              <strong>note:</strong> 1.to test both roles, I recommend using two different browsers (or one normal and one incognito window).
            </p>
            <p className="font-semibold text-amber-500 bg-amber-500/10 p-3 rounded-lg">2.in authentication login via email alaong with magic link ,the third party auth providers & password credentials are not configured yet</p>
          </div>
          
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            

            <div className="p-8 border rounded-xl bg-gray-50 dark:bg-gray-800/30">
              <h3 className="text-2xl font-semibold text-center">Driver's Point-of-View</h3>
              <ol className="mt-6 list-decimal list-inside space-y-4">
                <li>Sign up for a new account.</li>
                <li>On the next screen, choose the **"I'm a Driver"** role.</li>
                <li>From your dashboard, turn the **"Available for Hire"** switch ON.</li>
                <li>Wait for the Customer (in your other browser) to book you.</li>
                <li>Once the new booking appears, click **"Mark as Complete"**.</li>
                <li>Refresh the page to see your earnings and the new rating update!</li>
              </ol>
            </div>
            

            <div className="p-8 border rounded-xl bg-gray-50 dark:bg-gray-800/30">
              <h3 className="text-2xl font-semibold text-center">Customer's Point-of-View</h3>
              <ol className="mt-6 list-decimal list-inside space-y-4">
                <li>In your second browser, sign up with another new account.</li>
                <li>This time, choose the **"I'm a Customer"** role.</li>
                <li>On your dashboard, you will see the available driver listed.</li>
                <li>Click **"Book Now"**, enter any locations, and confirm the ride.</li>
                <li>After the driver completes the ride, refresh your dashboard.</li>
                <li>In your "Ride History," you can now **"Pay Now"** and **"Rate"** the trip.</li>
              </ol>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}