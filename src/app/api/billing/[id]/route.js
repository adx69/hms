import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Bill from '@/models/Bill';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const bill = await Bill.findById(params.id)
      .populate('patient', 'name phone')
      .populate('appointment', 'date time');
    if (!bill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
    }
    return NextResponse.json(bill);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    await connectDB();

    // Validate required fields if provided
    if (body.amount !== undefined && body.amount <= 0) {
      return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 });
    }

    if (body.items !== undefined && body.items.length === 0) {
      return NextResponse.json({ error: 'At least one bill item is required' }, { status: 400 });
    }

    // Clean up the data - remove undefined fields
    const updateData = {};
    if (body.patient !== undefined) updateData.patient = body.patient;
    if (body.appointment !== undefined) updateData.appointment = body.appointment || null;
    if (body.amount !== undefined) updateData.amount = body.amount;
    if (body.items !== undefined) updateData.items = body.items;
    if (body.paymentStatus !== undefined) {
      updateData.paymentStatus = body.paymentStatus;
      // If marking as paid, set payment date
      if (body.paymentStatus === 'Paid' && !body.paymentDate) {
        updateData.paymentDate = new Date();
      } else if (body.paymentDate) {
        updateData.paymentDate = new Date(body.paymentDate);
      }
    }
    if (body.paymentDate !== undefined) {
      updateData.paymentDate = body.paymentDate ? new Date(body.paymentDate) : null;
    }

    const bill = await Bill.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('patient', 'name phone');
    
    if (bill?.appointment) {
      await bill.populate('appointment', 'date time');
    }

    if (!bill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
    }
    return NextResponse.json(bill);
  } catch (error) {
    console.error('Error updating bill:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update bill' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const bill = await Bill.findByIdAndDelete(params.id);
    if (!bill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

