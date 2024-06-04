import axios, { AxiosError } from 'axios';
import { LoginInput } from './validation';

const apiUrl = 'http://localhost:5000/api/auth';

export const signIn = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${apiUrl}/signin`, { userName: username, password });
    return response.data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};
