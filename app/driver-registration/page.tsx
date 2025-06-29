// app/driver-registration/page.tsx
'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function DriverRegistrationPage() {
  const supabase = createClientComponentClient();

  const handleRegistration = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert('You must be logged in.');

    // Update the user's role to 'Driver'
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'Driver' })
      .eq('id', user.id);

    if (error) {
      alert('Error submitting application. Please try again.');
    } else {
      alert('Congratulations! You are now registered as a driver. Your account will be reviewed for verification.');
      // Use hard reload to ensure all state is updated correctly
      window.location.assign('/dashboard');
    }
  };

  return (
    // Updated container to center the card
    <div className="flex items-center justify-center min-h-screen p-4 bg-background">
      {/* NEW: Card container for a polished look, using theme variables */}
      <div className="w-full max-w-2xl text-center p-8 sm:p-12 border border-border rounded-xl bg-card shadow-lg">
        <h1 className="text-4xl font-bold text-card-foreground">
          Become a Driver
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
          Join our team of professional drivers. Once you register, your account will be pending verification. Verified drivers get a blue tick and are recommended more often to customers.
        </p>
        <button 
          onClick={handleRegistration}
          className="mt-8 bg-primary text-primary-foreground font-bold text-lg py-3 px-8 rounded-lg hover:opacity-90 transition-opacity"
        >
          Register as a Driver
        </button>
      </div>
    </div>
  );
}