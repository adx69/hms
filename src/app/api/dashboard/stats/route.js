import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Patient from '@/models/Patient';
import Doctor from '@/models/Doctor';
import Appointment from '@/models/Appointment';
import Bill from '@/models/Bill';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const [totalPatients, totalDoctors, totalAppointments, bills] = await Promise.all([
      Patient.countDocuments(),
      Doctor.countDocuments(),
      Appointment.countDocuments(),
      Bill.find(),
    ]);

    const totalRevenue = bills.reduce((sum, bill) => {
      if (bill.paymentStatus === 'Paid') {
        return sum + bill.amount;
      }
      return sum;
    }, 0);

    return NextResponse.json({
      totalPatients,
      totalDoctors,
      totalAppointments,
      totalRevenue,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



