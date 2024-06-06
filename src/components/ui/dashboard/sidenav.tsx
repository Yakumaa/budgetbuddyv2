"use client"

import Link from 'next/link';
import { useState, useEffect } from 'react';
import NavLinks from '@/components/ui/dashboard/nav-links';
import SignOutForm from './logout';

export default function SideNav() {
  const [authToken, setAuthToken] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }
  }, []);
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <h1>BudgetBuddy</h1>
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        {authToken && (
          <SignOutForm authToken={authToken}/>
        )}
        
      </div>
    </div>
  );
}