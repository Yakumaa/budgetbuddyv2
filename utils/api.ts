import axios, { AxiosError } from 'axios';
import { LoginInput, RegisterInput } from './validation';
import { AccountCategory } from './validation';

const apiUrl = 'http://localhost:5000';

export const signIn = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/signin`, { userName: username, password });
    return response.data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const register = async (username: string, email: string, password: string) => {
  try {
    const response = await axios.post<RegisterInput>(`${apiUrl}/api/auth/signup`, {
      email,
      userName: username,
      password,
    });
    console.log('Registration:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

export const signOut = async ( authToken: string ) => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/logout`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export const getTotalIncome = async (authToken: string) => {
  try {
    const response = await axios.get(`${apiUrl}/transactions/total-income`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching total income:', error);
    throw error;
  }
};

export const getTotalExpense = async (authToken: string) => {
  try {
    const response = await axios.get(`${apiUrl}/transactions/total-expense`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching total expense:', error);
    throw error;
  }
};

export const getTotalBalance = async (authToken: string) => {
  try {
    const response = await axios.get(`${apiUrl}/accounts/total-balance`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching total balance:', error);
    throw error;
  }
}

export const getTotalAccounts = async (authToken: string) => {
  try {
    const response = await axios.get(`${apiUrl}/accounts/total-accounts`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching total accounts:', error);
    throw error;
  }
}

export const getTotalLending = async (authToken: string) => {
  try {
    const response = await axios.get(`${apiUrl}/loans/total-lending`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching total lending:', error);
    throw error;
  }
}

export const getTotalBorrowing = async (authToken: string) => {
  try {
    const response = await axios.get(`${apiUrl}/loans/total-borrowing`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching total borrowing:', error);
    throw error;
  }
}

export const getTotalAssets = async (authToken: string) => {
  try {
    const response = await axios.get(`${apiUrl}/assets/total-asset`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching total assets:', error);
    throw error;
  }
}

export const getAccounts = async (authToken: string) => {
  try {
    const response = await axios.get(`${apiUrl}/accounts`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching accounts:', error);
    throw error;
  }
}

export const createAccount = async (
  authToken: string, 
  name: string, 
  balance: number, 
  category: AccountCategory
) => {
  try {
    const response = await axios.post(`${apiUrl}/accounts`, {
      name,
      balance,
      category,
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    console.log('response', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
}

export const updateAccount = async (
  authToken: string,
  accountId: number,
  name: string,
  balance: number,
  category: AccountCategory
) => {
  try {
    const response = await axios.put(`${apiUrl}/accounts/${accountId}`, {
      name,
      balance,
      category,
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating account:', error);
    throw error;
  }
}

export const deleteAccount = async (authToken: string, accountId: number) => {
  try {
    const response = await axios.delete(`${apiUrl}/accounts/${accountId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
}

export const transferBalance = async (
  authToken: string,
  fromAccountId: number,
  toAccountId: number,
  amount: number
) => {
  try {
    const response = await axios.post(`${apiUrl}/accounts/transfer`, {
      fromAccountId,
      toAccountId,
      amount,
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error transferring balance:', error);
    throw error;
  }
}

export const getTransactions = async (authToken: string) => {
  try {
    const response = await axios.get(`${apiUrl}/transactions`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
}

export const createTransaction = async (
  authToken: string,
  type: 'income' | 'expense',
  amount: number,
  category: string,
  description: string,
  date: string,
  account_transactions: { account_id: number }[]
) => {
  try {
    const response = await axios.post(`${apiUrl}/transactions`, {
      type,
      amount,
      category,
      description,
      date,
      account_transactions,
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
}

export const updateTransaction = async (
  authToken: string,
  transactionId: number,
  type: 'income' | 'expense',
  amount: number,
  category: string,
  description: string,
  date: string,
  account_transactions: { account_id: number }[]
) => {
  try {
    const response = await axios.put(`${apiUrl}/transactions/${transactionId}`, {
      type,
      amount,
      category,
      description,
      date,
      account_transactions,
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
}

export const deleteTransaction = async (authToken: string, transactionId: number) => {
  try {
    const response = await axios.delete(`${apiUrl}/transactions/${transactionId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
}

export const getLoans = async (authToken: string) => {
  try {
    const response = await axios.get(`${apiUrl}/loans`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching loans:', error);
    throw error;
  }
}

export const createLoan = async (
  authToken: string,
  amount: number,
  loanType: 'borrow' | 'lend',
  counterpart: string,
  interestRate: number,
  repaymentSchedule: string,
  startDate: string,
  endDate: string,
  accountTransactions: { account_id: number }[]
) => {
  try {
    const accountIds = accountTransactions.map(({ account_id }) => account_id);
    const response = await axios.post(`${apiUrl}/loans`,
      {
        amount,
        loanType,
        counterpart,
        interest_rate: interestRate,
        repayment_schedule: repaymentSchedule,
        start_date: startDate,
        end_date: endDate,
        account_id: accountIds.length > 0 ? accountIds[0] : null, // Send the first account_id or null
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating loan:', error);
    throw error;
  }
}

export const getLoan = async (authToken: string, loanId: number) => {
  try {
    const response = await axios.get(`${apiUrl}/loans/${loanId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching loan:', error);
    throw error;
  }
}

export const updateLoan = async (
  authToken: string,
  loanId: number,
  amount: number,
  loanType: 'borrow' | 'lend',
  counterpart: string,
  interestRate: number,
  repaymentSchedule: string,
  startDate: string,
  endDate: string,
  accountTransactions: { account_id: number }[]
) => {
  try {
    const accountIds = accountTransactions.map(({ account_id }) => account_id);
    const response = await axios.put(`${apiUrl}/loans/${loanId}`,
      {
        amount,
        loanType,
        counterpart,
        interest_rate: interestRate,
        repayment_schedule: repaymentSchedule,
        start_date: startDate,
        end_date: endDate,
        account_id: accountIds.length > 0 ? accountIds[0] : null, // Send the first account_id or null
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating loan:', error);
    throw error;
  }
}

export const deleteLoan = async (authToken: string, loanId: number) => {
  try {
    const response = await axios.delete(`${apiUrl}/loans/${loanId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting loan:', error);
    throw error;
  }
}

export const getAssets = async (authToken: string) => {
  try {
    const response = await axios.get(`${apiUrl}/assets`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching assets:', error);
    throw error;
  }
}

export const createAsset = async (
  authToken: string,
  name: string,
  value: number,
  purchaseDate: string,
  description: string | null
) => {
  try {
    const response = await axios.post(`${apiUrl}/assets`, {
      name,
      value,
      purchase_date: purchaseDate,
      description,
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating asset:', error);
    throw error;
  }
}

export const updateAsset = async (
  authToken: string,
  assetId: number,
  name: string,
  value: number,
  purchaseDate: string,
  description: string | null
) => {
  try {
    const response = await axios.put(`${apiUrl}/assets/${assetId}`, {
      name,
      value,
      purchase_date: purchaseDate,
      description,
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating asset:', error);
    throw error;
  }
}

export const deleteAsset = async (authToken: string, assetId: number) => {
  try {
    const response = await axios.delete(`${apiUrl}/assets/${assetId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting asset:', error);
    throw error;
  }
}

export const getUsers = async (authToken: string) => {
  try{
    const response = await axios.get(`${apiUrl}/users/`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

export const getUser = async (authToken: string, userId: number) => {
  try {
    const response = await axios.get(`${apiUrl}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

export const updateUser = async (
  authToken: string,
  userId: number,
  username: string,
  email: string,
) => {
  try {
    const response = await axios.put(`${apiUrl}/users/update/${userId}`, {
      username,
      email,
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export const changePassword = async (
  authToken: string,
  userId: number,
  currentPassword: string,
  newPassword: string,
) => {
  try {
    const response = await axios.put(`${apiUrl}/users/change-password/${userId}`, {
      currentPassword,
      newPassword,
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
}

// export const deleteUser = async (authToken: string, userId: number) => {
//   try {
//     const response = await axios.delete(`${apiUrl}/users/delete/${userId}`, {
//       headers: {
//         Authorization: `Bearer ${authToken}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error deleting user:', error);
//     throw error;
//   }
// }

// export const updateUserRole = async (authToken: string, userId: number, role: 'ADMIN' | 'EDITOR' | 'USER') => {
//   try {
//     const response = await axios.put(`${apiUrl}/users/update-role/${userId}`, {
//       role,
//     }, {
//       headers: {
//         Authorization: `Bearer ${authToken}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error updating user role:', error);
//     throw error;
//   }
// }
