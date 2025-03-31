'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  username: string;
  name: string;
  email: string;
}

export default function Account() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/account', {
          method: 'GET',
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Redirect to login if unauthorized
            router.push('/');
          } else {
            const errorData = await response.json();
            setError(errorData.message || 'Failed to fetch user data');
          }
          return;
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('user');
      router.push('/');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
        <div>User not found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-gray-50 p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Account Information
        </h1>
        <p className="text-lg text-gray-700 mb-2">
          <span className="font-semibold">Username:</span> {user.username}
        </p>
        <p className="text-lg text-gray-700 mb-2">
          <span className="font-semibold">Name:</span> {user.name}
        </p>
        <p className="text-lg text-gray-700 mb-4">
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <button
          className="px-6 py-3 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
