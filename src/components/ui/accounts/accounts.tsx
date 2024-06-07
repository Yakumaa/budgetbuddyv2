// 'use client';

// import React, { useState, useEffect } from 'react';
// import { getTotalBalance, getAccounts, createAccount, updateAccount, deleteAccount, transferBalance } from '../../../../utils/api';
// import { AccountCategory, accountCategorySchema } from '../../../../utils/validation';
// import { Card } from '@/components/ui/dashboard/cards';
// import { lusitana } from '@/components/ui/fonts';

// interface Account {
//   account_id: number;
//   name: string;
//   balance: number;
//   category: AccountCategory;
// }

// export default function AccountsPage() {
//   const [authToken, setAuthToken] = useState('');
//   const [totalBalance, setTotalBalance] = useState(0);
//   const [accounts, setAccounts] = useState<Account[]>([]);
//   const [newAccountName, setNewAccountName] = useState('');
//   const [newAccountBalance, setNewAccountBalance] = useState(0);
//   const [newAccountCategory, setNewAccountCategory] = useState<AccountCategory>('CASH');
//   const [transferAmount, setTransferAmount] = useState(0);
//   const [fromAccountId, setFromAccountId] = useState<number | null>(null);
//   const [toAccountId, setToAccountId] = useState<number | null>(null);

//   useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       setAuthToken(token);
//       fetchData(token);
//     }
//   }, []);

//   const fetchData = async (token: string) => {
//       try {
//         const totalBalance = await getTotalBalance(token);
//         const accounts = await getAccounts(token);
//         setTotalBalance(totalBalance);
//         setAccounts(accounts);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//   const handleCreateAccount = async () => {
//     try {
//       await createAccount(authToken, newAccountName, newAccountBalance, newAccountCategory);
//       fetchData(authToken);
//       setNewAccountName('');
//       setNewAccountBalance(0);
//       setNewAccountCategory('CASH');
//     } catch (error) {
//       console.error('Error creating account:', error);
//     }
//   };

//   const handleUpdateAccount = async (accountId: number, updatedName: string, updatedBalance: number, updatedCategory: AccountCategory) => {
//       try {
//         await updateAccount(authToken, accountId, updatedName, updatedBalance, updatedCategory);
//         fetchData(authToken);
//       } catch (error) {
//         console.error('Error updating account:', error);
//       }
//     };

//   const handleDeleteAccount = async (accountId: number) => {
//       try {
//         await deleteAccount(authToken, accountId);
//         fetchData(authToken);
//       } catch (error) {
//         console.error('Error deleting account:', error);
//       }
//     };

//   const handleTransferBalance = async () => {
//       try {
//         await transferBalance(authToken, fromAccountId ?? 0, toAccountId ?? 0, transferAmount);
//         fetchData(authToken);
//         setTransferAmount(0);
//         setFromAccountId(null);
//         setToAccountId(null);
//       } catch (error) {
//         console.error('Error transferring balance:', error);
//       }
//     };

//   return (
//     <main>
//       <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Accounts</h1>
//       <p>Total Balance: {totalBalance}</p>

//       {/* Add new account form */}
//       <div>
//         <input
//           type="text"
//           placeholder="Account Name"
//           value={newAccountName}
//           onChange={(e) => setNewAccountName(e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Balance"
//           value={newAccountBalance}
//           onChange={(e) => setNewAccountBalance(parseFloat(e.target.value))}
//         />
//         <select
//           value={newAccountCategory}
//           onChange={(e) => {
//             const parsedValue = e.target.value as AccountCategory;
//             const validatedValue = accountCategorySchema.safeParse(parsedValue);
//             if (validatedValue.success) {
//               setNewAccountCategory(validatedValue.data);
//             }
//           }}
//         >
//           <option value="CASH">Cash</option>
//           <option value="BANK">Bank</option>
//           <option value="MOBILE_WALLET">Mobile Wallet</option>
//         </select>
//         <button onClick={handleCreateAccount}>Create Account</button>
//       </div>

//       {/* Transfer balance form */}
//       <div>
//         <select
//           value={fromAccountId || ''}
//           onChange={(e) => setFromAccountId(parseInt(e.target.value))}
//         >
//           <option value="">Select From Account</option>
//           {Array.isArray(accounts) && accounts.map((account) => (
//             <option key={account.account_id} value={account.account_id}>
//               {account.name} ({account.balance})
//             </option>
//           ))}
//         </select>
//         <select
//           value={toAccountId || ''}
//           onChange={(e) => setToAccountId(parseInt(e.target.value))}
//         >
//           <option value="">Select To Account</option>
//           {Array.isArray(accounts) && accounts.map((account) => (
//             <option key={account.account_id} value={account.account_id}>
//               {account.name} ({account.balance})
//             </option>
//           ))}
//         </select>
//         <input
//           type="number"
//           placeholder="Amount"
//           value={transferAmount}
//           onChange={(e) => setTransferAmount(parseFloat(e.target.value))}
//         />
//         <button onClick={handleTransferBalance}>Transfer Balance</button>
//       </div>

//       {/* Accounts list */}
//       <div>
//         <h2>Cash Accounts</h2>
//         {accounts
//           .filter((account) => account.category === 'CASH')
//           .map((account) => (
//             <Card
//               key={account.account_id}
//               title={account.name}
//               value={account.balance}
//               type="accounts"
//               onUpdate={(updatedName: string, updatedBalance: number, updatedCategory: AccountCategory) =>
//                 handleUpdateAccount(account.account_id, updatedName, updatedBalance, updatedCategory)
//               }
//               onDelete={() => handleDeleteAccount(account.account_id)}
//             />
//           ))}

//         <h2>Bank Accounts</h2>
//         {accounts
//           .filter((account) => account.category === 'BANK')
//           .map((account) => (
//             <Card
//               key={account.account_id}
//               title={account.name}
//               value={account.balance}
//               type="accounts"
//               onUpdate={(updatedName, updatedBalance, updatedCategory) =>
//                 handleUpdateAccount(account.account_id, updatedName, updatedBalance, updatedCategory)
//               }
//               onDelete={() => handleDeleteAccount(account.account_id)}
//             />
//           ))}

//         <h2>Mobile Wallet Accounts</h2>
//         {accounts
//           .filter((account) => account.category === 'MOBILE_WALLET')
//           .map((account) => (
//             <Card
//               key={account.account_id}
//               title={account.name}
//               value={account.balance}
//               type="accounts"
//               onUpdate={(updatedName, updatedBalance, updatedCategory) =>
//                 handleUpdateAccount(account.account_id, updatedName, updatedBalance, updatedCategory)
//               }
//               onDelete={() => handleDeleteAccount(account.account_id)}
//             />
//           ))}
//       </div>
//     </main>
//   );
// }

