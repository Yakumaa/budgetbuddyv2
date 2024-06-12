'use client';

import React, { useState } from 'react';
import { createAsset } from '../../../../../utils/api';
import { lusitana } from '@/components/ui/fonts';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Breadcrumbs from '@/components/ui/accounts/breadcrumbs';
import { useRouter } from 'next/navigation';

const CreateAssetPage: React.FC = () => {
  const [name, setName] = useState('');
  const [value, setValue] = useState(0);
  const [purchaseDate, setPurchaseDate] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const authToken = localStorage.getItem('authToken');

      if (authToken) {
        await createAsset(authToken, name, value, purchaseDate, description);
        console.log('Asset created successfully');
        // Additional logic or redirection after asset creation
        router.push('/dashboard/asset');
      } else {
        console.error('Authentication token not found in localStorage');
      }
    } catch (error) {
      console.error('Error creating asset:', error);
    }
  };

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Assets', href: '/dashboard/asset' },
          { label: 'Create Asset', href: '/dashboard/asset/create', active: true },
        ]}
      />

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className={`${lusitana.className} block text-gray-700 font-bold mb-2`}>
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter asset name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="value" className={`${lusitana.className} block text-gray-700 font-bold mb-2`}>
            Value
          </label>
          <input
            id="value"
            type="number"
            placeholder="Enter asset value"
            value={value}
            onChange={(e) => setValue(parseFloat(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="purchaseDate" className={`${lusitana.className} block text-gray-700 font-bold mb-2`}>
            Purchase Date
          </label>
          <input
            id="purchaseDate"
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className={`${lusitana.className} block text-gray-700 font-bold mb-2`}>
            Description
          </label>
          <textarea
            id="description"
            placeholder="Enter asset description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/asset"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <Button type="submit">Create Asset</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateAssetPage;