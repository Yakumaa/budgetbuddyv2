"use client"

import React, { useEffect, useState } from 'react';
import { getTotalBalance, getAccounts, createAccount, updateAccount, deleteAccount, transferBalance } from '../../../../utils/api';
import { AccountCategory, accountCategorySchema } from '../../../../utils/validation';
import { lusitana } from '@/components/ui/fonts';
import { Card } from '@/components/ui/dashboard/cards';
import { BanknotesIcon, UserGroupIcon } from '@heroicons/react/24/outline';

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
    <div>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl font-bold`}>
        Accounts
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Card title="Total Balance" value={totalBalance} type="networth" />
      </div>

      <h2 className={`${lusitana.className} text-2xl mt-8 mb-4`}>Cash Accounts</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cashAccounts.map((account) => (
        <Card key={account.account_id} title={account.name} value={account.balance} type="accounts" />
      ))}
      </div>
      
      <h2 className={`${lusitana.className} text-2xl mt-8 mb-4`}>Mobile Wallet Accounts</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {mobileWalletAccounts.map((account) => (
        <Card key={account.account_id} title={account.name} value={account.balance} type="accounts" />
      ))}
      </div>

      <h2 className={`${lusitana.className} text-2xl mt-8 mb-4`}>Bank Accounts</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {bankAccounts.map((account) => (
          <Card key={account.account_id} title={account.name} value={account.balance} type="accounts" />
        ))}
      </div>
    </div>
  );
};

export default AccountsPage;