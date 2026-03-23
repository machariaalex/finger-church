import { FaPhone, FaCross } from 'react-icons/fa';

const deacons = [
  { name: 'Richard England', phone: '731-217-3580' },
  { name: 'Rusty Hicks', phone: '731-434-7366' },
  { name: 'Rodney Weaver', phone: '731-610-4907' },
];

const preachers = [
  { name: 'Ian Shoemate', phone: '423-298-6084' },
  { name: 'Tucker Cates', phone: '903-814-5727' },
  { name: 'Ben Flatt', phone: '731-435-0111' },
];

const works = [
  'Jeff Archey',
  'International Gospel Hour',
  'Randy Gardner Family (Quechee, Vermont)',
  'Will Hanstein',
  'Southeast Institute of Biblical Studies (Knoxville, Tennessee)',
  'Lance Mosher Family (Jackson)',
  'Rocco Pierce Family',
  'Pacific Islands',
  'Daren Schroeder (Romania)',
  'Port-au-Prince, Haiti',
  'Various Student Campaigns',
];

function LeaderCard({ name, phone, role }: { name: string; phone: string; role: string }) {
  return (
    <div className="card p-6 flex items-center gap-4">
      <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
        <FaCross className="text-amber-600 text-xl" />
      </div>
      <div>
        <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide">{role}</p>
        <h3 className="font-bold text-slate-800 text-lg">{name}</h3>
        <a href={`tel:${phone}`} className="flex items-center gap-1 text-slate-500 hover:text-amber-600 text-sm mt-1">
          <FaPhone size={12} /> {phone}
        </a>
      </div>
    </div>
  );
}

export default function ChurchPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-slate-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center">
              <FaCross className="text-white text-2xl" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>The Church</h1>
          <p className="text-slate-300 text-xl italic">"We desire to be nothing more and nothing less than the church that belongs to Christ."</p>
        </div>
      </section>

      {/* About */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-amber-600 font-semibold uppercase tracking-widest text-sm mb-2">About Us</p>
              <h2 className="section-title">Who We Are</h2>
              <p className="text-slate-600 leading-relaxed text-lg mb-4">
                The Finger church of Christ desires to live up to the description on its sign. We desire to be nothing more and nothing less than the church that belongs to Christ. We, the members, invite you to see whether or not we are identical to the church of Christ.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Located in Finger, Tennessee, our congregation has been faithfully serving God and our community. We are committed to following the New Testament pattern for the church, worshipping in spirit and in truth, and spreading the gospel of Jesus Christ.
              </p>
            </div>
            <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
              <img src="/finger.jpg" alt="Finger Church" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-amber-600 font-semibold uppercase tracking-widest text-sm mb-2">Our Leadership</p>
            <h2 className="section-title">Meet Our Leaders</h2>
          </div>

          <div className="mb-12">
            <h3 className="text-2xl font-bold text-slate-700 mb-6 text-center">Preachers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {preachers.map((p) => (
                <LeaderCard key={p.name} name={p.name} phone={p.phone} role="Preacher" />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-slate-700 mb-6 text-center">Deacons</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {deacons.map((d) => (
                <LeaderCard key={d.name} name={d.name} phone={d.phone} role="Deacon" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Works We Support */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-amber-600 font-semibold uppercase tracking-widest text-sm mb-2">Our Reach</p>
            <h2 className="section-title">Works We Support</h2>
            <p className="section-subtitle">We are committed to spreading the gospel locally and around the world.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {works.map((work) => (
              <div key={work} className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-center gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0" />
                <p className="text-slate-700 font-medium">{work}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Times */}
      <section className="py-20 bg-slate-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="section-title text-white mb-10">Service Times</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4 text-amber-400">Sunday</h3>
              <ul className="space-y-2 text-slate-300">
                <li>Worship — 9:30 AM</li>
                <li>Bible Study — 10:30 AM</li>
                <li>Second Worship — 11:30 AM</li>
              </ul>
            </div>
            <div className="bg-slate-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4 text-amber-400">Wednesday</h3>
              <ul className="space-y-2 text-slate-300">
                <li>Bible Study — 6:00 PM</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
