'use client';

import React, { useState } from 'react';
import { createLoan } from '../../../../../utils/api';
import { lusitana } from '@/components/ui/fonts';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import Breadcrumbs from '@/components/ui/accounts/breadcrumbs';
import { getAccounts } from '../../../../../utils/api';
import { useRouter } from 'next/navigation';

const CreateLoanPage: React.FC = () => {
  const [amount, setAmount] = useState(0);
  const [loanType, setLoanType] = useState<'borrow' | 'lend'>('borrow');
  const [counterpart, setCounterpart] = useState('');
  const [interestRate, setInterestRate] = useState(0);
  const [repaymentSchedule, setRepaymentSchedule] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [accounts, setAccounts] = useState<{ account_id: number; name: string }[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const fetchAccounts = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        const accountsResponse = await getAccounts(authToken);
        setAccounts(
          accountsResponse.accounts.map((account: { account_id: number; name: string }) => ({
            account_id: account.account_id,
            name: account.name,
          }))
        );
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
        const accountTransactions = selectedAccount ? [{ account_id: selectedAccount }] : [];
        const formattedStartDate = new Date(`${startDate}T00:00:00`).toISOString();
        const formattedEndDate = new Date(`${endDate}T00:00:00`).toISOString();
        await createLoan(
          authToken,
          amount,
          loanType,
          counterpart,
          interestRate,
          repaymentSchedule,
          formattedStartDate,
          formattedEndDate,
          accountTransactions
        );
        console.log('Loan created successfully');
        // Additional logic or redirection after loan creation
        router.push('/dashboard/loan');
        toast({
          title: 'Loan added successfully',
        });
      } else {
        console.error('Authentication token not found in localStorage');
      }
    } catch (error) {
      console.error('Error creating loan:', error);
      toast({
        title: 'Error adding loan',
        variant: 'destructive',
      });
    }
  };

  React.useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Loans', href: '/dashboard/loan' },
          { label: 'Create Loan', href: '/dashboard/loan/create', active: true },
        ]}
      />

      <form onSubmit={handleSubmit}>
        {/* Render input fields for amount, loan type, counterpart, interest rate, repayment schedule, start date, end date, and account selection */}
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
          <label htmlFor="loanType" className={`${lusitana.className} block text-gray-700 font-bold mb-2`}>
            Loan Type
          </label>
          <select
            id="loanType"
            value={loanType}
            onChange={(e) => setLoanType(e.target.value as 'borrow' | 'lend')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="borrow">Borrow</option>
            <option value="lend">Lend</option>
          </select>
        </div>

        {/* Add more input fields for counterpart, interest rate, repayment schedule, start date, end date, and account selection */}
        <div className="mb-4">
          <label htmlFor="counterpart" className={`${lusitana.className} block text-gray-700 font-bold mb-2`}>
            Counterpart
          </label>
          <input
            id="counterpart"
            type="text"
            placeholder="Enter counterpart"
            value={counterpart}
            onChange={(e) => setCounterpart(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="interestRate" className={`${lusitana.className} block text-gray-700 font-bold mb-2`}>
            Interest Rate
          </label>
          <input
            id="interestRate"
            type="number"
            placeholder="Enter interest rate"
            value={interestRate}
            onChange={(e) => setInterestRate(parseFloat(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="repaymentSchedule" className={`${lusitana.className} block text-gray-700 font-bold mb-2`}>
            Description
          </label>
          <input
            id="repaymentSchedule"
            type="text"
            placeholder="Enter Description"
            value={repaymentSchedule}
            onChange={(e) => setRepaymentSchedule(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="startDate" className={`${lusitana.className} block text-gray-700 font-bold mb-2`}>
            Loan Date
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="endDate" className={`${lusitana.className} block text-gray-700 font-bold mb-2`}>
            Settlement Date
          </label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="account" className={`${lusitana.className} block text-gray-700 font-bold mb-2`}>
            Account
          </label>
          <select
            id="account"
            value={selectedAccount || ''}
            onChange={(e) => setSelectedAccount(parseInt(e.target.value))}
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
            href="/dashboard/loan"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <Button type="submit">Create Loan</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateLoanPage;