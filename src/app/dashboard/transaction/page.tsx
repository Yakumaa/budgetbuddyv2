"use client"

import { useEffect, useState } from 'react';
import { getTotalIncome, getTotalExpense, getTransactions, deleteTransaction } from '../../../../utils/api';
import { lusitana } from '@/components/ui/fonts';
import { Card } from '@/components/ui/dashboard/cards';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

interface Transaction {
  transaction_id: number;
  type: 'income' | 'expense';
  amount: number;
  category: string;
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
  const { toast } = useToast();

  const fetchTransactionsData = async () => {
    try {
      const authToken = localStorage.getItem('authToken');

      if (authToken) {
        const incomeResponse = await getTotalIncome(authToken);
        setTotalIncome(incomeResponse);

        const expenseResponse = await getTotalExpense(authToken);
        setTotalExpense(expenseResponse);

        const transactionsResponse = await getTransactions(authToken);
        console.log('Transactions data:', transactionsResponse);
        setTransactionsData(transactionsResponse);
      } else {
        console.error('Authentication token not found in localStorage');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDeleteTransaction = async (transactionId?: number) => {
    if (transactionId === undefined) {
      console.error('Transaction ID is undefined');
      return;
    }
    try{
      const authToken = localStorage.getItem('authToken');

      if (authToken) {
        await deleteTransaction(authToken, transactionId);
        console.log('Transaction deleted successfully');
        fetchTransactionsData();
        toast({
          title: "Transaction deleted successfully",
        })
      } else {
        console.error('Authentication token not found in localStorage');
      }
    } catch (error){
      console.error('Error deleting transaction:', error);
      toast({
        title: "Error deleting transaction",
        variant: "destructive"
      })
    }
  };

  useEffect(() => {
    fetchTransactionsData()
  }, []);

  const transactions = transactionsData?.transactions || [];

  const incomeTransactions = transactions.filter((transaction) => transaction.type === 'income');
  const expenseTransactions = transactions.filter((transaction) => transaction.type === 'expense');

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
          Transactions
        </h1>
        <div className="flex justify-end gap-4">
          <Link
            href="/dashboard/transaction/create?type=income"
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <span className="hidden md:block">Add Income</span>{' '}
            <PlusIcon className="h-5 md:ml-4" />
          </Link>
          <Link
            href="/dashboard/transaction/create?type=expense"
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <span className="hidden md:block">Add Expense</span>{' '}
            <PlusIcon className="h-5 md:ml-4" />
          </Link>
        </div>
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
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-1 m-6">
            {incomeTransactions.map((transaction) => (
              <Card
                key={transaction.transaction_id}
                title={transaction.category}
                value={transaction.amount}
                type={transaction.type}
                date={formatDate(transaction.date)}
                isTransactionsPage={true} 
                transactionId={transaction.transaction_id}
                handleDeleteTransaction={handleDeleteTransaction}
              />
            ))}
          </div>
        </div>

        <div className="md:w-1/2 mt-8 md:mt-0">
          <h2 className={`${lusitana.className} text-2xl mb-4 m-6`}>Expense</h2>
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-1 m-6">
            {expenseTransactions.map((transaction) => (
              <Card
                key={transaction.transaction_id}
                title={transaction.description}
                value={transaction.amount}
                type={transaction.type}
                date={formatDate(transaction.date)}
                isTransactionsPage={true} 
                transactionId={transaction.transaction_id}
                handleDeleteTransaction={handleDeleteTransaction}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default TransactionsPage;