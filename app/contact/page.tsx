'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaClock, FaPhone, FaEnvelope, FaCross, FaCheckCircle, FaPaperPlane } from 'react-icons/fa';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import toast from 'react-hot-toast';

const subjects = [
  'General Inquiry',
  'Prayer Request',
  'Visit Our Church',
  'Bible Study',
  'Counseling',
  'Missions & Outreach',
  'Other',
];

const contactInfo = [
  {
    icon: <FaMapMarkerAlt className="text-xl" />,
    label: 'Address',
    value: '2139 Finger Leapwood Road',
    sub: 'Finger, TN 38334 · P.O. Box 37',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: <FaClock className="text-xl" />,
    label: 'Service Times',
    value: 'Sun: 9:30 AM · 10:30 AM · 11:30 AM',
    sub: 'Wed: Bible Study 6:00 PM',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: <FaPhone className="text-xl" />,
    label: 'Preachers',
    value: 'Ian Shoemate — 423-298-6084',
    sub: 'Tucker Cates — 903-814-5727',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: <FaEnvelope className="text-xl" />,
    label: 'Email',
    value: 'info@fingercofc.org',
    sub: 'We respond within 24 hours',
    color: 'bg-violet-50 text-violet-600',
  },
];

const inputClass =
  'w-full px-4 py-3.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white placeholder:text-slate-400';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSent(true);
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative bg-slate-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 7, repeat: Infinity }} className="absolute top-0 right-0 w-96 h-96 bg-amber-600 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 9, repeat: Infinity, delay: 2 }} className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-600/40">
              <FaEnvelope className="text-white text-2xl" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>Get In Touch</h1>
            <p className="text-slate-300 text-xl max-w-xl mx-auto">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Left — contact info */}
            <div className="lg:col-span-2 space-y-5">
              {contactInfo.map((info, i) => (
                <AnimateOnScroll key={info.label} delay={i * 0.1} direction="right">
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-start gap-4"
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${info.color}`}>
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{info.label}</p>
                      <p className="font-semibold text-slate-800 text-sm">{info.value}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{info.sub}</p>
                    </div>
                  </motion.div>
                </AnimateOnScroll>
              ))}

              {/* Map placeholder */}
              <AnimateOnScroll delay={0.4} direction="right">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                  <iframe
                    title="Finger Church Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3260!2d-88.49!3d35.21!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDEyJzM2LjAiTiA4OMKwMjknMjQuMCJX!5e0!3m2!1sen!2sus!4v1234567890"
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    className="grayscale hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="p-4">
                    <p className="text-sm font-medium text-slate-700">2139 Finger Leapwood Road</p>
                    <p className="text-xs text-slate-400">Finger, TN 38334</p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>

            {/* Right — form */}
            <AnimateOnScroll direction="left" delay={0.1} className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', bounce: 0.4 }}
                    className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 flex flex-col items-center justify-center text-center h-full min-h-[500px]"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
                      className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
                    >
                      <FaCheckCircle className="text-green-500 text-4xl" />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                      <h3 className="text-3xl font-bold text-slate-800 mb-3">Message Sent!</h3>
                      <p className="text-slate-500 text-lg mb-2">Thank you, <strong className="text-slate-700">{form.name}</strong>.</p>
                      <p className="text-slate-400 text-sm max-w-xs mx-auto">
                        We've received your message and will get back to you at <strong>{form.email}</strong> within 24 hours.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                        className="mt-8 btn-primary rounded-full px-8"
                      >
                        Send Another Message
                      </motion.button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
                  >
                    <div className="p-8 border-b border-slate-100">
                      <h2 className="text-2xl font-bold text-slate-800 mb-1">Send a Message</h2>
                      <p className="text-slate-400 text-sm">Fields marked <span className="text-amber-600">*</span> are required.</p>
                    </div>

                    <div className="p-8 space-y-5">
                      {/* Name + Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                            Full Name <span className="text-amber-600">*</span>
                          </label>
                          <motion.div animate={focused === 'name' ? { scale: 1.01 } : { scale: 1 }} transition={{ duration: 0.15 }}>
                            <input
                              type="text"
                              required
                              placeholder="John Smith"
                              value={form.name}
                              onChange={set('name')}
                              onFocus={() => setFocused('name')}
                              onBlur={() => setFocused('')}
                              className={inputClass}
                            />
                          </motion.div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                            Email <span className="text-amber-600">*</span>
                          </label>
                          <motion.div animate={focused === 'email' ? { scale: 1.01 } : { scale: 1 }} transition={{ duration: 0.15 }}>
                            <input
                              type="email"
                              required
                              placeholder="you@example.com"
                              value={form.email}
                              onChange={set('email')}
                              onFocus={() => setFocused('email')}
                              onBlur={() => setFocused('')}
                              className={inputClass}
                            />
                          </motion.div>
                        </div>
                      </div>

                      {/* Phone + Subject */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Phone (optional)</label>
                          <motion.div animate={focused === 'phone' ? { scale: 1.01 } : { scale: 1 }} transition={{ duration: 0.15 }}>
                            <input
                              type="tel"
                              placeholder="(555) 000-0000"
                              value={form.phone}
                              onChange={set('phone')}
                              onFocus={() => setFocused('phone')}
                              onBlur={() => setFocused('')}
                              className={inputClass}
                            />
                          </motion.div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                            Subject <span className="text-amber-600">*</span>
                          </label>
                          <select
                            required
                            value={form.subject}
                            onChange={set('subject')}
                            className={inputClass}
                          >
                            <option value="" disabled>Select a subject…</option>
                            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                          Message <span className="text-amber-600">*</span>
                        </label>
                        <motion.div animate={focused === 'message' ? { scale: 1.005 } : { scale: 1 }} transition={{ duration: 0.15 }}>
                          <textarea
                            required
                            rows={5}
                            placeholder="How can we help you? Share your prayer requests, questions, or anything on your heart…"
                            value={form.message}
                            onChange={set('message')}
                            onFocus={() => setFocused('message')}
                            onBlur={() => setFocused('')}
                            className={`${inputClass} resize-none`}
                          />
                        </motion.div>
                        <p className="text-right text-xs text-slate-400">{form.message.length} / 1000</p>
                      </div>

                      {/* Submit */}
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={!loading ? { y: -2, boxShadow: '0 12px 40px rgba(217,119,6,0.35)' } : {}}
                        whileTap={!loading ? { scale: 0.98 } : {}}
                        className="w-full py-4 rounded-2xl bg-amber-600 text-white font-bold text-base flex items-center justify-center gap-3 shadow-lg shadow-amber-600/30 hover:bg-amber-500 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />
                            Sending…
                          </>
                        ) : (
                          <>
                            <FaPaperPlane className="text-sm" />
                            Send Message
                          </>
                        )}
                      </motion.button>

                      <p className="text-center text-xs text-slate-400">
                        Or reach us directly at{' '}
                        <a href="tel:4232986084" className="text-amber-600 hover:underline font-medium">423-298-6084</a>
                      </p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Bottom CTA strip */}
      <section className="bg-slate-900 py-14 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AnimateOnScroll>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center">
                <FaCross className="text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>Come Worship With Us</h2>
            <p className="text-slate-400 mb-6">You are always welcome at Finger Church of Christ.</p>
            <div className="flex flex-wrap gap-3 justify-center text-sm">
              <span className="bg-slate-800 border border-slate-700 rounded-full px-4 py-2 text-slate-300">📍 2139 Finger Leapwood Road, TN</span>
              <span className="bg-slate-800 border border-slate-700 rounded-full px-4 py-2 text-slate-300">⛪ Sunday 9:30 AM</span>
              <span className="bg-slate-800 border border-slate-700 rounded-full px-4 py-2 text-slate-300">📖 Wednesday 6:00 PM</span>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}
