'use client';

import React, { useEffect, useState } from 'react';
import { deleteAsset, getAssets } from '../../../../utils/api';
import { lusitana } from '@/components/ui/fonts';
import { Card } from '@/components/ui/dashboard/cards';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

interface Asset {
  asset_id: number;
  name: string;
  value: number;
  purchase_date: string;
  description: string | null;
}

const AssetsPage: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);

  const fetchAssets = async () => {
    try {
      const authToken = localStorage.getItem('authToken');

      if (authToken) {
        const assetsResponse = await getAssets(authToken);
        setAssets(assetsResponse);
      } else {
        console.error('Authentication token not found in localStorage');
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  };

  const handleDeleteAsset = async (assetId?: number) => {
    if (assetId === undefined) {
      console.error('Asset ID is undefined');
      return;
    }
    try {
      const authToken = localStorage.getItem('authToken');

      if (authToken) {
        await deleteAsset(authToken, assetId);
        console.log('Asset deleted successfully');
        fetchAssets();
      } else {
        console.error('Authentication token not found in localStorage');
      }
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
  
  }

  useEffect(() => {
    fetchAssets();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <main>
      <div className="flex items-center justify-between gap-2 mb-4">
        <h1 className={`${lusitana.className} text-xl font-bold md:text-2xl`}>
          Assets
        </h1>
        <Link
          href="/dashboard/asset/create"
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <span className="hidden md:block">Add Asset</span>{' '}
          <PlusIcon className="h-5 md:ml-4" />
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        {assets.map((asset) => (
          <Card
            key={asset.asset_id}
            title={asset.name}
            value={asset.value}
            type="asset"
            date={formatDate(asset.purchase_date)}
            isAssetsPage={true}
            assetId={asset.asset_id}
            handleDeleteAsset={handleDeleteAsset}
          />
        ))}
      </div>
    </main>
  );
};

export default AssetsPage;