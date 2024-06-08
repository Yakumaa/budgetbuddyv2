"use client"

import React, { useEffect, useState } from 'react';
import { getTotalBalance, getAccounts, createAccount, updateAccount, deleteAccount, transferBalance } from '../../../../utils/api';
import { AccountCategory, accountCategorySchema } from '../../../../utils/validation';
import { lusitana } from '@/components/ui/fonts';
import { Card } from '@/components/ui/dashboard/cards';
import { BanknotesIcon, PlusIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Account {
  account_id: number;
  name: string;
  balance: number;
  category: AccountCategory;
}

interface AccountsData {
  userId: number;
  accounts: Account[];
  totalBalance: number;
}

const AccountsPage: React.FC = () => {
  const [accountsData, setAccountsData] = useState<AccountsData | null>(null);
  const [totalBalance, setTotalBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem('authToken');

        if (authToken) {
          const accountsResponse = await getAccounts(authToken);
          setAccountsData(accountsResponse);
    
          const totalBalanceResponse = await getTotalBalance(authToken);
          setTotalBalance(totalBalanceResponse);
        } else {
          console.error('Authentication token not found in localStorage');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!accountsData || totalBalance === null) {
    return <div>Loading...</div>;
  }

  const { accounts } = accountsData;

  const cashAccounts = accounts.filter((account) => account.category === 'CASH');
  const mobileWalletAccounts = accounts.filter((account) => account.category === 'MOBILE_WALLET');
  const bankAccounts = accounts.filter((account) => account.category === 'BANK');

  return (
    <main>
      <div className="flex items-center justify-between gap-2 mb-4">
        <h1 className={`${lusitana.className} text-xl font-bold md:text-2xl`}>
          Accounts
        </h1>
        <div className="flex justify-end gap-4">    
          <Link
            href="/dashboard/account/transfer"
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <span className="hidden md:block">Transfer Balance</span>{' '}
            <PlusIcon className="h-5 md:ml-4" />
          </Link>
          <Link
            href="/dashboard/account/create"
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <span className="hidden md:block">Create Account</span>{' '}
            <PlusIcon className="h-5 md:ml-4" />
          </Link>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Card title="Total Balance" value={totalBalance} type="networth" />
      </div>

      <h2 className={`${lusitana.className} text-2xl mt-8 mb-4`}>Cash Accounts</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cashAccounts.map((account) => (
        <Card key={account.account_id} title={account.name} value={account.balance} type="accounts" isAccountsPage={true} accountId={account.account_id}/>
      ))}
      </div>
      
      <h2 className={`${lusitana.className} text-2xl mt-8 mb-4`}>Mobile Wallet Accounts</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {mobileWalletAccounts.map((account) => (
        <Card key={account.account_id} title={account.name} value={account.balance} type="accounts" isAccountsPage={true} accountId={account.account_id}/>
      ))}
      </div>

      <h2 className={`${lusitana.className} text-2xl mt-8 mb-4`}>Bank Accounts</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {bankAccounts.map((account) => (
          <Card key={account.account_id} title={account.name} value={account.balance} type="accounts" isAccountsPage={true} accountId={account.account_id}/>
        ))}
      </div>
    </main>
  );
};

export default AccountsPage;