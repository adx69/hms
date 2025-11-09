import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    await connectDB();

    const users = [
      {
        name: 'Admin',
        email: 'admin@hospital.com',
        password: 'admin123',
        role: 'Admin',
      },
      {
        name: 'Dr. John Smith',
        email: 'doctor@hospital.com',
        password: 'doctor123',
        role: 'Doctor',
      },
      {
        name: 'Jane Doe',
        email: 'patient@example.com',
        password: 'patient123',
        role: 'Patient',
      },
    ];

    const createdUsers = [];
    const existingUsers = [];

    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        existingUsers.push(userData.email);
        continue;
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
      });

      await user.save();
      createdUsers.push({
        email: userData.email,
        password: userData.password,
        role: userData.role,
      });
    }

    return NextResponse.json({
      message: 'Users created successfully',
      created: createdUsers,
      existing: existingUsers,
      credentials: createdUsers.length > 0 ? createdUsers : [
        { email: 'admin@hospital.com', password: 'admin123', role: 'Admin' },
        { email: 'doctor@hospital.com', password: 'doctor123', role: 'Doctor' },
        { email: 'patient@example.com', password: 'patient123', role: 'Patient' },
      ],
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
