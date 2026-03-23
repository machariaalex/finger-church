'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  FaCalendarAlt, FaNewspaper, FaClock, FaMapMarkerAlt,
  FaChevronRight, FaSearch, FaFilter, FaArrowRight,
} from 'react-icons/fa';
import { MdOutlineEventNote } from 'react-icons/md';

type Tab = 'all' | 'events' | 'news';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
}

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  author: string;
  published: boolean;
  createdAt: string;
}

type FeedItem =
  | { kind: 'event'; data: Event }
  | { kind: 'news'; data: NewsItem };

const CATEGORY_COLORS: Record<string, string> = {
  Worship: 'bg-amber-100 text-amber-700',
  Youth: 'bg-blue-100 text-blue-700',
  Community: 'bg-green-100 text-green-700',
  Prayer: 'bg-purple-100 text-purple-700',
  General: 'bg-slate-100 text-slate-600',
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function isUpcoming(iso: string) {
  return new Date(iso) >= new Date();
}

/* ── Fallback demo data when API has nothing ── */
const demoEvents: Event[] = [
  {
    _id: 'e1', title: 'Sunday Morning Worship', description: 'Join us for our weekly worship service filled with praise, prayer, and powerful teaching from the Word.',
    date: new Date(Date.now() + 86400 * 2 * 1000).toISOString(), location: 'Main Auditorium', category: 'Worship',
  },
  {
    _id: 'e2', title: 'Youth Bible Study', description: 'A deep dive into scripture for our young adults and teens. Bring your Bible and come ready to grow.',
    date: new Date(Date.now() + 86400 * 5 * 1000).toISOString(), location: 'Youth Hall', category: 'Youth',
  },
  {
    _id: 'e3', title: 'Community Outreach Day', description: 'Serving our neighborhood through food drives, prayer walks, and community clean-up.',
    date: new Date(Date.now() + 86400 * 9 * 1000).toISOString(), location: 'Community Center', category: 'Community',
  },
  {
    _id: 'e4', title: 'Men\'s Prayer Breakfast', description: 'A powerful morning of intercession, fellowship, and breakfast for the men of the church.',
    date: new Date(Date.now() + 86400 * 14 * 1000).toISOString(), location: 'Fellowship Hall', category: 'Prayer',
  },
];

const demoNews: NewsItem[] = [
  {
    _id: 'n1', title: 'New Sunday School Classes Starting Next Month', author: 'Pastor John',
    content: 'We are thrilled to announce new discipleship classes for all age groups. These classes are designed to ground believers in the core doctrines of the faith and build lasting community bonds.',
    published: true, createdAt: new Date(Date.now() - 86400 * 2 * 1000).toISOString(),
  },
  {
    _id: 'n2', title: 'Mission Trip to Uganda — Team Applications Now Open', author: 'Missions Committee',
    content: 'Applications are now open for our summer mission trip. We will be partnering with local churches in Uganda for evangelism, Bible distribution, and community development work.',
    published: true, createdAt: new Date(Date.now() - 86400 * 5 * 1000).toISOString(),
  },
  {
    _id: 'n3', title: 'Building Fund Update: 60% of Goal Reached!', author: 'Church Office',
    content: 'Thanks to your generous giving, we have reached 60% of our building expansion fund goal. The new sanctuary will seat 500 and is expected to break ground later this year.',
    published: true, createdAt: new Date(Date.now() - 86400 * 8 * 1000).toISOString(),
  },
];

export default function CommunityPage() {
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    (async () => {
      try {
        const [evRes, nwRes] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/news'),
        ]);
        const evData = evRes.ok ? await evRes.json() : [];
        const nwData = nwRes.ok ? await nwRes.json() : [];
        setEvents(evData.length ? evData : demoEvents);
        setNews(nwData.length ? nwData : demoNews);
      } catch {
        setEvents(demoEvents);
        setNews(demoNews);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* Build merged feed sorted by date */
  const feed: FeedItem[] = [
    ...events.map(e => ({ kind: 'event' as const, data: e })),
    ...news.map(n => ({ kind: 'news' as const, data: n })),
  ].sort((a, b) => {
    const da = a.kind === 'event' ? new Date(a.data.date) : new Date((a.data as NewsItem).createdAt);
    const db = b.kind === 'event' ? new Date(b.data.date) : new Date((b.data as NewsItem).createdAt);
    return db.getTime() - da.getTime();
  });

  const filtered = feed.filter(item => {
    if (tab === 'events' && item.kind !== 'event') return false;
    if (tab === 'news' && item.kind !== 'news') return false;
    const text = item.kind === 'event'
      ? `${item.data.title} ${item.data.description} ${item.data.location}`
      : `${item.data.title} ${(item.data as NewsItem).content} ${(item.data as NewsItem).author}`;
    return text.toLowerCase().includes(search.toLowerCase());
  });

  const upcomingEvents = events.filter(e => isUpcoming(e.date)).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <div ref={heroRef} className="relative h-[55vh] min-h-[400px] overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900" />
          {/* decorative orbs */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
            className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-purple-500/20 rounded-full blur-3xl"
          />
        </motion.div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-semibold px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
              <MdOutlineEventNote /> Stay Connected
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Community Hub
            </h1>
            <p className="text-white/70 text-lg max-w-lg mx-auto">
              Events, announcements, and news from the Finger Church family.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── UPCOMING EVENTS STRIP ── */}
      {upcomingEvents.length > 0 && (
        <div className="bg-amber-600 py-4 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto flex items-center gap-6 overflow-x-auto scrollbar-hide">
            <span className="text-white font-bold text-xs uppercase tracking-wider whitespace-nowrap flex-shrink-0">
              Coming Up
            </span>
            <div className="w-px h-4 bg-white/30 flex-shrink-0" />
            {upcomingEvents.map((ev, i) => (
              <motion.button
                key={ev._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedEvent(ev)}
                className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-4 py-2 text-white text-sm whitespace-nowrap transition-all flex-shrink-0"
              >
                <FaCalendarAlt className="text-white/70 text-xs" />
                <span className="font-medium">{ev.title}</span>
                <span className="text-white/60">·</span>
                <span className="text-white/70">{formatDate(ev.date)}</span>
                <FaChevronRight className="text-xs text-white/50" />
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-10">
          {/* Tabs */}
          <div className="flex bg-slate-100 rounded-xl p-1 gap-0.5">
            {([
              { id: 'all', label: 'All', icon: <FaFilter className="text-xs" /> },
              { id: 'events', label: 'Events', icon: <FaCalendarAlt className="text-xs" /> },
              { id: 'news', label: 'News', icon: <FaNewspaper className="text-xs" /> },
            ] as { id: Tab; label: string; icon: React.ReactNode }[]).map(t => (
              <motion.button
                key={t.id}
                onClick={() => setTab(t.id)}
                whileTap={{ scale: 0.96 }}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  tab === t.id ? 'text-slate-800' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab === t.id && (
                  <motion.span
                    layoutId="tab-bg"
                    className="absolute inset-0 bg-white shadow-sm rounded-lg"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">{t.icon} {t.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
            />
          </div>
        </div>

        {/* Feed */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-100 rounded-2xl h-52 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <FaSearch className="text-4xl mx-auto mb-3 opacity-30" />
            <p>No results found.</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                item.kind === 'event'
                  ? <EventCard key={item.data._id} event={item.data} index={i} onOpen={setSelectedEvent} />
                  : <NewsCard key={item.data._id} article={item.data as NewsItem} index={i} onOpen={setSelectedNews} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* ── EVENT MODAL ── */}
      <AnimatePresence>
        {selectedEvent && (
          <Modal onClose={() => setSelectedEvent(null)}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaCalendarAlt className="text-amber-600" />
              </div>
              <div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[selectedEvent.category] || CATEGORY_COLORS.General}`}>
                  {selectedEvent.category}
                </span>
                <h2 className="text-xl font-bold text-slate-800 mt-1">{selectedEvent.title}</h2>
              </div>
            </div>
            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <FaCalendarAlt className="text-amber-500" />
                <span>{formatDate(selectedEvent.date)}</span>
                <span className="text-slate-300">·</span>
                <FaClock className="text-amber-500" />
                <span>{formatTime(selectedEvent.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <FaMapMarkerAlt className="text-amber-500" />
                <span>{selectedEvent.location}</span>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed">{selectedEvent.description}</p>
          </Modal>
        )}
      </AnimatePresence>

      {/* ── NEWS MODAL ── */}
      <AnimatePresence>
        {selectedNews && (
          <Modal onClose={() => setSelectedNews(null)}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaNewspaper className="text-blue-600" />
              </div>
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">News</span>
                <h2 className="text-xl font-bold text-slate-800 mt-1">{selectedNews.title}</h2>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-5">
              <span>By {selectedNews.author}</span>
              <span className="text-slate-200">·</span>
              <span>{formatDate(selectedNews.createdAt)}</span>
            </div>
            <p className="text-slate-600 leading-relaxed">{selectedNews.content}</p>
          </Modal>
        )}
      </AnimatePresence>

    </div>
  );
}

/* ── EVENT CARD ── */
function EventCard({ event, index, onOpen }: { event: Event; index: number; onOpen: (e: Event) => void }) {
  const upcoming = isUpcoming(event.date);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ y: -4 }}
      onClick={() => onOpen(event)}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group"
    >
      {/* Color accent bar */}
      <div className={`h-1.5 w-full ${upcoming ? 'bg-amber-500' : 'bg-slate-300'}`} />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[event.category] || CATEGORY_COLORS.General}`}>
            {event.category}
          </span>
          {upcoming ? (
            <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Upcoming
            </span>
          ) : (
            <span className="text-xs text-slate-400">Past</span>
          )}
        </div>

        <h3 className="font-bold text-slate-800 text-lg mb-3 group-hover:text-amber-600 transition-colors line-clamp-2">
          {event.title}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-4">{event.description}</p>

        <div className="space-y-1.5 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-amber-400" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-amber-400" />
            <span>{formatTime(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-amber-400" />
            <span>{event.location}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-end">
          <span className="text-xs font-semibold text-amber-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            View details <FaArrowRight />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── NEWS CARD ── */
function NewsCard({ article, index, onOpen }: { article: NewsItem; index: number; onOpen: (n: NewsItem) => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ y: -4 }}
      onClick={() => onOpen(article)}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group"
    >
      <div className="h-1.5 w-full bg-blue-500" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
            News
          </span>
          <span className="text-xs text-slate-400">{formatDate(article.createdAt)}</span>
        </div>

        <h3 className="font-bold text-slate-800 text-lg mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-3 mb-4">{article.content}</p>

        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-400">By {article.author}</span>
          <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            Read more <FaArrowRight />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── MODAL ── */
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 transition-colors"
        >
          ×
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}
