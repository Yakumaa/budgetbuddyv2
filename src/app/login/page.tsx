"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from 'next/navigation';
import { signIn } from "../../../utils/api";
import { loginSchema, LoginInput } from "../../../utils/validation";

import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Page() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<Record<string, string>>({})
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try{
      const response = await signIn(username, password)
      console.log('login successful:', response)
      router.push('/dashboard');
    } catch (error: any) { // Explicitly type 'error' as 'any'
      if (error.response?.status === 403) {
        setError({ general: 'Invalid username or password' })
      } else {
        setError({ general: 'An error occurred. Please try again.' })
      }
      console.error('login error:', error)
    }
    // try {
    //   const input: LoginInput = { username, password };
    //   const validatedData = await loginSchema.parseAsync(input);
  
    //   const { username, password } = validatedData;
  
    //   try {
    //     const response = await signIn(username, password);
    //     console.log('Login successful:', response);
    //     router.push('/dashboard');
    //   } catch (error: any) {
    //     if (error.response?.status === 403) {
    //       setError({ general: 'Invalid username or password' });
    //     } else {
    //       setError({ general: 'An error occurred. Please try again.' });
    //     }
    //     console.error('Login error:', error);
    //   }
    // } catch (err: any) {
    //   const error = err.formErrors.fieldErrors;
    //   setError(error);
    // }
  }

  return (
    <Card className="mx-auto w-full max-w-sm mt-12">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your username and password below to login to your account.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              type="text" 
              placeholder="john doe" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required />
            {/* {error.username && <p className="text-red-500 text-sm">{error.username}</p>} */}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required />
              {/* {error.password && <p className="text-red-500 text-sm">{error.password}</p>} */}
          </div>

          <Button type="submit" className="w-full mt-2">Login</Button>

          {error.general && (
            <div
            className="flex h-6 items-end space-x-2"
            aria-live="polite"
            aria-atomic="true"
            >
              <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
              <p className="text-red-500 text-sm">{error.general}</p>
            </div>
            
          )}

          <div className="mt-1 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="#" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}