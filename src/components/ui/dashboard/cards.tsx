'use client';

import { useEffect, useState } from 'react';
import {
  BanknotesIcon,
  UserGroupIcon,
  CalculatorIcon,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  BriefcaseIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/components/ui/fonts';
import { 
  getTotalIncome, 
  getTotalExpense, 
  getTotalBalance, 
  getTotalAccounts,
  getTotalLending,
  getTotalBorrowing
} from '../../../../utils/api';
import Link from 'next/link';

const iconMap = {
  income: BanknotesIcon,
  expense: CalculatorIcon,
  borrowing: BarsArrowDownIcon,
  lending: BarsArrowUpIcon,
  accounts: UserGroupIcon,
  networth: BriefcaseIcon
};

export default function CardWrapper({authToken}: {authToken: string}) {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [totalLending, setTotalLending] = useState(0);
  const [totalBorrowing, setTotalBorrowing] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const income = await getTotalIncome(authToken);
        const expense = await getTotalExpense(authToken);
        const balance = await getTotalBalance(authToken);
        const accounts = await getTotalAccounts(authToken);
        const lending = await getTotalLending(authToken);
        const borrowing = await getTotalBorrowing(authToken);
        setTotalIncome(income);
        setTotalExpense(expense);
        setTotalBalance(balance);
        setTotalAccounts(accounts);
        setTotalLending(lending);
        setTotalBorrowing(borrowing);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData()
  }, [authToken])

  return (
    <>
      <Card title="Income" value={totalIncome} type="income" />
      <Card title="Expense" value={totalExpense} type="expense" />
      <Card title="Borrowing" value={totalBorrowing} type="borrowing" />
      <Card title="Lending" value={totalLending} type="lending"/>
      <Card title="Accounts" value={totalAccounts} type="accounts"/>
      <Card title="Networth" value={totalBalance} type="networth"/>
    </>
  );
}

export function Card({
  title,
  value,
  type,
  isAccountsPage = false,
  accountId,
}: {
  title: string;
  value: number | string;
  type: 'income' | 'expense' | 'borrowing' | 'lending' | 'accounts' | 'networth';
  isAccountsPage?: boolean;
  accountId?: number;
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
        {isAccountsPage && (
          <div className="ml-auto flex space-x-2">
            <Link href={`/dashboard/account/${accountId}/edit`} passHref>
              <PencilSquareIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
            </Link>
            <TrashIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </div>
        )}
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
