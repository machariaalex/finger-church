import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import News from '@/lib/models/News';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  await connectDB();
  const news = await News.find({ published: true }).sort({ createdAt: -1 });
  return NextResponse.json(news);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();
  const data = await req.json();
  const news = await News.create(data);
  return NextResponse.json(news, { status: 201 });
}
