
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function SelectRolePage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);


  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        router.push('/login');
      }
    };
    getUser();
  }, [supabase, router]);

  const setRole = async (role: 'Driver' | 'Customer') => {
    if (!userId) return;

    const { error } = await supabase
      .from('profiles')
      .update({ role: role })
      .eq('id', userId);

    if (error) {
      alert('Error setting role. Please try again.');
      console.error(error);
    } else {
      
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Welcome to TaxiApp!</h1>
        <p className="mt-4 text-lg text-gray-500">
          To get started, please tell us who you are.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
      
        <div
          onClick={() => setRole('Customer')}
          className="p-8 border rounded-lg text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <h2 className="text-2xl font-semibold">I'm a Customer</h2>
          <p className="mt-2 text-gray-500">I want to book rides.</p>
        </div>

      
        <div
          onClick={() => setRole('Driver')}
          className="p-8 border rounded-lg text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <h2 className="text-2xl font-semibold">I'm a Driver</h2>
          <p className="mt-2 text-gray-500">I want to give rides.</p>
        </div>
      </div>
    </div>
  );
}