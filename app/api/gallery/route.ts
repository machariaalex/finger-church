import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Gallery from '@/lib/models/Gallery';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  await connectDB();
  const items = await Gallery.find().sort({ createdAt: -1 });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();
  const data = await req.json();
  const item = await Gallery.create(data);
  return NextResponse.json(item, { status: 201 });
}
