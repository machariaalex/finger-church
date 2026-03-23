'use client';
import { useState, useEffect } from 'react';
import { FaPlay, FaHeadphones, FaFileAlt, FaSearch } from 'react-icons/fa';

interface Sermon {
  _id: string;
  title: string;
  speaker: string;
  date: string;
  topic: string;
  type: 'video' | 'audio' | 'written';
  url: string;
  description: string;
  thumbnail?: string;
}

const dummySermons: Sermon[] = [
  { _id: '1', title: 'The Purpose of the Church', speaker: 'Ian Shoemate', date: '2025-03-16', topic: 'Church', type: 'video', url: '#', description: 'A deep dive into why the church exists and our role in it.', thumbnail: '/finger.jpg' },
  { _id: '2', title: 'Walking in Faith', speaker: 'Tucker Cates', date: '2025-03-09', topic: 'Faith', type: 'audio', url: '#', description: 'How to walk in faith even when the path is unclear.', thumbnail: '/fings.jpg' },
  { _id: '3', title: 'The Power of Prayer', speaker: 'Ben Flatt', date: '2025-03-02', topic: 'Prayer', type: 'written', url: '#', description: 'Understanding the transformative power of prayer in daily life.', thumbnail: '/finger.jpg' },
  { _id: '4', title: 'Grace and Truth', speaker: 'Ian Shoemate', date: '2025-02-23', topic: 'Grace', type: 'video', url: '#', description: 'Balancing grace and truth in our Christian walk.', thumbnail: '/fings.jpg' },
  { _id: '5', title: 'The Great Commission', speaker: 'Tucker Cates', date: '2025-02-16', topic: 'Evangelism', type: 'audio', url: '#', description: 'Our calling to share the gospel with the world.', thumbnail: '/finger.jpg' },
  { _id: '6', title: 'Love One Another', speaker: 'Ben Flatt', date: '2025-02-09', topic: 'Love', type: 'written', url: '#', description: "Christ's command to love one another as He loved us.", thumbnail: '/fings.jpg' },
];

const typeIcon = { video: <FaPlay />, audio: <FaHeadphones />, written: <FaFileAlt /> };
const typeColor = { video: 'bg-blue-100 text-blue-600', audio: 'bg-green-100 text-green-600', written: 'bg-purple-100 text-purple-600' };

export default function SermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>(dummySermons);
  const [filtered, setFiltered] = useState<Sermon[]>(dummySermons);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [speakerFilter, setSpeakerFilter] = useState('');

  useEffect(() => {
    let result = sermons;
    if (search) result = result.filter(s => s.title.toLowerCase().includes(search.toLowerCase()) || s.topic.toLowerCase().includes(search.toLowerCase()));
    if (typeFilter) result = result.filter(s => s.type === typeFilter);
    if (speakerFilter) result = result.filter(s => s.speaker === speakerFilter);
    setFiltered(result);
  }, [search, typeFilter, speakerFilter, sermons]);

  const speakers = [...new Set(sermons.map(s => s.speaker))];

  return (
    <div className="pt-16">
      <section className="bg-slate-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Sermons</h1>
          <p className="text-slate-300 text-xl">Feed your soul with God's Word</p>
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search sermons..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="">All Types</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
                <option value="written">Written</option>
              </select>
              <select
                value={speakerFilter}
                onChange={(e) => setSpeakerFilter(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="">All Speakers</option>
                {speakers.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Sermon Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((sermon) => (
              <div key={sermon._id} className="card group">
                <div className="relative aspect-video overflow-hidden">
                  <img src={sermon.thumbnail || '/finger.jpg'} alt={sermon.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white">
                      {typeIcon[sermon.type]}
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${typeColor[sermon.type]}`}>
                      {typeIcon[sermon.type]} {sermon.type}
                    </span>
                    <span className="text-xs text-slate-400">{new Date(sermon.date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg mb-1">{sermon.title}</h3>
                  <p className="text-amber-600 text-sm mb-2">{sermon.speaker}</p>
                  <p className="text-slate-500 text-sm line-clamp-2">{sermon.description}</p>
                  <a href={sermon.url} className="mt-4 btn-primary text-sm py-2 block text-center">
                    {sermon.type === 'written' ? 'Read' : sermon.type === 'audio' ? 'Listen' : 'Watch'}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              <FaSearch className="mx-auto text-4xl mb-4" />
              <p className="text-xl">No sermons found matching your filters.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
