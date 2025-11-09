import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Bill from '@/models/Bill';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const bills = await Bill.find()
      .populate('patient', 'name phone')
      .populate('appointment', 'date time')
      .sort({ createdAt: -1 });
    return NextResponse.json(bills);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    await connectDB();

    // Validate required fields
    if (!body.patient) {
      return NextResponse.json({ error: 'Patient is required' }, { status: 400 });
    }

    if (!body.amount || body.amount <= 0) {
      return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 });
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: 'At least one bill item is required' }, { status: 400 });
    }

    // Clean up the data - remove undefined fields
    const billData = {
      patient: body.patient,
      appointment: body.appointment || undefined,
      amount: body.amount,
      items: body.items,
      paymentStatus: body.paymentStatus || 'Pending',
      paymentDate: body.paymentDate || undefined,
    };

    const bill = new Bill(billData);
    await bill.save();
    await bill.populate('patient', 'name phone');
    if (bill.appointment) {
      await bill.populate('appointment', 'date time');
    }
    return NextResponse.json(bill, { status: 201 });
  } catch (error) {
    console.error('Error creating bill:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create bill' },
      { status: 500 }
    );
  }
}

