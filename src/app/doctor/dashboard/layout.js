'use client';

import { SessionProvider } from 'next-auth/react';

export default function DoctorDashboardLayout({ children }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-background">
        <nav className="border-b border-border bg-card shadow-sm">
          <div className="container mx-auto flex h-16 items-center justify-between px-6">
            <h1 className="text-xl font-bold text-foreground">Doctor Portal</h1>
            <div className="flex items-center gap-4">
              <a href="/doctor/login" className="text-sm text-muted-foreground hover:text-foreground">
                Logout
              </a>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </div>
    </SessionProvider>
  );
}

