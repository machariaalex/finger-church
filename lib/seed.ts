import connectDB from './db';
import User from './models/User';
import Sermon from './models/Sermon';
import Event from './models/Event';
import News from './models/News';
import bcrypt from 'bcryptjs';

async function seed() {
  await connectDB();

  // Create admin user
  const existingAdmin = await User.findOne({ email: 'admin@fingercofc.org' });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin@1234', 12);
    await User.create({
      name: 'Admin User',
      email: 'admin@fingercofc.org',
      password: hashedPassword,
      role: 'admin',
    });
    console.log('Admin user created: admin@fingercofc.org / Admin@1234');
  }

  // Seed sermons
  const sermonCount = await Sermon.countDocuments();
  if (sermonCount === 0) {
    await Sermon.insertMany([
      { title: 'The Purpose of the Church', speaker: 'Ian Shoemate', date: new Date('2025-03-16'), topic: 'Church', type: 'video', url: 'https://www.youtube.com/watch?v=example1', description: 'Understanding why the church exists.' },
      { title: 'Walking in Faith', speaker: 'Tucker Cates', date: new Date('2025-03-09'), topic: 'Faith', type: 'audio', url: '#', description: 'How to walk by faith, not by sight.' },
      { title: 'The Power of Prayer', speaker: 'Ben Flatt', date: new Date('2025-03-02'), topic: 'Prayer', type: 'written', url: '#', description: 'The transformative power of prayer.' },
    ]);
    console.log('Sermons seeded');
  }

  // Seed events
  const eventCount = await Event.countDocuments();
  if (eventCount === 0) {
    await Event.insertMany([
      { title: 'Sunday Morning Worship', description: 'Join us for our regular Sunday morning worship service.', date: new Date('2025-03-30T09:30:00'), location: '2139 Finger Leapwood Road, Finger, TN', category: 'Worship' },
      { title: 'Spring Gospel Meeting', description: 'A week-long gospel meeting with special speakers.', date: new Date('2025-04-14T19:00:00'), location: '2139 Finger Leapwood Road, Finger, TN', category: 'Special Event' },
    ]);
    console.log('Events seeded');
  }

  // Seed news
  const newsCount = await News.countDocuments();
  if (newsCount === 0) {
    await News.insertMany([
      { title: 'Spring Gospel Meeting Announced', content: 'We are pleased to announce our upcoming Spring Gospel Meeting to be held April 14-18, 2025.', author: 'Church Office', published: true },
      { title: 'New Bible Class Materials Available', content: 'New Bible class materials for all age groups are now available in the foyer.', author: 'Education Committee', published: true },
    ]);
    console.log('News seeded');
  }

  console.log('Database seeded successfully!');
  process.exit(0);
}

seed().catch(console.error);
