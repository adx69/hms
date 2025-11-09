'use client';

import { SessionProvider } from 'next-auth/react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout({ children }) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="ml-64 flex-1">
          <Navbar />
          <main className="mt-16 p-6">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}

