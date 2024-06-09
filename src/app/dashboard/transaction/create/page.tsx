'use client';

import React, { use, useState } from 'react';
import { createTransaction } from '../../../../../utils/api';
import { TransactionType } from '../../../../../utils/validation';
import { lusitana } from '@/components/ui/fonts';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Breadcrumbs from '@/components/ui/accounts/breadcrumbs';
import { getAccounts } from '../../../../../utils/api';

const CreateTransactionPage: React.FC = () => {
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [accounts, setAccounts] = useState<{ account_id: number, name: string }[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type');

  const [transactionType, setTransactionType] = useState<TransactionType>((type as TransactionType) || 'income');

  const fetchAccounts = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        const accountsResponse = await getAccounts(authToken);
        setAccounts(accountsResponse.accounts.map((account: { account_id: number, name: string }) => ({
          account_id: account.account_id,
          name: account.name,
        })));
      } else {
        console.error('Authentication token not found in localStorage');
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const authToken = localStorage.getItem('authToken');

      if (authToken) {
        const account_transactions = selectedAccount ? [{ account_id: selectedAccount }] : [];
        const formattedDate = new Date(`${date}T00:00:00`).toISOString();
        await createTransaction(authToken, transactionType, amount, category, description, formattedDate, account_transactions);
        console.log('Transaction created successfully');
        // Additional logic or redirection after transaction creation
        router.push('/dashboard/transaction');
      } else {
        console.error('Authentication token not found in localStorage');
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  React.useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Transactions', href: '/dashboard/transaction' },
          {
            label: `Create ${transactionType === 'income' ? 'Income' : 'Expense'}`,
            href: '/dashboard/transaction/create',
            active: true,
          },
        ]}
      />

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="amount" className={`${lusitana.className} block text-gray-700 font-bold mb-2`}>
            Amount
          </label>
          <input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="category" className={`${lusitana.className} block text-gray-700 font-bold mb-2`}>
            Category
          </label>
          <input
            id="category"
            type="text"
            placeholder="Enter category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="date" className={`${lusitana.className} block text-gray-700 font-bold mb-2`}>
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className={`${lusitana.className} block text-gray-700 font-bold mb-2`}>
            Description
          </label>
          <input
            id="description"
            type="text"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="account" className={`${lusitana.className} block text-gray-700 font-bold mb-2`}>
            {transactionType === 'income' ? 'Deposit to' : 'Pay from'}
          </label>
          <select
            id="account"
            value={selectedAccount || ''}
            onChange={(e) => setSelectedAccount(e.target.value ? parseInt(e.target.value, 10) : null)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select an account</option>
            {accounts.map((account) => (
              <option key={account.account_id} value={account.account_id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/transaction"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <Button type="submit">
            {transactionType === 'income' ? 'Add Income' : 'Add Expense'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTransactionPage;