import { Suspense } from 'react';
import TransactionForm from './transaction-form';

export default function CreateTransactionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransactionForm />
    </Suspense>
  );
}