'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCross, FaCheckCircle, FaHourglassHalf, FaShieldAlt, FaUsers } from 'react-icons/fa';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
      } else {
        setSubmitted(true);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <AnimatePresence mode="wait">

          {/* SUCCESS STATE */}
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="text-center"
            >
              {/* Animated check */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/30"
              >
                <FaCheckCircle className="text-white text-4xl" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Application Received!</h1>
                <p className="text-slate-500 mb-8">Welcome, {form.name.split(' ')[0]}. Your membership application has been submitted.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6 text-left space-y-4"
              >
                {[
                  {
                    icon: <FaHourglassHalf className="text-amber-500" />,
                    bg: 'bg-amber-50',
                    title: 'Pending Review',
                    desc: 'A church administrator will review your application and approve or decline it.',
                  },
                  {
                    icon: <FaShieldAlt className="text-blue-500" />,
                    bg: 'bg-blue-50',
                    title: 'You\'ll Be Notified',
                    desc: 'Once a decision is made, you can sign in to your account via the Members Portal.',
                  },
                  {
                    icon: <FaUsers className="text-purple-500" />,
                    bg: 'bg-purple-50',
                    title: 'Join the Community',
                    desc: 'Approved members gain access to exclusive resources, sermons, and announcements.',
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="flex gap-4 items-start"
                  >
                    <div className={`w-9 h-9 ${item.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{item.title}</p>
                      <p className="text-slate-500 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Link
                  href="/login"
                  className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-semibold py-3 rounded-xl text-center text-sm shadow-md shadow-amber-600/25 transition-all"
                >
                  Go to Members Portal
                </Link>
                <Link
                  href="/"
                  className="flex-1 border border-slate-200 text-slate-600 hover:border-amber-300 hover:text-amber-600 font-semibold py-3 rounded-xl text-center text-sm transition-all"
                >
                  Back to Home
                </Link>
              </motion.div>
            </motion.div>

          ) : (

            /* FORM STATE */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-600/30"
                >
                  <FaCross className="text-white text-2xl" />
                </motion.div>
                <h1 className="text-3xl font-bold text-slate-800">Apply for Membership</h1>
                <p className="text-slate-500 mt-2">Submit your application to join Finger Church of Christ</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {[
                    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Smith' },
                    { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
                    { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
                    { key: 'confirm', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{field.label}</label>
                      <input
                        type={field.type}
                        required
                        value={form[field.key as keyof typeof form]}
                        onChange={e => { setForm({ ...form, [field.key]: e.target.value }); setError(''); }}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}

                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Info note */}
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-2 items-start">
                    <FaHourglassHalf className="text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-amber-700 text-xs leading-relaxed">
                      After submitting, your application will be reviewed by a church administrator. You'll be able to sign in once approved.
                    </p>
                  </div>

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
                    {loading ? 'Submitting Application...' : 'Submit Application'}
                  </motion.button>
                </form>

                <p className="text-center text-slate-500 text-sm mt-6">
                  Already a member?{' '}
                  <Link href="/login" className="text-amber-600 font-semibold hover:underline">
                    Members Portal
                  </Link>
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
