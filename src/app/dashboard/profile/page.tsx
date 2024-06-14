'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { lusitana } from '@/components/ui/fonts';
import { updateUser, changePassword, getUser } from '../../../../utils/api';
import {
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from '@/components/ui/use-toast';
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { PasswordChangeSchema } from '../../../../utils/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'
import { useForm } from 'react-hook-form';

const UserProfilePage = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  // const [role, setRole] = useState('');
  const { toast } = useToast();

  // const {
  //   register: registerUserDetails,
  //   handleSubmit: handleUserDetailsSubmit,
  //   formState: { errors: userDetailsErrors },
  // } = useForm<z.infer<typeof UpdateUserSchema>>({
  //   resolver: zodResolver(UpdateUserSchema),
  //   defaultValues: { username, email },
  // });

  const {
    register: registerPasswordChange,
    handleSubmit: handlePasswordChangeSubmit,
    formState: { errors: passwordChangeErrors },
  } = useForm<z.infer<typeof PasswordChangeSchema>>({
    resolver: zodResolver(PasswordChangeSchema),
  });

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
        toast({
          title: "User details updated",
          description: "Your username and email have been updated successfully",
        })
      } else {
        console.error('Authentication token not found in localStorage');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error updating user",
        description: "An error occurred while updating your user details",
        variant: "destructive"
      })
    }
  };

  // const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  
  //   if (newPassword !== confirmPassword) {
  //     console.error('New password and confirm password do not match');
  //     return;
  //   }
  //   try {
  //     const authToken = localStorage.getItem('authToken');
  //     const userId = localStorage.getItem('userId');
  //     if (authToken) {
  //       await changePassword(authToken, Number(userId), currentPassword, newPassword);
  //       console.log('Password changed successfully');
  //       router.push('/dashboard/profile')
  //     } else {
  //       console.error('Authentication token not found in localStorage');
  //     }
  //   } catch (error) {
  //     console.error('Error changing password:', error);
  //   }
  // };

  // const onUserDetailsSubmit = async (data: z.infer<typeof UpdateUserSchema>) => {
  //   try {
  //     const authToken = localStorage.getItem('authToken');
  //     const userId = localStorage.getItem('userId');
  //     if (authToken) {
  //       await updateUser(authToken, Number(userId), data.username, data.email);
  //       console.log('User updated successfully');
  //     } else {
  //       console.error('Authentication token not found in localStorage');
  //     }
  //   } catch (error) {
  //     console.error('Error updating user:', error);
  //   }
  // };

  const onPasswordChangeSubmit = async (data: z.infer<typeof PasswordChangeSchema>) => {
    try {
      const authToken = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');
      if (authToken) {
        await changePassword(authToken, Number(userId), data.currentPassword, data.newPassword);
        console.log('Password changed successfully');
        router.push('/dashboard/profile');
        toast({
          title: "Password changed",
          description: "Your password has been successfully changed.",
        })
      } else {
        console.error('Authentication token not found in localStorage');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: "Error changing password",
        description: "An error occurred while changing your password.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      {/* <Breadcrumbs
        breadcrumbs={[
          { label: 'User Profile', href: '/dashboard/profile', active: true },
        ]}
      /> */}

      <h1 className={`${lusitana.className} text-xl font-bold md:text-2xl`}>User Profile</h1>

      <div className="grid gap-4 mt-8">
        <form onSubmit={handleUpdateUser}>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  // {...registerUserDetails('username')}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="John Doe"
                  required
                />
                {/* {userDetailsErrors.username && (
                  <div className="flex h-6 items-end space-x-2" aria-live="polite" aria-atomic="true">
                    <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
                    <p className="text-red-500 text-sm">{userDetailsErrors.username.message}</p>
                  </div>
                )} */}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  // {...registerUserDetails('email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="johndoe@example.com"
                  required
                />
                {/* {userDetailsErrors.email && (
                  <div className="flex h-6 items-end space-x-2" aria-live="polite" aria-atomic="true">
                    <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
                    <p className="text-red-500 text-sm">{userDetailsErrors.email.message}</p>
                  </div>
                )} */}
              </div>
              <Button type="submit" className="w-full">
                Update Details
              </Button>
            </div>
          </CardContent>
        </form>

        <form onSubmit={handlePasswordChangeSubmit(onPasswordChangeSubmit)}>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  // value={currentPassword}
                  // onChange={(e) => setCurrentPassword(e.target.value)}
                  {...registerPasswordChange('currentPassword')}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...registerPasswordChange('newPassword')}
                />
                {passwordChangeErrors.newPassword && (
                  <div className="flex h-6 items-end space-x-2" aria-live="polite" aria-atomic="true">
                    <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
                    <p className="text-red-500 text-sm">{passwordChangeErrors.newPassword.message}</p>
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...registerPasswordChange('confirmPassword')}
                />
                {passwordChangeErrors.confirmPassword && (
                  <div className="flex h-6 items-end space-x-2" aria-live="polite" aria-atomic="true">
                    <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
                    <p className="text-red-500 text-sm">{passwordChangeErrors.confirmPassword.message}</p>
                  </div>
                )}
              </div>
              <Button type="submit" className="w-full">
                Change Password
              </Button>
            </div>
          </CardContent>
        </form>
      </div>

    </div>
  );
}

export default UserProfilePage;