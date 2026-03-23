import Link from 'next/link';
import { FaCross, FaFacebook, FaYoutube, FaMapMarkerAlt, FaClock, FaPhone } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                <FaCross className="text-white text-lg" />
              </div>
              <div>
                <p className="font-bold text-white">Finger Church</p>
                <p className="text-amber-400 text-xs">of Christ</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Pointing the World to Jesus. We desire to be nothing more and nothing less than the church that belongs to Christ.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 bg-slate-700 hover:bg-amber-600 rounded-full flex items-center justify-center transition-colors">
                <FaFacebook />
              </a>
              <a href="#" className="w-9 h-9 bg-slate-700 hover:bg-amber-600 rounded-full flex items-center justify-center transition-colors">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/church', label: 'About Us' },
                { href: '/sermons', label: 'Sermons' },
                { href: '/events', label: 'Events' },
                { href: '/donations', label: 'Give Online' },
                { href: '/resources', label: 'Resources' },
                { href: '/news', label: 'News' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-amber-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Times */}
          <div>
            <h4 className="text-white font-semibold mb-4">Service Times</h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-amber-400 font-medium">Sunday</p>
                <p>Worship — 9:30 AM</p>
                <p>Bible Study — 10:30 AM</p>
                <p>Worship — 11:30 AM</p>
              </div>
              <div>
                <p className="text-amber-400 font-medium">Wednesday</p>
                <p>Bible Study — 6:00 PM</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex gap-2">
                <FaMapMarkerAlt className="text-amber-400 mt-1 flex-shrink-0" />
                <p>P.O. Box 37<br />2139 Finger Leapwood Road<br />Finger, TN 38334</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-700 py-4 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} Finger Church of Christ. All rights reserved.</p>
      </div>
    </footer>
  );
}
