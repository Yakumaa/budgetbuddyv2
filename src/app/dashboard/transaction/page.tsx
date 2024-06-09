"use client"

import { useEffect, useState } from 'react';
import { getTotalIncome, getTotalExpense, getTransactions } from '../../../../utils/api';
import { lusitana } from '@/components/ui/fonts';
import { Card } from '@/components/ui/dashboard/cards';

interface Transaction {
  transaction_id: number;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
}

interface TransactionsData {
  userId: number;
  transactions: Transaction[];
}

const TransactionsPage: React.FC = () => {
  const [transactionsData, setTransactionsData] = useState<TransactionsData | null>(null);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem('authToken');

        if (authToken) {
          const incomeResponse = await getTotalIncome(authToken);
          setTotalIncome(incomeResponse);

          const expenseResponse = await getTotalExpense(authToken);
          setTotalExpense(expenseResponse);

          const transactionsResponse = await getTransactions(authToken);
          setTransactionsData(transactionsResponse);
        } else {
          console.error('Authentication token not found in localStorage');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const transactions = transactionsData?.transactions || [];

  const incomeTransactions = transactions.filter((transaction) => transaction.type === 'income');
  const expenseTransactions = transactions.filter((transaction) => transaction.type === 'expense');

  return (
    <main>
      <div className="flex items-center justify-between gap-2 mb-4">
        <h1 className={`${lusitana.className} text-xl font-bold md:text-2xl`}>
          Transactions
        </h1>
      </div>

      <div className="flex flex-col md:flex-row mt-8">
        <div className="md:w-1/2 m-6">
          <Card title="Total Income" value={totalIncome} type="income" />
        </div>
        <div className="md:w-1/2 m-6">
          <Card title="Total Expense" value={totalExpense} type="expense" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row mt-8">
        <div className="md:w-1/2">
          <h2 className={`${lusitana.className} text-2xl mb-4 m-6`}>Income</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 m-6">
            {incomeTransactions.map((transaction) => (
              <Card
                key={transaction.transaction_id}
                title={transaction.description}
                value={transaction.amount}
                type={transaction.type}
                date={transaction.date}
              />
            ))}
          </div>
        </div>

        <div className="md:w-1/2 mt-8 md:mt-0">
          <h2 className={`${lusitana.className} text-2xl mb-4 m-6`}>Expense</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 m-6">
            {expenseTransactions.map((transaction) => (
              <Card
                key={transaction.transaction_id}
                title={transaction.description}
                value={transaction.amount}
                type={transaction.type}
                date={transaction.date}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default TransactionsPage;