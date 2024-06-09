'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { deleteAccount, getAccounts, updateAccount } from '../../../../../../utils/api';
import { AccountCategory } from '../../../../../../utils/validation';
import { lusitana } from '@/components/ui/fonts';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Breadcrumbs from '@/components/ui/accounts/breadcrumbs';

interface Account {
  account_id: number;
  name: string;
  balance: number;
  category: AccountCategory;
}

const EditAccountPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  console.log('id', id);
  const [account, setAccount] = useState<Account | null>(null);
  const [name, setName] = useState('');
  const [balance, setBalance] = useState(0);
  const [category, setCategory] = useState<AccountCategory>('CASH');

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
  
        if (authToken) {
          const accountsResponse = await getAccounts(authToken);
          console.log('Accounts Response:', accountsResponse); // Add this log
  
          if (id !== undefined && id !== null) {
            const foundAccount = accountsResponse.accounts.find((acc: Account) => acc.account_id === parseInt(id as string, 10));
            console.log('Found Account:', foundAccount); // Add this log
  
            if (foundAccount) {
              setAccount(foundAccount);
              setName(foundAccount.name);
              setBalance(foundAccount.balance);
              setCategory(foundAccount.category);
            } else {
              console.log('Account not found'); // Add this log
            }
          } else {
            console.log('ID is undefined or null'); // Add this log
          }
        } else {
          console.error('Authentication token not found in localStorage');
        }
      } catch (error) {
        console.error('Error fetching account:', error);
      }
    };
  
    fetchAccount();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (account) {
      try {
        const authToken = localStorage.getItem('authToken');

        if (authToken) {
          await updateAccount(authToken, account.account_id, name, balance, category);
          console.log('Account updated successfully');
          // Redirect to the dashboard/account route
          router.push('/dashboard/account');
        } else {
          console.error('Authentication token not found in localStorage');
        }
      } catch (error) {
        console.error('Error updating account:', error);
      }
    }
  };
  console.log('account', account);
  if (!account) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Accounts', href: '/dashboard/account' },
          {
            label: 'Edit Account',
            href: `/dashboard/account/${id}/edit`,
            active: true,
          },
        ]}
      />
      
      <h1 className={`${lusitana.className} text-3xl font-bold mb-6`}>Edit Account</h1>
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
            value={balance}
            onChange={(e) => setBalance(parseFloat(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {account.category !== 'CASH' && (
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
        )}
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/account"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <Button type="submit">Update Account</Button>
        </div>
      </form>
    </div>
  );
};

export default EditAccountPage;