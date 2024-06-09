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