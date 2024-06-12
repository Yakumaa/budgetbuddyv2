'use client';

import React, { use, useEffect, useState } from 'react';
import { deleteAsset, getAssets, updateAsset } from '../../../../../../utils/api';
import { lusitana } from '@/components/ui/fonts';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Breadcrumbs from '@/components/ui/accounts/breadcrumbs';

interface Asset {
  asset_id: number;
  name: string;
  value: number;
  purchase_date: string;
  description: string | null;
}

const EditAssetPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  console.log('id', id);
  const [asset, setAsset] = useState<Asset | null>(null);
  const [name, setName] = useState('');
  const [value, setValue] = useState(0);
  const [purchaseDate, setPurchaseDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const authToken = localStorage.getItem('authToken');

        if (authToken) {
          const assetsResponse = await getAssets(authToken);

          if (id !== undefined && id !== null) {
            const foundAsset = assetsResponse.find(
              (asset: Asset) => asset.asset_id === parseInt(id as string, 10)
            );
            console.log('Found Asset:', foundAsset);
            if (foundAsset) {
              setAsset(foundAsset);
              setName(foundAsset.name);
              setValue(foundAsset.value);
              setPurchaseDate(formatDate(foundAsset.purchase_date));
              setDescription(foundAsset.description);
            } else {
              console.log('Asset not found');
            }
          } else {
            console.log('Asset ID is undefined');
          }
        } else {
          console.error('Authentication token not found in localStorage');
        }
      } catch (error) {
        console.error('Error fetching asset:', error);
      }
    };

    fetchAsset();
  }, [id]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(asset) {
      try {
        const authToken = localStorage.getItem('authToken');

        if (authToken) {
          const formattedDate = new Date(`${purchaseDate}T00:00:00`).toISOString();
          await updateAsset(authToken, asset.asset_id, name, value, formattedDate, description);
          console.log('Asset updated successfully');
          router.push('/dashboard/asset');
        } else {
          console.error('Authentication token not found in localStorage');
        }
      } catch (error) {
        console.error('Error updating asset:', error);
      }
    }
  }

  if (!asset) {
    return <div>Loading...</div>;
  }

  return(
    <div>
    <Breadcrumbs
      breadcrumbs={[
        { label: 'Assets', href: '/dashboard/asset' },
        {
          label: 'Edit Asset',
          href: `/dashboard/asset/${id}/edit`,
          active: true,
        },
      ]}
    />

    <h1 className={`${lusitana.className} text-3xl font-bold mb-6`}>Edit Asset</h1>
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
          href="/dashboard/transaction"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Update Transaction</Button>
      </div>
    </form>
    </div>
  )
}

export default EditAssetPage;