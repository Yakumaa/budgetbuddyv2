"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from 'next/navigation';
import { register } from "../../../utils/api";
import { registerSchema, RegisterInput } from "../../../utils/validation";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Page() {
  const [formValues, setFormValues] = useState<RegisterInput>({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Validate the input data using Zod
      const validatedData = registerSchema.parse(formValues);

      const { username, email, password } = validatedData;
      const response = await register(username, email, password);
      console.log('Registration successful:', response);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);

      if (error.response && error.response.status === 403 && error.response.data.message === 'Credentials Taken') {
        setErrors({ email: 'Email address already exists.' });
      } else {
        setErrors(error.formErrors?.fieldErrors || { general: 'An error occurred. Please try again.' });
      }    
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <Card className="mx-auto w-full max-w-sm mt-12">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="John doe"
                value={formValues.username}
                onChange={handleInputChange}
                required
              />
              {errors.username && <span className="text-red-500 text-sm">{errors.username}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formValues.email}
                onChange={handleInputChange}
                placeholder="m@example.com"
                required
              />
              {errors.email && (
                <div
                className="flex h-6 items-end space-x-2"
                aria-live="polite"
                aria-atomic="true"
                >
                  <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
                  <p className="text-red-500 text-sm">{errors.email}</p>
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formValues.password}
                onChange={handleInputChange}
              />
              {errors.password && (
                <div
                className="flex h-6 items-end space-x-2"
                aria-live="polite"
                aria-atomic="true"
                >
                  <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
                  <span className="text-red-500 text-sm">{errors.password}</span>
                </div>
              )}
            </div>
            <Button type="submit" className="w-full">
              Create an account
            </Button>
            {errors.general && (
              <div
              className="flex h-6 items-end space-x-2"
              aria-live="polite"
              aria-atomic="true"
              >
                <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
                <span className="text-red-500 text-sm">{errors.general}</span>
              </div>
            )}
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </form>
    </Card>
  )
}