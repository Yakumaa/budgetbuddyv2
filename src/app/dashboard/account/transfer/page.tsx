'use client';

import React, { useState, useEffect } from 'react';
import { transferBalance, getAccounts } from '../../../../../utils/api';
import { lusitana } from '@/components/ui/fonts';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface Account {
  account_id: number;
  name: string;
  balance: number;
  category: string;
}

const TransferBalancePage: React.FC = () => {
  const [fromAccount, setFromAccount] = useState<Account | null>(null);
  const [toAccount, setToAccount] = useState<Account | null>(null);
  const [amount, setAmount] = useState(0);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const router = useRouter();
  
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const authToken = localStorage.getItem('authToken');

        if (authToken) {
          const accountsResponse = await getAccounts(authToken);
          setAccounts(accountsResponse.accounts);
        } else {
          console.error('Authentication token not found in localStorage');
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchAccounts();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (fromAccount && toAccount) {
      try {
        const authToken = localStorage.getItem('authToken');

        if (authToken) {
          await transferBalance(authToken, fromAccount.account_id, toAccount.account_id, amount);
          console.log('Balance transferred successfully');
          // Additional logic or redirection after balance transfer
          router.push('/dashboard/account');
        } else {
          console.error('Authentication token not found in localStorage');
        }
      } catch (error) {
        console.error('Error transferring balance:', error);
      }
    } else {
      console.error('Please select both accounts');
    }
  };

  return (
    <div>
      <h1 className={`${lusitana.className} text-3xl font-bold mb-6`}>Transfer Balance</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="fromAccount" className={`${lusitana.className} block text-gray-700 font-bold mb-2`}>
            From Account
          </label>
          <select
            id="fromAccount"
            value={fromAccount?.account_id || ''}
            onChange={(e) => setFromAccount(accounts.find((account) => account.account_id === parseInt(e.target.value, 10)) || null)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select Account</option>
            {accounts.map((account) => (
              <option key={account.account_id} value={account.account_id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="toAccount" className={`${lusitana.className} block text-gray-700 font-bold mb-2`}>
            To Account
          </label>
          <select
            id="toAccount"
            value={toAccount?.account_id || ''}
            onChange={(e) => setToAccount(accounts.find((account) => account.account_id === parseInt(e.target.value, 10)) || null)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select Account</option>
            {accounts.map((account) => (
              <option key={account.account_id} value={account.account_id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label htmlFor="amount" className={`${lusitana.className} block text-gray-700 font-bold mb-2`}>
            Amount
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/account"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <Button type="submit">Transfer Balance</Button>
        </div>
      </form>
    </div>
  );
};

export default TransferBalancePage;