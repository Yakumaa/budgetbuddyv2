'use client';

import { useEffect, useState } from 'react';
import {
  BanknotesIcon,
  UserGroupIcon,
  CalculatorIcon,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';
import { getTotalIncome, getTotalExpense } from '../../../../utils/api';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const income = await getTotalIncome(authToken);
        const expense = await getTotalExpense(authToken);
        setTotalIncome(income);
        setTotalExpense(expense);
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
      <Card title="Borrowing" value={0} type="borrowing" />
      <Card title="Lending" value={0} type="lending"/>
      <Card title="Accounts" value={0} type="accounts"/>
      <Card title="Networth" value={0} type="networth"/>
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'income' | 'expense' | 'borrowing' | 'lending' | 'accounts' | 'networth';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
