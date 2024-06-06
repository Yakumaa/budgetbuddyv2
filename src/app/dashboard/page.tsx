"use client";

import { useEffect, useState } from 'react';
import CardWrapper from "@/components/ui/dashboard/cards";

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
      <h1>this is dashboard</h1>

      {authToken && (
        <>
          <CardWrapper authToken={authToken} />
        </>
      
      )}
    </main>
    
  );
}