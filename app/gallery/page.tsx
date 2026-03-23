'use client';
import { useState } from 'react';
import { FaTimes, FaImages } from 'react-icons/fa';

const dummyGallery = [
  { _id: '1', title: 'Sunday Worship Service', url: '/finger.jpg', type: 'image', category: 'Worship' },
  { _id: '2', title: 'Church Building', url: '/fings.jpg', type: 'image', category: 'Building' },
  { _id: '3', title: 'Bible Study Group', url: '/finger.jpg', type: 'image', category: 'Bible Study' },
  { _id: '4', title: 'Youth Event', url: '/fings.jpg', type: 'image', category: 'Youth' },
  { _id: '5', title: 'Baptism Service', url: '/finger.jpg', type: 'image', category: 'Worship' },
  { _id: '6', title: 'Fellowship Meal', url: '/fings.jpg', type: 'image', category: 'Fellowship' },
  { _id: '7', title: 'Gospel Meeting', url: '/finger.jpg', type: 'image', category: 'Special Events' },
  { _id: '8', title: 'Ladies Class', url: '/fings.jpg', type: 'image', category: 'Bible Study' },
];

export default function GalleryPage() {
  const [selected, setSelected] = useState<typeof dummyGallery[0] | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('');

  const categories = [...new Set(dummyGallery.map(i => i.category))];
  const filtered = categoryFilter ? dummyGallery.filter(i => i.category === categoryFilter) : dummyGallery;

  return (
    <div className="pt-16">
      <section className="bg-slate-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Gallery</h1>
          <p className="text-slate-300 text-xl">Moments from our church family</p>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            <button
              onClick={() => setCategoryFilter('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!categoryFilter ? 'bg-amber-600 text-white' : 'bg-white text-slate-600 hover:bg-amber-50'}`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${categoryFilter === cat ? 'bg-amber-600 text-white' : 'bg-white text-slate-600 hover:bg-amber-50'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <div
                key={item._id}
                className="aspect-square overflow-hidden rounded-xl cursor-pointer group relative"
                onClick={() => setSelected(item)}
              >
                <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <p className="text-white text-sm font-medium">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selected && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <button className="absolute top-4 right-4 text-white text-3xl hover:text-amber-400" onClick={() => setSelected(null)}>
            <FaTimes />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={selected.url} alt={selected.title} className="w-full max-h-[80vh] object-contain rounded-lg" />
            <div className="text-center mt-4">
              <p className="text-white text-xl font-semibold">{selected.title}</p>
              <p className="text-slate-400 text-sm">{selected.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
