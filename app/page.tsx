'use client';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { FaPlay, FaCalendar, FaHeart, FaCross, FaArrowRight, FaMapMarkerAlt, FaBook, FaUsers, FaYoutube, FaFacebook } from 'react-icons/fa';
import { MdAccessTime } from 'react-icons/md';
import AnimateOnScroll from '@/components/AnimateOnScroll';

/* ── data ── */
const stats = [
  { value: 50, suffix: '+', label: 'Years of Faith' },
  { value: 3, suffix: '', label: 'Preachers' },
  { value: 11, suffix: '+', label: 'Mission Works' },
  { value: 4, suffix: '', label: 'Weekly Services' },
];

const featuredSermons = [
  { title: 'The Purpose of the Church', speaker: 'Ian Shoemate', date: 'March 16, 2025', type: 'video', thumbnail: '/finger.jpg' },
  { title: 'Walking in Faith', speaker: 'Tucker Cates', date: 'March 9, 2025', type: 'audio', thumbnail: '/fings.jpg' },
  { title: 'The Power of Prayer', speaker: 'Ben Flatt', date: 'March 2, 2025', type: 'written', thumbnail: '/finger.jpg' },
];

const serviceTimes = [
  { day: 'Sunday', services: ['Worship — 9:30 AM', 'Bible Study — 10:30 AM', 'Worship — 11:30 AM'] },
  { day: 'Wednesday', services: ['Bible Study — 6:00 PM'] },
];

/* ── animated counter ── */
function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      let start = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        start += step;
        if (start >= target) { setCount(target); clearInterval(timer); }
        else setCount(Math.floor(start));
      }, 16);
      observer.disconnect();
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ── marquee ── */
const marqueeItems = ['Sunday Worship 9:30 AM', 'Bible Study 10:30 AM', 'Second Worship 11:30 AM', 'Wednesday Bible Study 6:00 PM', 'Pointing the World to Jesus', 'Finger, Tennessee'];

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-[-8%] bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/finger.jpg')" }}
            animate={{
              scale: [1, 1.08, 1.04, 1.1, 1],
              x: ['0%', '1.5%', '-1%', '1%', '0%'],
              y: ['0%', '-1%', '1.5%', '-0.5%', '0%'],
            }}
            transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90" />

        {/* floating orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />
          <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 8, repeat: Infinity, delay: 2 }} className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl" />
        </div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }} className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-amber-600 rounded-full flex items-center justify-center shadow-2xl shadow-amber-600/50">
                <FaCross className="text-white text-4xl" />
              </div>
              <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute inset-0 w-24 h-24 bg-amber-400 rounded-full" />
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }} className="text-6xl md:text-8xl font-bold mb-4 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
            Finger Church
            <motion.span initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.5 }} className="block text-amber-400">of Christ</motion.span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }} className="text-xl md:text-2xl text-slate-200 mb-6 italic">
            "Pointing the World to Jesus"
          </motion.p>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.9 }} className="text-slate-300 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            We desire to be nothing more and nothing less than the church that belongs to Christ.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.1 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/church" className="group relative overflow-hidden bg-amber-600 hover:bg-amber-500 text-white font-semibold py-4 px-10 rounded-full transition-all duration-300 shadow-2xl shadow-amber-600/40 hover:shadow-amber-500/60 hover:-translate-y-1">
              <span className="relative z-10">Join Us This Sunday</span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
            </Link>
            <Link href="/sermons" className="group border-2 border-white/60 text-white hover:bg-white hover:text-slate-800 font-semibold py-4 px-10 rounded-full transition-all duration-300 backdrop-blur-sm hover:-translate-y-1">
              Watch Sermons
            </Link>
          </motion.div>
        </motion.div>

        {/* scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-white/50 text-xs uppercase tracking-widest">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1 h-3 bg-white/60 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="bg-amber-600 py-4 overflow-hidden">
        <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="flex gap-12 whitespace-nowrap w-max">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="text-white font-semibold text-sm flex items-center gap-3">
              <FaCross className="text-amber-200 text-xs" /> {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── STATS ── */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <AnimateOnScroll key={s.label} delay={i * 0.1} direction="up">
                <div className="text-center group">
                  <div className="text-5xl md:text-6xl font-bold text-amber-400 mb-2">
                    <Counter target={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-slate-400 font-medium uppercase tracking-widest text-xs">{s.label}</div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimateOnScroll direction="right">
              <p className="text-amber-600 font-semibold uppercase tracking-widest text-sm mb-3">Who We Are</p>
              <h2 className="section-title mb-6">The Finger Church<br />of Christ</h2>
              <p className="text-slate-600 leading-relaxed text-lg mb-4">
                The Finger church of Christ desires to live up to the description on its sign. We desire to be nothing more and nothing less than the church that belongs to Christ.
              </p>
              <p className="text-slate-500 leading-relaxed mb-8">
                We, the members, invite you to see whether or not we are identical to the church of Christ. Come join us this Sunday.
              </p>
              <Link href="/church" className="group inline-flex items-center gap-3 bg-slate-900 text-white py-3.5 px-8 rounded-full font-semibold hover:bg-amber-600 transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-amber-600/40">
                Learn More
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <FaArrowRight className="text-sm" />
                </motion.span>
              </Link>
            </AnimateOnScroll>

            <AnimateOnScroll direction="left" delay={0.2}>
              <div className="relative">
                <div className="absolute -inset-4 bg-amber-600/10 rounded-3xl rotate-3" />
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <img src="/fings.jpg" alt="Finger Church" className="w-full h-full object-cover" />
                </div>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.4, type: 'spring' }} className="absolute -bottom-6 -left-6 bg-amber-600 text-white rounded-2xl p-5 shadow-2xl shadow-amber-600/40">
                  <p className="font-bold text-xl">Est. in Faith</p>
                  <p className="text-amber-100 text-sm">Finger, Tennessee</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, type: 'spring' }} className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-slate-600 text-sm font-medium">Services every week</span>
                  </div>
                </motion.div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ── SERMONS ── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <AnimateOnScroll>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-amber-600 font-semibold uppercase tracking-widest text-sm mb-2">Recent Messages</p>
                <h2 className="section-title mb-0">Featured Sermons</h2>
              </div>
              <Link href="/sermons" className="hidden md:flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-colors font-medium text-sm">
                View all <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredSermons.map((sermon, i) => (
              <AnimateOnScroll key={sermon.title} delay={i * 0.12} direction="up">
                <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-500 group cursor-pointer">
                  <div className="relative aspect-video overflow-hidden">
                    <img src={sermon.thumbnail} alt={sermon.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <motion.div whileHover={{ scale: 1.1 }} className="w-14 h-14 bg-amber-600 rounded-full flex items-center justify-center shadow-lg">
                        <FaPlay className="text-white ml-1 text-lg" />
                      </motion.div>
                    </div>
                    <span className="absolute top-3 right-3 bg-amber-600 text-white text-xs px-3 py-1 rounded-full uppercase font-semibold backdrop-blur-sm">
                      {sermon.type}
                    </span>
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide">{sermon.date}</p>
                    <h3 className="font-bold text-slate-800 text-xl mb-1 group-hover:text-amber-600 transition-colors">{sermon.title}</h3>
                    <p className="text-amber-600 text-sm font-medium">{sermon.speaker}</p>
                  </div>
                </motion.div>
              </AnimateOnScroll>
            ))}
          </div>

          <AnimateOnScroll delay={0.3}>
            <div className="text-center mt-10">
              <Link href="/sermons" className="btn-primary inline-flex items-center gap-2 rounded-full px-8">
                View All Sermons <FaArrowRight />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── SERVICE TIMES ── */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} className="absolute -top-40 -right-40 w-96 h-96 border border-amber-600/10 rounded-full" />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 80, repeat: Infinity, ease: 'linear' }} className="absolute -bottom-40 -left-40 w-[600px] h-[600px] border border-amber-600/5 rounded-full" />
        </div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <AnimateOnScroll>
            <div className="text-center mb-16">
              <p className="text-amber-400 font-semibold uppercase tracking-widest text-sm mb-2">Plan Your Visit</p>
              <h2 className="section-title text-white">Service Times</h2>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {serviceTimes.map((item, i) => (
              <AnimateOnScroll key={item.day} delay={i * 0.15} direction="up">
                <motion.div whileHover={{ scale: 1.02 }} className="bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/60 hover:border-amber-600/40 transition-colors">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-amber-600/20 rounded-xl flex items-center justify-center">
                      <MdAccessTime className="text-amber-400 text-xl" />
                    </div>
                    <h3 className="text-2xl font-bold">{item.day}</h3>
                  </div>
                  <ul className="space-y-3">
                    {item.services.map((s, j) => (
                      <motion.li key={s} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 + j * 0.1 }} className="flex items-center gap-3 text-slate-300">
                        <span className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0" />
                        {s}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </AnimateOnScroll>
            ))}
          </div>
          <AnimateOnScroll delay={0.3}>
            <div className="text-center mt-10">
              <div className="inline-flex items-center gap-2 text-slate-400 bg-slate-800/50 backdrop-blur-sm px-5 py-3 rounded-full border border-slate-700/50">
                <FaMapMarkerAlt className="text-amber-400" />
                <span>2139 Finger Leapwood Road, Finger, TN 38334</span>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 relative overflow-hidden bg-amber-600">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-0 right-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <motion.div animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 7, repeat: Infinity, delay: 2 }} className="absolute bottom-0 left-0 w-96 h-96 bg-amber-700 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <AnimateOnScroll>
            <h2 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
              Come Worship<br />With Us
            </h2>
            <p className="text-amber-100 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              We invite you to join us this Sunday and experience the love of God together as a family.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/church" className="group bg-white text-amber-600 hover:bg-slate-900 hover:text-white font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-2xl hover:-translate-y-1">
                About Our Church
              </Link>
              <Link href="/donations" className="group border-2 border-white/60 text-white hover:bg-white hover:text-amber-600 font-bold py-4 px-10 rounded-full transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
                Support Our Ministry
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

    </div>
  );
}
