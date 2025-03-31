"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
	email: string;
	name: string;
}

const IDP_URL = process.env.NEXT_PUBLIC_IDP_URL!;

export default function Home() {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	const [user, setUser] = useState<User | null>(null);
	const router = useRouter();

	useEffect(() => {
		// Check for the appToken cookie
		const checkAppToken = async () => {
			try {
				await fetch(
					`${IDP_URL}/api/authorize?` +
						new URLSearchParams({
							redirect_url: window.location.origin + '/api/callback',
						}),
					{
						method: "GET",
            credentials: "include",
					}
				);
			} catch (error) {
				console.error("Error checking appToken:", error);
			}
		};

		checkAppToken();
	}, [router]);

	const handleLogin = () => {
		router.push(
			`${IDP_URL}/?` +
				new URLSearchParams({
					redirect_url: window.location.origin + '/api/callback',
				})
		);
	};

	const handleLogout = () => {
		setUser(null);
		setIsLoggedIn(false);
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<h1 className="text-6xl font-bold text-gray-800 mb-8">Welcome to Web1</h1>
			<p className="text-lg text-gray-600 mb-12">
				This is a simple landing page.
			</p>

			{isLoggedIn ? (
				<div className="text-center">
					<p className="text-lg text-gray-700 mb-4">Welcome, {user?.name}!</p>
					<p className="text-sm text-gray-500 mb-4">Email: {user?.email}</p>
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
