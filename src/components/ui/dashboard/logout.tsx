import { useState } from 'react';
import { PowerIcon } from '@heroicons/react/24/solid';
import { signOut } from '../../../../utils/api';
import { useRouter } from 'next/navigation';

const SignOutForm = ({authToken}: {authToken: string}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // await signOut(authToken);
      router.push('/login'); 
    } catch (error) {
      console.error('Error signing out:', error);
      // Handle sign-out error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignOut}>
      <button
        type="submit"
        disabled={isLoading}
        className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
      >
        <PowerIcon className="w-6" />
        <div className="hidden md:block">Sign Out</div>
      </button>
    </form>
  );
};

export default SignOutForm;