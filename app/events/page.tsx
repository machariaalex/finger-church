'use client';
import { useState, useEffect } from 'react';
import { FaCalendar, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

interface ChurchEvent {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  image?: string;
}

const dummyEvents: ChurchEvent[] = [
  { _id: '1', title: 'Sunday Morning Worship', description: 'Join us for our regular Sunday morning worship service. All are welcome!', date: '2025-03-30T09:30:00', location: '2139 Finger Leapwood Road, Finger, TN', category: 'Worship', image: '/finger.jpg' },
  { _id: '2', title: 'Bible Study Wednesday', description: 'Mid-week Bible study for all ages. Bring your Bible!', date: '2025-04-02T18:00:00', location: '2139 Finger Leapwood Road, Finger, TN', category: 'Bible Study', image: '/fings.jpg' },
  { _id: '3', title: 'Spring Gospel Meeting', description: 'A week-long gospel meeting with special speakers. Plan to attend nightly!', date: '2025-04-14T19:00:00', location: '2139 Finger Leapwood Road, Finger, TN', category: 'Special Event', image: '/finger.jpg' },
  { _id: '4', title: 'Youth Devotional', description: 'Youth group devotional and fellowship. Parents welcome too!', date: '2025-04-19T17:00:00', location: '2139 Finger Leapwood Road, Finger, TN', category: 'Youth', image: '/fings.jpg' },
  { _id: '5', title: 'Ladies Bible Class', description: 'Monthly ladies Bible class and fellowship luncheon.', date: '2025-04-26T10:00:00', location: '2139 Finger Leapwood Road, Finger, TN', category: 'Fellowship', image: '/finger.jpg' },
];

const categoryColors: Record<string, string> = {
  Worship: 'bg-blue-100 text-blue-700',
  'Bible Study': 'bg-green-100 text-green-700',
  'Special Event': 'bg-purple-100 text-purple-700',
  Youth: 'bg-yellow-100 text-yellow-700',
  Fellowship: 'bg-pink-100 text-pink-700',
};

export default function EventsPage() {
  const [events] = useState<ChurchEvent[]>(dummyEvents);

  return (
    <div className="pt-16">
      <section className="bg-slate-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Events</h1>
          <p className="text-slate-300 text-xl">Stay connected with what's happening at Finger Church</p>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="space-y-6">
            {events.map((event) => {
              const date = new Date(event.date);
              return (
                <div key={event._id} className="card flex flex-col md:flex-row overflow-hidden">
                  {event.image && (
                    <div className="md:w-56 flex-shrink-0">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover min-h-[200px]" />
                    </div>
                  )}
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                      <div>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${categoryColors[event.category] || 'bg-slate-100 text-slate-600'}`}>
                          {event.category}
                        </span>
                        <h3 className="text-2xl font-bold text-slate-800 mt-2">{event.title}</h3>
                      </div>
                      <div className="bg-amber-600 text-white rounded-xl p-3 text-center min-w-[60px]">
                        <p className="text-2xl font-bold">{date.getDate()}</p>
                        <p className="text-xs">{date.toLocaleString('default', { month: 'short' })}</p>
                      </div>
                    </div>
                    <p className="text-slate-600 mb-4">{event.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <FaClock className="text-amber-500" />
                        {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaMapMarkerAlt className="text-amber-500" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
