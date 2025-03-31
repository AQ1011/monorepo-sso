'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { mockUsers } from '../constants/mock-users';
import { ArrowPathIcon } from '@heroicons/react/24/solid';

interface User {
  username: string;
  name: string;
  email: string;
}

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirectUrl');

  const handleLogin = async (username: string, password: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
        return;
      }

      // Redirect to the appropriate URL
      router.push(redirectUrl || '/account');
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="px-8 py-6 mx-4 mt-4 text-left bg-gray-50 shadow-lg md:w-1/3 lg:w-1/3 sm:w-1/3 rounded-lg relative"> {/* Added relative positioning */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center z-10 rounded-lg"> {/* Loading overlay */}
            <ArrowPathIcon className="h-10 w-10 animate-spin text-blue-500" />
          </div>
        )}
        <h3 className="text-2xl font-bold text-gray-800 text-center">Login</h3>
        {error && <div className="text-red-600 mb-4">{error}</div>}

        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Login with Mock Users:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockUsers.map((user, index) => (
              <button
                key={index}
                className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                onClick={() => handleLogin(user.username, user.password)}
                disabled={isLoading} // Disable all buttons when loading
              >
                Login as {user.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
