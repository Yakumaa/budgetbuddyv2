'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { deleteTransaction, getAccounts, getTransactions, updateTransaction } from '../../../../../../utils/api';
import { TransactionType } from '../../../../../../utils/validation';
import { lusitana } from '@/components/ui/fonts';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Breadcrumbs from '@/components/ui/accounts/breadcrumbs';
import { set } from 'zod';

interface Transaction {
  transaction_id: number;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string;
}

const EditTransactionPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  console.log('id', id);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TransactionType>('income');
  const [accounts, setAccounts] = useState<{ account_id: number, name: string }[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const authToken = localStorage.getItem('authToken');

        if (authToken) {
          const transactionsResponse = await getTransactions(authToken);

          if (id !== undefined && id !== null) {
            const foundTransaction = transactionsResponse.transactions.find(
              (tx: Transaction) => tx.transaction_id === parseInt(id as string, 10)
            );
            console.log('Found Transaction:', foundTransaction);
            if (foundTransaction) {
              setTransaction(foundTransaction);
              setAmount(foundTransaction.amount);
              setCategory(foundTransaction.category);
              setDate(formatDate(foundTransaction.date));
              setDescription(foundTransaction.description);
              setType(foundTransaction.type);
              setSelectedAccount(foundTransaction.account_id)
            } else {
              console.log('Transaction not found');
            }
          } else {
            console.log('ID is undefined or null');
          }

          const accountsResponse = await getAccounts(authToken);
          setAccounts(accountsResponse.accounts.map((account: { account_id: number, name: string }) => ({
            account_id: account.account_id,
            name: account.name,
          })));
        } else {
          console.error('Authentication token not found in localStorage');
        }
      } catch (error) {
        console.error('Error fetching transaction:', error);
      }
    }

    fetchTransaction();
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

    if (transaction) {
      try {
        const authToken = localStorage.getItem('authToken');

        if (authToken) {
          const account_transactions = selectedAccount ? [{ account_id: selectedAccount }] : [];
          const formattedDate = new Date(`${date}T00:00:00`).toISOString();
          await updateTransaction(authToken, transaction.transaction_id, type, amount, category, description, formattedDate, account_transactions);
          console.log('Transaction updated successfully');
          router.push('/dashboard/transaction');
          toast({
            title: `${type} updated successfully`,
          })
        } else {
          console.error('Authentication token not found in localStorage');
        }
      } catch (error) {
        console.error('Error updating transaction:', error);
        toast({
          title: "Error updating transaction",
          variant: "destructive"
        })
      }
    }
  }

  if (!transaction) {
    return <div>Loading...</div>;
  }

  return(
    <div>
    <Breadcrumbs
      breadcrumbs={[
        { label: 'Transactions', href: '/dashboard/transaction' },
        {
          label: 'Edit Transaction',
          href: `/dashboard/transaction/${id}/edit`,
          active: true,
        },
      ]}
    />

    <h1 className={`${lusitana.className} text-3xl font-bold mb-6`}>Edit Transaction</h1>
    <form onSubmit={handleSubmit}>
      {/* Render input fields for amount, category, description, date, and account selection */}
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
            {type === 'income' ? 'Deposit to' : 'Pay from'}
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
        <Button type="submit">Update Transaction</Button>
      </div>
    </form>
  </div>
);
};

export default EditTransactionPage;