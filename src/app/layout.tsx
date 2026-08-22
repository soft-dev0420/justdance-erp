import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "@/context/auth-context";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Just Dance Studio",
  description: "Manage your Just Dance studio — clients, team, schedule, and more.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{ style: { background: '#fff', color: '#18181B', border: '1px solid #F3F4F6', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' } }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
