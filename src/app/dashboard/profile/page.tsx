'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { lusitana } from '@/components/ui/fonts';
import { updateUser, changePassword, getUsers, getUser, } from '../../../../utils/api';
import Breadcrumbs from '@/components/ui/accounts/breadcrumbs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { UpdateUserInput, UpdateUserSchema, passwordSchema } from '../../../../utils/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const UserProfilePage = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const [role, setRole] = useState('');

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<UpdateUserInput>({
  //   resolver: zodResolver(passwordSchema.merge(UpdateUserSchema)),
  // });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        if (authToken && userId) {
          const userResponse = await getUser(authToken, Number(userId));
          console.log('usersResponse', userResponse);
          if (userResponse) {
            setUsername(userResponse.username);
            setEmail(userResponse.email);
            // setRole(currentUser.role);
          } else {
            console.log('User not found');
          }
        } else {
          console.error('Authentication token not found in localStorage');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const authToken = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');
      if (authToken) {
        await updateUser(authToken, Number(userId), username, email);
        console.log('User updated successfully');
      } else {
        console.error('Authentication token not found in localStorage');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (newPassword !== confirmPassword) {
      console.error('New password and confirm password do not match');
      return;
    }
    try {
      const authToken = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');
      if (authToken) {
        await changePassword(authToken, Number(userId), currentPassword, newPassword);
        console.log('Password changed successfully');
        router.push('/dashboard/profile')
      } else {
        console.error('Authentication token not found in localStorage');
      }
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  // const onSubmit = async (data: UpdateUserInput) => {
  //   try {
  //     const authToken = localStorage.getItem('authToken');
  //     const userId = localStorage.getItem('userId');
  //     if (authToken) {
  //       await updateUser(authToken, Number(userId), data.username, data.email);
  //       console.log('User updated successfully');

  //       if (data.newPassword && data.confirmPassword) {
  //         await changePassword(authToken, Number(userId), currentPassword, data.newPassword);
  //         console.log('Password changed successfully');
  //         router.push('/dashboard/profile');
  //       }
  //     } else {
  //       console.error('Authentication token not found in localStorage');
  //     }
  //   } catch (error) {
  //     console.error('Error updating user:', error);
  //   }
  // };

  return (
    <div>
      {/* <Breadcrumbs
        breadcrumbs={[
          { label: 'User Profile', href: '/dashboard/profile', active: true },
        ]}
      /> */}

      <h1 className={`${lusitana.className} text-xl font-bold md:text-2xl`}>User Profile</h1>

      <form onSubmit={handleUpdateUser} className="mb-6 mt-6">
        <div className="mb-4">
          <label htmlFor="username" className={`${lusitana.className} block text-gray-700 font-bold mb-2`}>
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className={`${lusitana.className} block text-gray-700 font-bold mb-2`}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Update User
        </button>
      </form>

      <form onSubmit={handleChangePassword} className="mb-6">
        <div className="mb-4">
          <label htmlFor="currentPassword" className={`${lusitana.className} block text-gray-700 font-bold mb-2`}>
            Current Password
          </label>
          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="newPassword" className={`${lusitana.className} block text-gray-700 font-bold mb-2`}>
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className={`${lusitana.className} block text-gray-700 font-bold mb-2`}>
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Change Password
        </button>
      </form>

      {/* <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                {...register('username')}
                placeholder="John Doe"
                required
              />
              {errors.username && (
                <div className="flex h-6 items-end space-x-2" aria-live="polite" aria-atomic="true">
                  <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
                  <p className="text-red-500 text-sm">{errors.username.message}</p>
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="johndoe@example.com"
                required
              />
              {errors.email && (
                <div className="flex h-6 items-end space-x-2" aria-live="polite" aria-atomic="true">
                  <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                {...register('newPassword')}
              />
              {errors.newPassword && (
                <div className="flex h-6 items-end space-x-2" aria-live="polite" aria-atomic="true">
                  <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
                  <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <div className="flex h-6 items-end space-x-2" aria-live="polite" aria-atomic="true">
                  <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
                  <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                </div>
              )}
            </div>
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </form> */}

    </div>
  );
}

export default UserProfilePage;