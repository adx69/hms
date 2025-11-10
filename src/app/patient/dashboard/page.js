'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Receipt, Clock } from 'lucide-react';
import { appointmentsAPI, billingAPI } from '@/services/api';
import { useRouter } from 'next/navigation';

export default function PatientDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/patient/login');
      return;
    }
    if (session?.user?.role !== 'Patient') {
      router.push('/patient/login');
      return;
    }
    fetchData();
  }, [session, status, router]);

  const fetchData = async () => {
    try {
      const [appointmentsRes, billsRes] = await Promise.all([
        appointmentsAPI.getAll(),
        billingAPI.getAll(),
      ]);
      // Filter by patient email or ID if available
      setAppointments(appointmentsRes.data || []);
      setBills(billsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (session?.user?.role !== 'Patient') {
    return null;
  }

  const upcomingAppointments = appointments
    .filter((apt) => new Date(apt.date) >= new Date())
    .slice(0, 5);

  const pendingBills = bills.filter((bill) => bill.paymentStatus !== 'Paid');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-foreground">Patient Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {session?.user?.name}</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-border shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Bills</CardTitle>
              <Receipt className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingBills.length}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bills.length}</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length === 0 ? (
                <p className="text-muted-foreground">No upcoming appointments.</p>
              ) : (
                <div className="space-y-2">
                  {upcomingAppointments.map((apt) => (
                    <div
                      key={apt._id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {apt.date ? new Date(apt.date).toLocaleDateString() : 'N/A'}
                        </p>
                        <p className="text-sm text-muted-foreground">{apt.time}</p>
                        <p className="text-sm text-muted-foreground">
                          Dr. {apt.doctor?.name || 'N/A'}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {apt.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle>Pending Bills</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingBills.length === 0 ? (
                <p className="text-muted-foreground">No pending bills.</p>
              ) : (
                <div className="space-y-2">
                  {pendingBills.slice(0, 5).map((bill) => (
                    <div
                      key={bill._id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">${bill.amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {bill.createdAt
                            ? new Date(bill.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        {bill.paymentStatus}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}



