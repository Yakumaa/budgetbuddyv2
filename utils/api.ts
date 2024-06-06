import axios, { AxiosError } from 'axios';
import { LoginInput, RegisterInput } from './validation';

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