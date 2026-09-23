import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DashboardLayout } from "./_components/dashboard-layout";
import { AppwriteProvider } from "./_components/appwrite-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aethos — Investment Research Dashboard",
  description: "Long-horizon research on Indian businesses, industries, and IPOs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50">
        <AppwriteProvider>
          <DashboardLayout>{children}</DashboardLayout>
        </AppwriteProvider>
      </body>
    </html>
  );
}

