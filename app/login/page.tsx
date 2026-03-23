'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCross, FaEye, FaEyeSlash, FaHourglassHalf, FaTimesCircle } from 'react-icons/fa';

type Banner = 'pending' | 'rejected' | null;

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState<Banner>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setBanner(null);
    try {
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (result?.error === 'PENDING_APPROVAL') {
        setBanner('pending');
      } else if (result?.error === 'ACCOUNT_REJECTED') {
        setBanner('rejected');
      } else if (result?.error) {
        setBanner(null);
        // show inline error via state
        setLoginError('Invalid email or password');
      } else {
        router.push('/dashboard');
      }
    } catch {
      setLoginError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const [loginError, setLoginError] = useState('');

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-600/30"
          >
            <FaCross className="text-white text-2xl" />
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-800">Members Portal</h1>
          <p className="text-slate-500 mt-2">Sign in to your member account</p>
        </motion.div>

        {/* Status Banners */}
        <AnimatePresence mode="wait">
          {banner === 'pending' && (
            <motion.div
              key="pending-banner"
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.3 }}
              className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4 items-start"
            >
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaHourglassHalf className="text-amber-600 text-lg" />
              </div>
              <div>
                <p className="font-semibold text-amber-800">Application Pending Review</p>
                <p className="text-amber-700 text-sm mt-1">
                  Your membership application has been received and is awaiting approval from a church administrator. You'll be able to sign in once approved.
                </p>
              </div>
            </motion.div>
          )}
          {banner === 'rejected' && (
            <motion.div
              key="rejected-banner"
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.3 }}
              className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-5 flex gap-4 items-start"
            >
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaTimesCircle className="text-red-500 text-lg" />
              </div>
              <div>
                <p className="font-semibold text-red-800">Application Not Approved</p>
                <p className="text-red-700 text-sm mt-1">
                  Unfortunately your membership application was not approved at this time. Please contact the church office for more information.
                </p>
                <a href="/contact" className="text-red-600 text-sm font-semibold underline mt-2 inline-block hover:text-red-700">
                  Contact Us →
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => { setForm({ ...form, email: e.target.value }); setLoginError(''); }}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => { setForm({ ...form, password: e.target.value }); setLoginError(''); }}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 pr-12 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {loginError && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg"
                >
                  {loginError}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold py-3 rounded-xl shadow-md shadow-amber-600/25 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Not yet a member?{' '}
            <Link href="/register" className="text-amber-600 font-semibold hover:underline">
              Apply for Membership
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
