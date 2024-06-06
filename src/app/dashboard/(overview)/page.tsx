"use client";

import { useEffect, useState } from 'react';
import CardWrapper from "@/components/ui/dashboard/cards";
import { Suspense } from 'react';
import { CardsSkeleton } from "@/components/ui/skeletons";
import { lusitana } from '@/components/ui/fonts';

export default function Page() {
  // const userId = 5
  const [authToken, setAuthToken] = useState('');

  useEffect(() => {
    // Obtain the authentication token from the localstorage
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }
  }, []);
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          {authToken && (
              <CardWrapper authToken={authToken} />
          )}
        </Suspense>
      </div>
      
    </main>
    
  );
}