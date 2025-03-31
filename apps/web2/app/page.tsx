'use client'
import { useState } from 'react';

interface User {
  email: string;
  name: string;
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = () => {
    // Simulate a successful login
    // In a real app, you'd make an API call here
    setTimeout(() => {
      setUser({ email: 'test@example.com', name: 'Test User' });
      setIsLoggedIn(true);
    }, 500); // Simulate a 0.5-second delay
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800 mb-8">
        Welcome to Web2
      </h1>
      <p className="text-lg text-gray-600 mb-12">
        This is a simple landing page.
      </p>

      {isLoggedIn ? (
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-4">
            Welcome, {user?.name}!
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Email: {user?.email}
          </p>
          <button
            className="px-6 py-3 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={handleLogin}
        >
          Login
        </button>
      )}
    </div>
  );
}
