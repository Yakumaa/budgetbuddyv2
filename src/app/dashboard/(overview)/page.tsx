"use client";

import { useEffect, useState } from 'react';
import CardWrapper from "@/components/ui/dashboard/cards";
import { Component } from '@/components/ui/dashboard/graph';
import { Suspense } from 'react';
import { CardsSkeleton } from "@/components/ui/skeletons";
import { lusitana } from '@/components/ui/fonts';

export default function Page() {
  const [authToken, setAuthToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }
  }, []);
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl font-bold md:text-2xl`}>
        Dashboard
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          {authToken && (
              <CardWrapper authToken={authToken} />
          )}
        </Suspense>
      </div>

      <div className="mt-8">
        {authToken && (
          <Component authToken={authToken}/>
        )}
      </div>

    </main>
    
  );
}