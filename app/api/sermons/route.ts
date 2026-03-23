import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Sermon from '@/lib/models/Sermon';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const speaker = searchParams.get('speaker');
  const topic = searchParams.get('topic');
  const type = searchParams.get('type');

  const query: any = {};
  if (speaker) query.speaker = { $regex: speaker, $options: 'i' };
  if (topic) query.topic = { $regex: topic, $options: 'i' };
  if (type) query.type = type;

  const sermons = await Sermon.find(query).sort({ date: -1 });
  return NextResponse.json(sermons);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();
  const data = await req.json();
  const sermon = await Sermon.create(data);
  return NextResponse.json(sermon, { status: 201 });
}
