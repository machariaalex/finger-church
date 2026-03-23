'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaLock, FaChurch, FaGlobe, FaBook, FaCheckCircle, FaCopy, FaArrowRight } from 'react-icons/fa';
import { SiCashapp, SiPaypal, SiVisa, SiMastercard, SiZelle } from 'react-icons/si';
import { MdAccountBalance } from 'react-icons/md';
import AnimateOnScroll from '@/components/AnimateOnScroll';

const amounts = [25, 50, 100, 250, 500];

const purposes = [
  { value: 'general', label: 'General Fund', icon: <FaChurch /> },
  { value: 'missions', label: 'Missions & Outreach', icon: <FaGlobe /> },
  { value: 'education', label: 'Bible Education', icon: <FaBook /> },
  { value: 'building', label: 'Building Fund', icon: <FaChurch /> },
];

const platforms = [
  {
    id: 'cashapp',
    label: 'Cash App',
    icon: <SiCashapp className="text-2xl" />,
    color: 'bg-[#00D632]',
    lightColor: 'bg-green-50 border-green-200',
    activeColor: 'bg-green-500',
    description: 'Send instantly via Cash App',
    cashtag: '$FingerCoC',
    instructions: 'Open Cash App and send to the $Cashtag below. Add your name and purpose in the note.',
  },
  {
    id: 'paypal',
    label: 'PayPal',
    icon: <SiPaypal className="text-2xl" />,
    color: 'bg-[#003087]',
    lightColor: 'bg-blue-50 border-blue-200',
    activeColor: 'bg-blue-600',
    description: 'Secure PayPal payment',
    handle: 'fingerchurchofchrist@gmail.com',
    instructions: 'Send via PayPal to the email below. Select "Friends & Family" to avoid fees.',
  },
  {
    id: 'zelle',
    label: 'Zelle',
    icon: <SiZelle className="text-2xl" />,
    color: 'bg-[#6D1ED4]',
    lightColor: 'bg-violet-50 border-violet-200',
    activeColor: 'bg-violet-600',
    description: 'Bank-to-bank via Zelle',
    handle: '731-555-0100',
    instructions: 'Open your banking app and send via Zelle to the number below. Add your name in the memo.',
  },
  {
    id: 'card',
    label: 'Debit / Credit',
    icon: (
      <div className="flex gap-1">
        <SiVisa className="text-xl" />
        <SiMastercard className="text-xl" />
      </div>
    ),
    color: 'bg-slate-800',
    lightColor: 'bg-slate-50 border-slate-200',
    activeColor: 'bg-slate-700',
    description: 'Visa, Mastercard & more',
    instructions: 'Enter your card details below to give securely through our payment processor.',
  },
  {
    id: 'bank',
    label: 'Bank Transfer',
    icon: <MdAccountBalance className="text-2xl" />,
    color: 'bg-amber-600',
    lightColor: 'bg-amber-50 border-amber-200',
    activeColor: 'bg-amber-600',
    description: 'Direct ACH bank transfer',
    routingNumber: '064000017',
    accountNumber: '****4892',
    instructions: 'Use the routing and account numbers below for a direct ACH transfer from your bank.',
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-amber-600 transition-colors">
      {copied ? <FaCheckCircle className="text-green-500" /> : <FaCopy />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

export default function DonationsPage() {
  const [amount, setAmount] = useState<number | ''>('');
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [purpose, setPurpose] = useState('general');
  const [platform, setPlatform] = useState('cashapp');
  const [form, setForm] = useState({ name: '', email: '', cardNumber: '', expiry: '', cvv: '' });
  const [submitted, setSubmitted] = useState(false);

  const finalAmount = amount || parseFloat(customAmount) || 0;
  const selectedPlatform = platforms.find(p => p.id === platform)!;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="pt-16 min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FaHeart className="text-green-500 text-4xl" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Thank You!</h2>
            <p className="text-slate-600 text-lg mb-2">
              Your generous gift of <strong className="text-amber-600">${finalAmount}</strong> via{' '}
              <strong>{selectedPlatform.label}</strong> will help further the work of the Lord.
            </p>
            <p className="text-slate-400 text-sm mt-4">A confirmation will be sent to {form.email}</p>
            <button onClick={() => setSubmitted(false)} className="btn-primary mt-8 rounded-full px-8">
              Make Another Gift
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative bg-slate-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-0 right-0 w-96 h-96 bg-amber-600 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 8, repeat: Infinity, delay: 2 }} className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-600/40">
              <FaHeart className="text-white text-2xl" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>Give Online</h1>
            <p className="text-slate-300 text-xl">Support the work of the Lord at Finger Church of Christ</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Sidebar */}
            <AnimateOnScroll direction="right" className="lg:col-span-1 space-y-5">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <FaHeart className="text-amber-600 text-2xl mb-3" />
                <h3 className="font-bold text-slate-800 text-lg mb-2">Your Gift Matters</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Every dollar given supports local worship, Bible education, world missions, and community outreach.</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 space-y-3">
                <h4 className="font-bold text-slate-800 mb-1">How We Use Your Gift</h4>
                {purposes.map(p => (
                  <div key={p.value} className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="text-amber-600">{p.icon}</span>
                    {p.label}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 bg-white rounded-xl p-4 border border-slate-100">
                <FaLock className="text-green-500 flex-shrink-0" />
                <span>All transactions are secure and encrypted</span>
              </div>
            </AnimateOnScroll>

            {/* Main form */}
            <AnimateOnScroll direction="left" delay={0.1} className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">

                {/* Frequency */}
                <div className="p-8 border-b border-slate-100">
                  <label className="block text-sm font-semibold text-slate-700 mb-4">Giving Frequency</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['one-time', 'monthly'] as const).map(f => (
                      <motion.button
                        key={f}
                        type="button"
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setFrequency(f)}
                        className={`py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                          frequency === f
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {f === 'one-time' ? 'One-Time' : '🔁 Monthly'}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Amount */}
                <div className="p-8 border-b border-slate-100">
                  <label className="block text-sm font-semibold text-slate-700 mb-4">Select Amount</label>
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {amounts.map(a => (
                      <motion.button
                        key={a}
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { setAmount(a); setCustomAmount(''); }}
                        className={`py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          amount === a
                            ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                            : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-600'
                        }`}
                      >
                        ${a}
                      </motion.button>
                    ))}
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                    <input
                      type="number"
                      placeholder="Other amount"
                      value={customAmount}
                      onChange={e => { setCustomAmount(e.target.value); setAmount(''); }}
                      className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Platform selector */}
                <div className="p-8 border-b border-slate-100">
                  <label className="block text-sm font-semibold text-slate-700 mb-4">Choose Payment Method</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {platforms.map(p => (
                      <motion.button
                        key={p.id}
                        type="button"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setPlatform(p.id)}
                        className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-sm font-medium transition-all duration-200 ${
                          platform === p.id
                            ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-md shadow-amber-100'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {platform === p.id && (
                          <motion.span
                            layoutId="platform-check"
                            className="absolute top-2 right-2 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center"
                          >
                            <FaCheckCircle className="text-white text-xs" />
                          </motion.span>
                        )}
                        <span className={platform === p.id ? 'text-amber-600' : 'text-slate-500'}>
                          {p.icon}
                        </span>
                        <span className="text-xs font-semibold">{p.label}</span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Platform instructions */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={platform}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100"
                    >
                      <p className="text-sm text-slate-600 mb-3">{selectedPlatform.instructions}</p>

                      {/* CashApp */}
                      {platform === 'cashapp' && (
                        <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-green-100">
                          <div className="flex items-center gap-2">
                            <SiCashapp className="text-[#00D632]" />
                            <span className="font-bold text-slate-800">{selectedPlatform.cashtag}</span>
                          </div>
                          <CopyButton text={selectedPlatform.cashtag!} />
                        </div>
                      )}

                      {/* PayPal */}
                      {platform === 'paypal' && (
                        <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-blue-100">
                          <span className="font-mono text-sm text-slate-700">{selectedPlatform.handle}</span>
                          <CopyButton text={selectedPlatform.handle!} />
                        </div>
                      )}

                      {/* Zelle */}
                      {platform === 'zelle' && (
                        <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-violet-100">
                          <span className="font-mono text-sm text-slate-700">{selectedPlatform.handle}</span>
                          <CopyButton text={selectedPlatform.handle!} />
                        </div>
                      )}

                      {/* Bank */}
                      {platform === 'bank' && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-amber-100">
                            <div>
                              <p className="text-xs text-slate-400 mb-0.5">Routing Number</p>
                              <span className="font-mono text-sm font-semibold text-slate-800">{selectedPlatform.routingNumber}</span>
                            </div>
                            <CopyButton text={selectedPlatform.routingNumber!} />
                          </div>
                          <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-amber-100">
                            <div>
                              <p className="text-xs text-slate-400 mb-0.5">Account Number</p>
                              <span className="font-mono text-sm font-semibold text-slate-800">{selectedPlatform.accountNumber}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Purpose */}
                <div className="p-8 border-b border-slate-100">
                  <label className="block text-sm font-semibold text-slate-700 mb-4">Giving Purpose</label>
                  <div className="grid grid-cols-2 gap-2">
                    {purposes.map(p => (
                      <motion.button
                        key={p.value}
                        type="button"
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setPurpose(p.value)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all duration-200 ${
                          purpose === p.value
                            ? 'border-amber-500 bg-amber-50 text-amber-700'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span className={purpose === p.value ? 'text-amber-600' : 'text-slate-400'}>{p.icon}</span>
                        {p.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Contact + Card fields */}
                <div className="p-8 space-y-4">
                  <label className="block text-sm font-semibold text-slate-700">Your Details</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  {/* Card fields — only shown for card platform */}
                  <AnimatePresence>
                    {platform === 'card' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden space-y-4"
                      >
                        <div>
                          <label className="block text-xs text-slate-500 mb-1.5">Card Number</label>
                          <input
                            type="text"
                            maxLength={19}
                            placeholder="1234 5678 9012 3456"
                            value={form.cardNumber}
                            onChange={e => setForm({ ...form, cardNumber: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-slate-500 mb-1.5">Expiry</label>
                            <input
                              type="text"
                              placeholder="MM / YY"
                              maxLength={7}
                              value={form.expiry}
                              onChange={e => setForm({ ...form, expiry: e.target.value })}
                              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-500 mb-1.5">CVV</label>
                            <input
                              type="text"
                              placeholder="•••"
                              maxLength={4}
                              value={form.cvv}
                              onChange={e => setForm({ ...form, cvv: e.target.value })}
                              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    disabled={!finalAmount}
                    whileHover={finalAmount ? { scale: 1.01, y: -1 } : {}}
                    whileTap={finalAmount ? { scale: 0.98 } : {}}
                    className="w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed bg-amber-600 text-white shadow-xl shadow-amber-600/30 hover:bg-amber-500 hover:shadow-amber-500/40"
                  >
                    <FaHeart className="text-sm" />
                    {finalAmount
                      ? `Give $${finalAmount}${frequency === 'monthly' ? ' / mo' : ''} via ${selectedPlatform.label}`
                      : 'Select an Amount to Continue'}
                    {finalAmount && <FaArrowRight className="text-sm" />}
                  </motion.button>

                  <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1">
                    <FaLock className="text-green-400" /> Secure & encrypted
                  </p>
                </div>
              </form>
            </AnimateOnScroll>
          </div>
        </div>
      </section>
    </div>
  );
}
