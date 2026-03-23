'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { FaUser, FaCalendar, FaBookOpen, FaNewspaper, FaHeart, FaCross } from 'react-icons/fa';

const announcements = [
  { id: 1, title: 'Spring Gospel Meeting — April 14-18', date: 'March 15, 2025', content: 'Join us for a week of gospel messages. Services nightly at 7:00 PM.' },
  { id: 2, title: 'New Bible Class Materials', date: 'March 10, 2025', content: 'Pick up new quarterly materials in the foyer starting this Sunday.' },
  { id: 3, title: 'Building Fund Update', date: 'March 5, 2025', content: 'We have reached 75% of our goal! Thank you for your generous giving.' },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!session) return null;

  const user = session.user as any;

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
              {session.user?.name?.[0]?.toUpperCase() || 'M'}
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome, {session.user?.name}!</h1>
              <p className="text-amber-100">Member Dashboard — Finger Church of Christ</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-bold text-slate-800">Quick Access</h2>
            {[
              { href: '/sermons', icon: <FaBookOpen />, label: 'Watch Sermons', color: 'text-blue-600 bg-blue-50' },
              { href: '/events', icon: <FaCalendar />, label: 'View Events', color: 'text-green-600 bg-green-50' },
              { href: '/news', icon: <FaNewspaper />, label: 'Church News', color: 'text-purple-600 bg-purple-50' },
              { href: '/donations', icon: <FaHeart />, label: 'Give Online', color: 'text-red-600 bg-red-50' },
              { href: '/resources', icon: <FaCross />, label: 'Resources', color: 'text-amber-600 bg-amber-50' },
            ].map(link => (
              <Link key={link.href} href={link.href} className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className={`w-10 h-10 rounded-lg flex items-center justify-center ${link.color}`}>{link.icon}</span>
                <span className="font-medium text-slate-700">{link.label}</span>
              </Link>
            ))}

            {user?.role === 'admin' && (
              <Link href="/admin" className="flex items-center gap-3 bg-purple-600 text-white rounded-xl p-4 hover:bg-purple-700 transition-colors">
                <span className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center"><FaUser /></span>
                <span className="font-medium">Admin Dashboard</span>
              </Link>
            )}
          </div>

          {/* Announcements */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Member Announcements</h2>
            <div className="space-y-4">
              {announcements.map(a => (
                <div key={a.id} className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-amber-500">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-slate-800">{a.title}</h3>
                    <span className="text-xs text-slate-400">{a.date}</span>
                  </div>
                  <p className="text-slate-600 text-sm">{a.content}</p>
                </div>
              ))}
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><FaUser className="text-amber-600" /> My Profile</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Name</span>
                  <span className="font-medium text-slate-700">{session.user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email</span>
                  <span className="font-medium text-slate-700">{session.user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Role</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'}`}>{user?.role}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
