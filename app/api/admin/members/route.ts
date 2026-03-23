import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

function adminOnly(session: any) {
  return !session || (session.user as any)?.role !== 'admin';
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (adminOnly(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const query = status ? { status } : {};
  const users = await User.find(query).select('-password').sort({ createdAt: -1 });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (adminOnly(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const { name, email, password, role, status } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
  }
  const existing = await User.findOne({ email });
  if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    password: hashed,
    role: role || 'member',
    status: status || 'approved',
  });
  const { password: _, ...safe } = user.toObject();
  return NextResponse.json(safe, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (adminOnly(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const { id, status, role, name, email } = await req.json();
  const update: any = {};
  if (status) {
    if (!['approved', 'rejected', 'pending'].includes(status))
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    update.status = status;
  }
  if (role) {
    if (!['member', 'admin'].includes(role))
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    update.role = role;
  }
  if (name) update.name = name;
  if (email) update.email = email;
  const user = await User.findByIdAndUpdate(id, update, { new: true }).select('-password');
  return NextResponse.json(user);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (adminOnly(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await connectDB();
  const { id } = await req.json();
  const selfId = (session!.user as any).id;
  if (id === selfId) return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
  await User.findByIdAndDelete(id);
  return NextResponse.json({ message: 'Deleted' });
}
