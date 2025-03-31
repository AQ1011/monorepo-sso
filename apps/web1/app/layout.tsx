import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Web2",
  description: "Web2 SSO",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
