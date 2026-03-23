'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaCross } from 'react-icons/fa';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/church', label: 'About Us' },
  { href: '/sermons', label: 'Sermons' },
  { href: '/community', label: 'Community' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/resources', label: 'Resources' },
  { href: '/donations', label: 'Give' },
  { href: '/contact', label: 'Contact' },
  { href: '/login', label: 'Members Portal' },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close mobile menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-slate-200/60'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center shadow-md shadow-amber-600/30"
            >
              <FaCross className="text-white text-base" />
            </motion.div>
            <div>
              <p className="font-bold text-slate-800 text-sm leading-tight">Finger Church</p>
              <p className="text-amber-600 text-xs">of Christ</p>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.4 }}
              >
                <Link
                  href={link.href}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-lg group ${
                    isActive(link.href)
                      ? 'text-amber-600'
                      : 'text-slate-600 hover:text-amber-600'
                  }`}
                >
                  {/* hover bg pill */}
                  <motion.span
                    className="absolute inset-0 bg-amber-50 rounded-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.15 }}
                  />
                  <span className="relative z-10">{link.label}</span>
                  {/* active underline */}
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0.5 left-3 right-3 h-0.5 bg-amber-600 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden lg:flex items-center gap-2">
            {session ? (
              <>
                {(session.user as any)?.role === 'admin' && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/admin" className="text-sm text-purple-600 font-semibold px-3 py-1.5 rounded-lg hover:bg-purple-50 transition-colors">
                      Admin
                    </Link>
                  </motion.div>
                )}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/dashboard" className="text-sm text-slate-600 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                    Dashboard
                  </Link>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => signOut()}
                  className="text-sm border border-slate-200 text-slate-600 hover:border-amber-400 hover:text-amber-600 font-medium py-1.5 px-4 rounded-full transition-all duration-200"
                >
                  Sign Out
                </motion.button>
              </>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/register"
                  className="relative overflow-hidden text-sm bg-amber-600 text-white font-semibold py-2 px-5 rounded-full shadow-md shadow-amber-600/30 hover:shadow-amber-600/50 hover:bg-amber-500 transition-all duration-200 group"
                >
                  <span className="relative z-10">Apply for Membership</span>
                  <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-12" />
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile hamburger */}
          <motion.button
            className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
            onClick={() => setOpen(!open)}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <FaTimes size={18} className="text-slate-700" />
                </motion.span>
              ) : (
                <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <FaBars size={18} className="text-slate-700" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-md border-t border-slate-100"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? 'bg-amber-50 text-amber-600'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-amber-600'
                    }`}
                  >
                    {isActive(link.href) && (
                      <span className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
                    )}
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="border-t border-slate-100 pt-3 mt-3 flex flex-col gap-2"
              >
                {session ? (
                  <>
                    <Link href="/dashboard" className="px-4 py-2.5 text-sm text-slate-600 hover:text-amber-600 font-medium rounded-xl hover:bg-slate-50 transition-colors">
                      Dashboard
                    </Link>
                    <button onClick={() => signOut()} className="mx-4 py-2 text-sm border border-slate-200 rounded-full text-slate-600 hover:border-amber-400 hover:text-amber-600 transition-all">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="px-4 py-2.5 text-sm text-slate-600 hover:text-amber-600 font-medium rounded-xl hover:bg-slate-50 transition-colors">
                      Members Portal
                    </Link>
                    <Link href="/register" className="mx-4 py-2.5 text-sm bg-amber-600 text-white font-semibold rounded-full text-center hover:bg-amber-500 transition-colors shadow-md shadow-amber-600/30">
                      Apply for Membership
                    </Link>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
