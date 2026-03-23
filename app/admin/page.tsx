'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FaPlus, FaTrash, FaEdit, FaBook, FaCalendar, FaNewspaper,
  FaImages, FaUsers, FaCheckCircle, FaTimesCircle, FaHourglassHalf,
  FaTimes, FaSearch, FaShieldAlt, FaUserPlus, FaLink,
} from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

type Tab = 'overview' | 'sermons' | 'events' | 'news' | 'gallery' | 'resources' | 'members';

/* ── shared helpers ── */
function adminFetch(url: string, options?: RequestInit) {
  return fetch(url, { ...options, headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) } });
}

function confirm(msg: string): Promise<boolean> {
  return new Promise(resolve => resolve(window.confirm(msg)));
}

/* ── Modal wrapper ── */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
            <FaTimes className="text-slate-500 text-sm" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </motion.div>
  );
}

/* ── Field component ── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls = 'w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all';

/* ══════════════════════════════════════════
   SERMONS PANEL
══════════════════════════════════════════ */
function SermonsPanel() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<any>(null);
  const blank = { title: '', speaker: '', date: '', topic: '', type: 'video', url: '', description: '' };
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await adminFetch('/api/sermons');
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm(blank); setModal('add'); };
  const openEdit = (item: any) => {
    setEditing(item);
    setForm({ title: item.title, speaker: item.speaker, date: item.date?.slice(0, 10) || '', topic: item.topic, type: item.type, url: item.url, description: item.description || '' });
    setModal('edit');
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = modal === 'add'
        ? await adminFetch('/api/sermons', { method: 'POST', body: JSON.stringify(form) })
        : await adminFetch(`/api/sermons/${editing._id}`, { method: 'PUT', body: JSON.stringify(form) });
      if (res.ok) { toast.success(modal === 'add' ? 'Sermon added!' : 'Sermon updated!'); setModal(null); load(); }
      else { const d = await res.json(); toast.error(d.error || 'Failed'); }
    } finally { setSaving(false); }
  };

  const del = async (id: string, title: string) => {
    if (!await confirm(`Delete "${title}"?`)) return;
    const res = await adminFetch(`/api/sermons/${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Deleted'); load(); } else toast.error('Failed to delete');
  };

  const filtered = items.filter(i => `${i.title} ${i.speaker} ${i.topic}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <PanelHeader title="Sermons" count={items.length} onAdd={openAdd} search={search} onSearch={setSearch} addLabel="Add Sermon" />
      {loading ? <Spinner /> : filtered.length === 0 ? <Empty text="No sermons found" /> : (
        <div className="space-y-3">
          {filtered.map(item => (
            <ItemRow key={item._id}
              title={item.title}
              meta={`${item.speaker} · ${new Date(item.date).toLocaleDateString()} · ${item.type}`}
              badge={item.type}
              badgeColor={item.type === 'video' ? 'bg-blue-100 text-blue-700' : item.type === 'audio' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}
              onEdit={() => openEdit(item)}
              onDelete={() => del(item._id, item.title)}
            />
          ))}
        </div>
      )}
      <AnimatePresence>
        {modal && (
          <Modal title={modal === 'add' ? 'Add Sermon' : 'Edit Sermon'} onClose={() => setModal(null)}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Title"><input className={inputCls} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Sermon title" /></Field>
                <Field label="Speaker"><input className={inputCls} value={form.speaker} onChange={e => setForm({ ...form, speaker: e.target.value })} placeholder="Speaker name" /></Field>
                <Field label="Date"><input type="date" className={inputCls} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></Field>
                <Field label="Topic"><input className={inputCls} value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} placeholder="e.g. Grace" /></Field>
                <Field label="Type">
                  <select className={inputCls} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                    <option value="written">Written</option>
                  </select>
                </Field>
                <Field label="URL"><input className={inputCls} value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." /></Field>
              </div>
              <Field label="Description">
                <textarea className={inputCls} rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description..." />
              </Field>
              <SaveButton saving={saving} onClick={save} />
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

/* ══════════════════════════════════════════
   EVENTS PANEL
══════════════════════════════════════════ */
function EventsPanel() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<any>(null);
  const blank = { title: '', description: '', date: '', location: '', category: 'General' };
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await adminFetch('/api/events');
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openEdit = (item: any) => {
    setEditing(item);
    setForm({ title: item.title, description: item.description, date: item.date?.slice(0, 16) || '', location: item.location, category: item.category || 'General' });
    setModal('edit');
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = modal === 'add'
        ? await adminFetch('/api/events', { method: 'POST', body: JSON.stringify(form) })
        : await adminFetch(`/api/events/${editing._id}`, { method: 'PUT', body: JSON.stringify(form) });
      if (res.ok) { toast.success(modal === 'add' ? 'Event added!' : 'Event updated!'); setModal(null); load(); }
      else { const d = await res.json(); toast.error(d.error || 'Failed'); }
    } finally { setSaving(false); }
  };

  const del = async (id: string, title: string) => {
    if (!await confirm(`Delete "${title}"?`)) return;
    const res = await adminFetch(`/api/events/${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Deleted'); load(); } else toast.error('Failed to delete');
  };

  const filtered = items.filter(i => `${i.title} ${i.location} ${i.category}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <PanelHeader title="Events" count={items.length} onAdd={() => { setForm(blank); setModal('add'); }} search={search} onSearch={setSearch} addLabel="Add Event" />
      {loading ? <Spinner /> : filtered.length === 0 ? <Empty text="No events found" /> : (
        <div className="space-y-3">
          {filtered.map(item => (
            <ItemRow key={item._id}
              title={item.title}
              meta={`${new Date(item.date).toLocaleString()} · ${item.location}`}
              badge={item.category}
              badgeColor="bg-emerald-100 text-emerald-700"
              onEdit={() => openEdit(item)}
              onDelete={() => del(item._id, item.title)}
            />
          ))}
        </div>
      )}
      <AnimatePresence>
        {modal && (
          <Modal title={modal === 'add' ? 'Add Event' : 'Edit Event'} onClose={() => setModal(null)}>
            <div className="space-y-4">
              <Field label="Title"><input className={inputCls} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Event title" /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Date & Time"><input type="datetime-local" className={inputCls} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></Field>
                <Field label="Location"><input className={inputCls} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Main Hall" /></Field>
                <Field label="Category"><input className={inputCls} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. Worship" /></Field>
              </div>
              <Field label="Description">
                <textarea className={inputCls} rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Event description..." />
              </Field>
              <SaveButton saving={saving} onClick={save} />
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

/* ══════════════════════════════════════════
   NEWS PANEL
══════════════════════════════════════════ */
function NewsPanel() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<any>(null);
  const blank = { title: '', content: '', author: '', published: true };
  const [form, setForm] = useState<typeof blank & { published: boolean }>(blank);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await adminFetch('/api/news');
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openEdit = (item: any) => {
    setEditing(item);
    setForm({ title: item.title, content: item.content, author: item.author, published: item.published });
    setModal('edit');
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = modal === 'add'
        ? await adminFetch('/api/news', { method: 'POST', body: JSON.stringify(form) })
        : await adminFetch(`/api/news/${editing._id}`, { method: 'PUT', body: JSON.stringify(form) });
      if (res.ok) { toast.success(modal === 'add' ? 'Article published!' : 'Article updated!'); setModal(null); load(); }
      else { const d = await res.json(); toast.error(d.error || 'Failed'); }
    } finally { setSaving(false); }
  };

  const del = async (id: string, title: string) => {
    if (!await confirm(`Delete "${title}"?`)) return;
    const res = await adminFetch(`/api/news/${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Deleted'); load(); } else toast.error('Failed to delete');
  };

  const filtered = items.filter(i => `${i.title} ${i.author}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <PanelHeader title="News" count={items.length} onAdd={() => { setForm(blank); setModal('add'); }} search={search} onSearch={setSearch} addLabel="New Article" />
      {loading ? <Spinner /> : filtered.length === 0 ? <Empty text="No articles found" /> : (
        <div className="space-y-3">
          {filtered.map(item => (
            <ItemRow key={item._id}
              title={item.title}
              meta={`By ${item.author} · ${new Date(item.createdAt).toLocaleDateString()}`}
              badge={item.published ? 'Published' : 'Draft'}
              badgeColor={item.published ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}
              onEdit={() => openEdit(item)}
              onDelete={() => del(item._id, item.title)}
            />
          ))}
        </div>
      )}
      <AnimatePresence>
        {modal && (
          <Modal title={modal === 'add' ? 'New Article' : 'Edit Article'} onClose={() => setModal(null)}>
            <div className="space-y-4">
              <Field label="Title"><input className={inputCls} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Article title" /></Field>
              <Field label="Author"><input className={inputCls} value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} placeholder="Author name" /></Field>
              <Field label="Content">
                <textarea className={inputCls} rows={5} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Article content..." />
              </Field>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setForm({ ...form, published: !form.published })}
                  className={`w-11 h-6 rounded-full transition-colors ${form.published ? 'bg-amber-500' : 'bg-slate-200'} relative`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.published ? 'left-6' : 'left-1'}`} />
                </div>
                <span className="text-sm font-medium text-slate-700">Publish immediately</span>
              </label>
              <SaveButton saving={saving} onClick={save} />
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

/* ══════════════════════════════════════════
   MEMBERS PANEL
══════════════════════════════════════════ */
function MembersPanel() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<any>(null);
  const blank = { name: '', email: '', password: '', role: 'member', status: 'approved' };
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const url = filter === 'all' ? '/api/admin/members' : `/api/admin/members?status=${filter}`;
    const res = await adminFetch(url);
    if (res.ok) setMembers(await res.json());
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const openEdit = (m: any) => {
    setEditing(m);
    setForm({ name: m.name, email: m.email, password: '', role: m.role, status: m.status });
    setModal('edit');
  };

  const saveMember = async () => {
    setSaving(true);
    try {
      if (modal === 'add') {
        const res = await adminFetch('/api/admin/members', { method: 'POST', body: JSON.stringify(form) });
        if (res.ok) { toast.success('Member added!'); setModal(null); load(); }
        else { const d = await res.json(); toast.error(d.error || 'Failed'); }
      } else {
        const payload: any = { id: editing._id, name: form.name, email: form.email, role: form.role, status: form.status };
        const res = await adminFetch('/api/admin/members', { method: 'PUT', body: JSON.stringify(payload) });
        if (res.ok) { toast.success('Member updated!'); setModal(null); load(); }
        else { const d = await res.json(); toast.error(d.error || 'Failed'); }
      }
    } finally { setSaving(false); }
  };

  const updateStatus = async (id: string, status: string) => {
    const res = await adminFetch('/api/admin/members', { method: 'PUT', body: JSON.stringify({ id, status }) });
    if (res.ok) { toast.success(`Member ${status}`); load(); } else toast.error('Failed');
  };

  const del = async (id: string, name: string) => {
    if (!await confirm(`Remove member "${name}"? This cannot be undone.`)) return;
    const res = await adminFetch('/api/admin/members', { method: 'DELETE', body: JSON.stringify({ id }) });
    if (res.ok) { toast.success('Member removed'); load(); }
    else { const d = await res.json(); toast.error(d.error || 'Failed'); }
  };

  const pending = members.filter(m => m.status === 'pending').length;
  const filtered = members.filter(m => `${m.name} ${m.email}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-800">Members</h2>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{members.length} total</span>
          {pending > 0 && <span className="text-xs bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full">{pending} pending</span>}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..." className="pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 w-48" />
          </div>
          <button onClick={() => { setForm(blank); setModal('add'); }} className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm shadow-amber-600/25">
            <FaUserPlus /> Add Member
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-5 w-fit">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${filter === f ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
          >{f}</button>
        ))}
      </div>

      {loading ? <Spinner /> : filtered.length === 0 ? <Empty text="No members found" /> : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(m => (
                  <tr key={m._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3 font-semibold text-slate-800">{m.name}</td>
                    <td className="px-5 py-3 text-slate-500 text-xs">{m.email}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${m.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {m.role === 'admin' && <FaShieldAlt className="text-xs" />} {m.role}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${m.status === 'approved' ? 'bg-green-100 text-green-700' : m.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                        {m.status === 'approved' && <FaCheckCircle />}
                        {m.status === 'rejected' && <FaTimesCircle />}
                        {m.status === 'pending' && <FaHourglassHalf />}
                        {m.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-400 text-xs">{new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {m.status === 'pending' && (
                          <>
                            <ActionBtn color="green" icon={<FaCheckCircle />} label="Approve" onClick={() => updateStatus(m._id, 'approved')} />
                            <ActionBtn color="red" icon={<FaTimesCircle />} label="Reject" onClick={() => updateStatus(m._id, 'rejected')} />
                          </>
                        )}
                        <ActionBtn color="blue" icon={<FaEdit />} label="Edit" onClick={() => openEdit(m)} />
                        <ActionBtn color="red" icon={<FaTrash />} label="Delete" onClick={() => del(m._id, m.name)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <Modal title={modal === 'add' ? 'Add Member' : `Edit — ${editing?.name}`} onClose={() => setModal(null)}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Full Name"><input className={inputCls} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Smith" /></Field>
                <Field label="Email"><input type="email" className={inputCls} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" /></Field>
              </div>
              {modal === 'add' && (
                <Field label="Password"><input type="password" className={inputCls} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" /></Field>
              )}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Role">
                  <select className={inputCls} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </Field>
                <Field label="Status">
                  <select className={inputCls} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </Field>
              </div>
              <SaveButton saving={saving} onClick={saveMember} label={modal === 'add' ? 'Add Member' : 'Save Changes'} />
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

/* ══════════════════════════════════════════
   OVERVIEW PANEL
══════════════════════════════════════════ */
function OverviewPanel({ onNav }: { onNav: (tab: Tab) => void }) {
  const [counts, setCounts] = useState({ sermons: 0, events: 0, news: 0, gallery: 0, resources: 0, members: 0, pending: 0 });

  useEffect(() => {
    Promise.all([
      adminFetch('/api/sermons').then(r => r.json()),
      adminFetch('/api/events').then(r => r.json()),
      adminFetch('/api/news').then(r => r.json()),
      adminFetch('/api/gallery').then(r => r.json()),
      adminFetch('/api/resources').then(r => r.json()),
      adminFetch('/api/admin/members').then(r => r.json()),
    ]).then(([s, e, n, g, res, m]) => {
      setCounts({
        sermons: Array.isArray(s) ? s.length : 0,
        events: Array.isArray(e) ? e.length : 0,
        news: Array.isArray(n) ? n.length : 0,
        gallery: Array.isArray(g) ? g.length : 0,
        resources: Array.isArray(res) ? res.length : 0,
        members: Array.isArray(m) ? m.length : 0,
        pending: Array.isArray(m) ? m.filter((x: any) => x.status === 'pending').length : 0,
      });
    }).catch(() => {});
  }, []);

  const cards = [
    { label: 'Sermons', value: counts.sermons, icon: <FaBook />, color: 'bg-blue-500', tab: 'sermons' as Tab },
    { label: 'Events', value: counts.events, icon: <FaCalendar />, color: 'bg-emerald-500', tab: 'events' as Tab },
    { label: 'Articles', value: counts.news, icon: <FaNewspaper />, color: 'bg-violet-500', tab: 'news' as Tab },
    { label: 'Gallery', value: counts.gallery, icon: <FaImages />, color: 'bg-pink-500', tab: 'gallery' as Tab },
    { label: 'Resources', value: counts.resources, icon: <FaLink />, color: 'bg-teal-500', tab: 'resources' as Tab },
    { label: 'Members', value: counts.members, icon: <FaUsers />, color: 'bg-amber-500', tab: 'members' as Tab },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c, i) => (
          <motion.button
            key={c.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -3 }}
            onClick={() => onNav(c.tab)}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 text-left hover:shadow-md transition-all"
          >
            <div className={`w-10 h-10 ${c.color} rounded-xl flex items-center justify-center text-white mb-3`}>{c.icon}</div>
            <p className="text-3xl font-bold text-slate-800">{c.value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{c.label}</p>
          </motion.button>
        ))}
      </div>
      {counts.pending > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => onNav('members')}
          className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center gap-4 hover:bg-amber-100 transition-colors text-left"
        >
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
            <FaHourglassHalf className="text-amber-600" />
          </div>
          <div>
            <p className="font-bold text-amber-800">{counts.pending} Membership Application{counts.pending > 1 ? 's' : ''} Awaiting Review</p>
            <p className="text-amber-700 text-sm">Click to review and approve or reject</p>
          </div>
        </motion.button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   GALLERY PANEL
══════════════════════════════════════════ */
function GalleryPanel() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<any>(null);
  const blank = { title: '', url: '', type: 'image', category: 'General' };
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await adminFetch('/api/gallery');
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openEdit = (item: any) => {
    setEditing(item);
    setForm({ title: item.title, url: item.url, type: item.type, category: item.category });
    setModal('edit');
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = modal === 'add'
        ? await adminFetch('/api/gallery', { method: 'POST', body: JSON.stringify(form) })
        : await adminFetch(`/api/gallery/${editing._id}`, { method: 'PUT', body: JSON.stringify(form) });
      if (res.ok) { toast.success(modal === 'add' ? 'Item added!' : 'Item updated!'); setModal(null); load(); }
      else { const d = await res.json(); toast.error(d.error || 'Failed'); }
    } finally { setSaving(false); }
  };

  const del = async (id: string, title: string) => {
    if (!await confirm(`Delete "${title}"?`)) return;
    const res = await adminFetch(`/api/gallery/${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Deleted'); load(); } else toast.error('Failed to delete');
  };

  const filtered = items.filter(i => `${i.title} ${i.category}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <PanelHeader title="Gallery" count={items.length} onAdd={() => { setForm(blank); setModal('add'); }} search={search} onSearch={setSearch} addLabel="Add Item" />
      {loading ? <Spinner /> : filtered.length === 0 ? <Empty text="No gallery items found" /> : (
        <div className="space-y-3">
          {filtered.map(item => (
            <ItemRow key={item._id}
              title={item.title}
              meta={`${item.category} · ${item.url}`}
              badge={item.type}
              badgeColor={item.type === 'video' ? 'bg-purple-100 text-purple-700' : 'bg-pink-100 text-pink-700'}
              onEdit={() => openEdit(item)}
              onDelete={() => del(item._id, item.title)}
            />
          ))}
        </div>
      )}
      <AnimatePresence>
        {modal && (
          <Modal title={modal === 'add' ? 'Add Gallery Item' : 'Edit Gallery Item'} onClose={() => setModal(null)}>
            <div className="space-y-4">
              <Field label="Title"><input className={inputCls} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Photo or video title" /></Field>
              <Field label="URL / Embed Link"><input className={inputCls} value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Type">
                  <select className={inputCls} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </Field>
                <Field label="Category"><input className={inputCls} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. Worship" /></Field>
              </div>
              <SaveButton saving={saving} onClick={save} />
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

/* ══════════════════════════════════════════
   RESOURCES PANEL
══════════════════════════════════════════ */
function ResourcesPanel() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<any>(null);
  const blank = { title: '', description: '', url: '', type: 'pdf', category: 'Bible Study' };
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await adminFetch('/api/resources');
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openEdit = (item: any) => {
    setEditing(item);
    setForm({ title: item.title, description: item.description || '', url: item.url, type: item.type, category: item.category });
    setModal('edit');
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = modal === 'add'
        ? await adminFetch('/api/resources', { method: 'POST', body: JSON.stringify(form) })
        : await adminFetch(`/api/resources/${editing._id}`, { method: 'PUT', body: JSON.stringify(form) });
      if (res.ok) { toast.success(modal === 'add' ? 'Resource added!' : 'Resource updated!'); setModal(null); load(); }
      else { const d = await res.json(); toast.error(d.error || 'Failed'); }
    } finally { setSaving(false); }
  };

  const del = async (id: string, title: string) => {
    if (!await confirm(`Delete "${title}"?`)) return;
    const res = await adminFetch(`/api/resources/${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Deleted'); load(); } else toast.error('Failed to delete');
  };

  const filtered = items.filter(i => `${i.title} ${i.category} ${i.description}`.toLowerCase().includes(search.toLowerCase()));

  const typeColor: Record<string, string> = {
    pdf: 'bg-red-100 text-red-700',
    article: 'bg-blue-100 text-blue-700',
    video: 'bg-purple-100 text-purple-700',
    other: 'bg-slate-100 text-slate-600',
  };

  return (
    <>
      <PanelHeader title="Resources" count={items.length} onAdd={() => { setForm(blank); setModal('add'); }} search={search} onSearch={setSearch} addLabel="Add Resource" />
      {loading ? <Spinner /> : filtered.length === 0 ? <Empty text="No resources found" /> : (
        <div className="space-y-3">
          {filtered.map(item => (
            <ItemRow key={item._id}
              title={item.title}
              meta={`${item.category} · ${item.url}`}
              badge={item.type}
              badgeColor={typeColor[item.type] || typeColor.other}
              onEdit={() => openEdit(item)}
              onDelete={() => del(item._id, item.title)}
            />
          ))}
        </div>
      )}
      <AnimatePresence>
        {modal && (
          <Modal title={modal === 'add' ? 'Add Resource' : 'Edit Resource'} onClose={() => setModal(null)}>
            <div className="space-y-4">
              <Field label="Title"><input className={inputCls} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Resource title" /></Field>
              <Field label="URL / Link"><input className={inputCls} value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Type">
                  <select className={inputCls} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="pdf">PDF</option>
                    <option value="article">Article</option>
                    <option value="video">Video</option>
                    <option value="other">Other</option>
                  </select>
                </Field>
                <Field label="Category"><input className={inputCls} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. Bible Study" /></Field>
              </div>
              <Field label="Description">
                <textarea className={inputCls} rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description..." />
              </Field>
              <SaveButton saving={saving} onClick={save} />
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

/* ══════════════════════════════════════════
   SHARED MINI COMPONENTS
══════════════════════════════════════════ */
function PanelHeader({ title, count, onAdd, search, onSearch, addLabel }: {
  title: string; count: number; onAdd: () => void;
  search: string; onSearch: (v: string) => void; addLabel: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{count} total</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input value={search} onChange={e => onSearch(e.target.value)} placeholder="Search..." className="pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 w-44" />
        </div>
        <button onClick={onAdd} className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm shadow-amber-600/25">
          <FaPlus className="text-xs" /> {addLabel}
        </button>
      </div>
    </div>
  );
}

function ItemRow({ title, meta, badge, badgeColor, onEdit, onDelete }: {
  title: string; meta: string; badge: string; badgeColor: string;
  onEdit: () => void; onDelete: () => void;
}) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center justify-between gap-4 hover:shadow-md transition-all"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>{badge}</span>
        </div>
        <p className="font-semibold text-slate-800 truncate">{title}</p>
        <p className="text-xs text-slate-400 mt-0.5 truncate">{meta}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={onEdit} className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
          <FaEdit /> Edit
        </button>
        <button onClick={onDelete} className="flex items-center gap-1.5 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
          <FaTrash /> Delete
        </button>
      </div>
    </motion.div>
  );
}

function ActionBtn({ color, icon, label, onClick }: { color: string; icon: React.ReactNode; label: string; onClick: () => void }) {
  const colors: Record<string, string> = {
    green: 'text-green-600 bg-green-50 hover:bg-green-100',
    red: 'text-red-500 bg-red-50 hover:bg-red-100',
    blue: 'text-blue-600 bg-blue-50 hover:bg-blue-100',
  };
  return (
    <button onClick={onClick} title={label} className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${colors[color]}`}>
      {icon} <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function SaveButton({ saving, onClick, label = 'Save' }: { saving: boolean; onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick} disabled={saving}
      className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm shadow-amber-600/25"
    >
      {saving && <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
      {saving ? 'Saving...' : label}
    </button>
  );
}

function Spinner() {
  return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" /></div>;
}

function Empty({ text }: { text: string }) {
  return <div className="text-center py-12 text-slate-400"><p>{text}</p></div>;
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <MdDashboard /> },
  { id: 'sermons', label: 'Sermons', icon: <FaBook /> },
  { id: 'events', label: 'Events', icon: <FaCalendar /> },
  { id: 'news', label: 'News', icon: <FaNewspaper /> },
  { id: 'gallery', label: 'Gallery', icon: <FaImages /> },
  { id: 'resources', label: 'Resources', icon: <FaLink /> },
  { id: 'members', label: 'Members', icon: <FaUsers /> },
];

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return; }
    if (status === 'authenticated' && (session?.user as any)?.role !== 'admin') router.push('/dashboard');
  }, [status, session, router]);

  if (status === 'loading') {
    return <div className="pt-16 min-h-screen flex items-center justify-center"><div className="animate-spin w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <FaShieldAlt className="text-amber-600" />
            <span className="text-amber-600 text-sm font-semibold uppercase tracking-widest">Admin</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage all church content, members, and settings.</p>
        </div>

        {/* Tab bar */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white rounded-2xl p-2 shadow-sm border border-slate-100">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && <OverviewPanel onNav={setActiveTab} />}
            {activeTab === 'sermons' && <SermonsPanel />}
            {activeTab === 'events' && <EventsPanel />}
            {activeTab === 'news' && <NewsPanel />}
            {activeTab === 'gallery' && <GalleryPanel />}
            {activeTab === 'resources' && <ResourcesPanel />}
            {activeTab === 'members' && <MembersPanel />}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
