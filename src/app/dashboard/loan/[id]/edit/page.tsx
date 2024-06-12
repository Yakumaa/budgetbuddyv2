'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getLoan, updateLoan, getAccounts, getLoans } from '../../../../../../utils/api';
import { lusitana } from '@/components/ui/fonts';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Breadcrumbs from '@/components/ui/accounts/breadcrumbs';

interface Loan {
  loan_id: number;
  amount: number;
  loanType: 'borrow' | 'lend';
  counterpart: string;
  interest_rate: number;
  repayment_schedule: string;
  start_date: string;
  end_date: string;
}

const EditLoanPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const loanId = params.id;
  const [loan, setLoan] = useState<Loan | null>(null);
  const [amount, setAmount] = useState(0);
  const [loanType, setLoanType] = useState<'borrow' | 'lend'>('borrow');
  const [counterpart, setCounterpart] = useState('');
  const [interestRate, setInterestRate] = useState(0);
  const [repaymentSchedule, setRepaymentSchedule] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [accounts, setAccounts] = useState<{ account_id: number; name: string }[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);

  useEffect(() => {
    const fetchLoan = async () => {
      try {
        const authToken = localStorage.getItem('authToken');

        if (authToken) {
          const loanResponse = await getLoans(authToken);
          console.log('Loan Response:', loanResponse);
          if (loanId !== undefined && loanId !== null) {
            const foundLoan =  loanResponse.find(
              (ln: Loan) => ln.loan_id === parseInt(loanId as string, 10)
            );
            console.log('Found Loan:', foundLoan);
            if (foundLoan) {
              setLoan(foundLoan);
              setAmount(foundLoan.amount);
              setLoanType(foundLoan.loanType);
              setCounterpart(foundLoan.counterpart);
              setInterestRate(foundLoan.interest_rate);
              setRepaymentSchedule(foundLoan.repayment_schedule);
              setStartDate(formatDate(foundLoan.start_date));
              setEndDate(formatDate(foundLoan.end_date));
              setSelectedAccount(foundLoan.account_id);
            } else {
              console.log('Loan not found');
            }
          } else {
            console.error('ID is undefined or null');
          }

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
        console.error('Error fetching loan:', error);
      }
    };

    fetchLoan();
  }, [loanId]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loan) {
      try {
        const authToken = localStorage.getItem('authToken');

        if (authToken) {
          const accountTransactions = selectedAccount ? [{ account_id: selectedAccount }] : [];
          const formattedStartDate = new Date(`${startDate}T00:00:00`).toISOString();
          const formattedEndDate = new Date(`${endDate}T00:00:00`).toISOString();
          await updateLoan(
            authToken,
            loan.loan_id,
            amount,
            loanType,
            counterpart,
            interestRate,
            repaymentSchedule,
            formattedStartDate,
            formattedEndDate,
            accountTransactions
          );
          console.log('Loan updated successfully');
          router.push('/dashboard/loan');
        } else {
          console.error('Authentication token not found in localStorage');
        }
      } catch (error) {
        console.error('Error updating loan:', error);
      }
    }
  };

  if (!loan) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Loans', href: '/dashboard/loan' },
          { label: 'Edit Loan', href: `/dashboard/loan/${loanId}/edit`, active: true },
        ]}
      />

      <h1 className={`${lusitana.className} text-3xl font-bold mb-6`}>Edit Loan</h1>
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
            placeholder="Enter repayment schedule"
            value={repaymentSchedule}
            onChange={(e) => setRepaymentSchedule(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="startDate" className={`${lusitana.className} block text-gray-700 font-bold mb-2`}>
            Start Date
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
            onChange={(e) => setSelectedAccount(parseInt(e.target.value, 10))}
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
          <Button type="submit">Update Loan</Button>
        </div>
      </form>
    </div>
  );
};

export default EditLoanPage;