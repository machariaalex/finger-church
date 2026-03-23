'use client';
import { useState } from 'react';
import { FaCalendar, FaUser } from 'react-icons/fa';

const dummyNews = [
  {
    _id: '1',
    title: 'Spring Gospel Meeting Announced',
    content: 'We are pleased to announce our upcoming Spring Gospel Meeting to be held April 14-18, 2025. Brother Mark Davis will be our speaker for the week. Services will be held nightly at 7:00 PM. Plan to attend and bring a friend!',
    author: 'Church Office',
    image: '/finger.jpg',
    createdAt: '2025-03-15T10:00:00',
  },
  {
    _id: '2',
    title: 'New Bible Class Materials Available',
    content: 'New Bible class materials for all age groups are now available in the foyer. Please pick up a copy for yourself and your family. These materials will be used in our upcoming quarter starting in April.',
    author: 'Education Committee',
    image: '/fings.jpg',
    createdAt: '2025-03-10T09:00:00',
  },
  {
    _id: '3',
    title: 'Building Fund Update',
    content: 'Thanks to the generosity of our congregation, we have reached 75% of our building fund goal. We are on track to begin renovations this summer. Thank you for your continued support and prayers.',
    author: 'Elders',
    image: '/finger.jpg',
    createdAt: '2025-03-05T14:00:00',
  },
  {
    _id: '4',
    title: 'Welcome New Members',
    content: 'Please join us in welcoming our newest members who were recently added to our congregation through baptism and restoration. We are so glad to have them as part of our church family.',
    author: 'Church Office',
    image: '/fings.jpg',
    createdAt: '2025-02-28T11:00:00',
  },
];

export default function NewsPage() {
  const [news] = useState(dummyNews);

  return (
    <div className="pt-16">
      <section className="bg-slate-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>News & Announcements</h1>
          <p className="text-slate-300 text-xl">Stay informed about church life</p>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {news.map((item, index) => (
              <div key={item._id} className={`card ${index === 0 ? 'lg:col-span-2' : ''}`}>
                {item.image && (
                  <div className={`overflow-hidden ${index === 0 ? 'aspect-video' : 'h-48'}`}>
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <FaCalendar className="text-amber-500" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaUser className="text-amber-500" />
                      {item.author}
                    </span>
                  </div>
                  <h3 className={`font-bold text-slate-800 mb-3 ${index === 0 ? 'text-3xl' : 'text-xl'}`}>{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
