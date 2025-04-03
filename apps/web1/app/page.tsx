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
			if (
				window.location.href.includes("appToken") ||
				window.location.href.includes("error")
			)
				return;
			const iframe = document.createElement("iframe");
			iframe.id = "slient-auth-check";
			iframe.style.display = "none";
			iframe.src =
				`${IDP_URL}/api/authorize?` +
				new URLSearchParams({
					redirect_url: window.location.origin + "/api/callback",
					silent: "true",
				});
			window.addEventListener("message", async (event) => {
				// Optionally, verify event.origin to ensure it's from a trusted source
				const data = event.data;
				if (data.error) {
					console.log("Silent auth failed:", data.error);
					// Handle error (e.g., prompt the user to log in interactively)
				} else if (data.token) {
					console.log("User is already logged in:", data.token);
					const { accessToken } = await fetch('/api/get-token?' + new URLSearchParams({
						accessToken: data.token,
					})).then(res => res.json()).then(res => {
						return res as { accessToken: string }
					})
					const resultUser = await fetch('/api/account', {
						headers: {
							Authorization: `Bearer ${accessToken}`,
						}
					}).then(res => res.json()).then(res => {
						return res
					})
					setUser(resultUser.data as User);
					setIsLoggedIn(true)
					// Use the token to update the UI and create a local session
				}
			});
			if (document.querySelectorAll(iframe.id).length === 0) {
				document.body.appendChild(iframe);
			}
		};

		checkAppToken();
	}, [router]);

	const handleLogin = () => {
		router.push(
			`${IDP_URL}/?` +
				new URLSearchParams({
					redirect_url: window.location.origin + "/api/callback",
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
