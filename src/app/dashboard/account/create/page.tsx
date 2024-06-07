'use client';

import React, { useState } from 'react';
import { createAccount } from '../../../../../utils/api';
import { AccountCategory } from '../../../../../utils/validation';
import { lusitana } from '@/components/ui/fonts';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const CreateAccountPage: React.FC = () => {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState(0);
  const [category, setCategory] = useState<AccountCategory>('BANK');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const authToken = localStorage.getItem('authToken');

      if (authToken) {
        await createAccount(authToken, name, balance, category);
        console.log('Account created successfully');
        // Additional logic or redirection after account creation
      } else {
        console.error('Authentication token not found in localStorage');
      }
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  return (
    <div>
      <h1 className={`${lusitana.className} mb-4 text-xl font-bold md:text-2xl`}>Create Account</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className={`${lusitana.className} block text-gray-700 font-bold mb-2`}>
            Service Provider&apos;s Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="balance" className={`${lusitana.className} block text-gray-700 font-bold mb-2`}>
            Balance
          </label>
          <input
            id="balance"
            type="number"
            placeholder="Enter USD amount"
            value={balance}
            onChange={(e) => setBalance(parseFloat(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="category" className={`${lusitana.className} block text-gray-700 font-bold mb-2`}>
            Account Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as AccountCategory)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="BANK">Bank</option>
            <option value="MOBILE_WALLET">Mobile Wallet</option>
          </select>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/account"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <Button type="submit">Create Account</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccountPage;