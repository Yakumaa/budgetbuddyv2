'use client';

import { useEffect, useState } from 'react';
import { deleteLoan, getLoans } from '../../../../utils/api';
import { lusitana } from '@/components/ui/fonts';
import { Card } from '@/components/ui/dashboard/cards';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';

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

const LoansPage: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);

  const fetchLoans = async () => {
    try {
      const authToken = localStorage.getItem('authToken');

      if (authToken) {
        const loansResponse = await getLoans(authToken);
        setLoans(loansResponse);
      } else {
        console.error('Authentication token not found in localStorage');
      }
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  };

  const handleDeleteLoan = async (loanId?: number) => {
    if (loanId === undefined) {
      console.error('Loan ID is undefined');
      return;
    }
    try {
      const authToken = localStorage.getItem('authToken');

      if (authToken) {
        await deleteLoan(authToken, loanId);
        console.log('Loan deleted successfully');
        fetchLoans();
      } else {
        console.error('Authentication token not found in localStorage');
      }
    } catch (error) {
      console.error('Error deleting loan:', error);
    }
  }

  useEffect(() => {
    fetchLoans();
  }, []);

  const borrowLoan = loans.filter((loan) => loan.loanType === 'borrow');
  const lendLoan = loans.filter((loan) => loan.loanType === 'lend');

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
          Loans
        </h1>
        <Link
          href="/dashboard/loan/create"
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <span className="hidden md:block">Create Loan</span>{' '}
          <PlusIcon className="h-5 md:ml-4" />
        </Link>
      </div>

      {/* <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        {loans.map((loan) => (
          <Card
            key={loan.loan_id}
            title={`${loan.loanType === 'borrow' ? 'Borrowing' : 'Lending'} from ${loan.counterpart}`}
            value={loan.amount}
            type={loan.loanType === 'borrow' ? 'borrowing' : 'lending'}
            date={formatDate(loan.start_date)}
          />
        ))}
      </div> */}

      <div className="flex flex-col md:flex-row mt-8">
        <div className="md:w-1/2">
          <h2 className={`${lusitana.className} text-2xl mb-4 m-6`}>Borrowing</h2>
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-1 m-6">
            {borrowLoan.map((loan) => (
              <Card
              key={loan.loan_id}
              title={`Borrowing from ${loan.counterpart}`}
              value={loan.amount}
              type={'borrowing'}
              date={formatDate(loan.start_date)}
              isLoansPage={true}
              loanId={loan.loan_id}
              handleDeleteLoan={handleDeleteLoan}
              />
            ))}
          </div>
        </div>

        <div className="md:w-1/2 mt-8 md:mt-0">
          <h2 className={`${lusitana.className} text-2xl mb-4 m-6`}>Lending</h2>
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-1 m-6">
          {lendLoan.map((loan) => (
              <Card
              key={loan.loan_id}
              title={`Lending to ${loan.counterpart}`}
              value={loan.amount}
              type={'lending'}
              date={formatDate(loan.start_date)}
              isLoansPage={true}
              loanId={loan.loan_id}
              handleDeleteLoan={handleDeleteLoan}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoansPage;