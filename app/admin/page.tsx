'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit,
  LogOut,
  ExternalLink,
  Film,
  Layers,
  FolderPlus,
  X,
  CheckCircle,
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  client: string;
  year: string;
  category: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  featured: boolean;
  order: number;
}

export default function AdminPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [year, setYear] = useState('2026');
  const [category, setCategory] = useState('3D & Motion Craft');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [order, setOrder] = useState(1);
  const [formError, setFormError] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setTitle('');
    setClient('');
    setYear('2026');
    setCategory('3D & Motion Craft');
    setDescription('');
    setThumbnailUrl('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80');
    setVideoUrl('https://cdn.coverr.co/videos/coverr-abstract-glowing-neon-lights-5674/1080p.mp4');
    setFeatured(false);
    setOrder(projects.length + 1);
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (project: Project) => {
    setEditingProject(project);
    setTitle(project.title);
    setClient(project.client);
    setYear(project.year);
    setCategory(project.category);
    setDescription(project.description);
    setThumbnailUrl(project.thumbnailUrl);
    setVideoUrl(project.videoUrl);
    setFeatured(project.featured);
    setOrder(project.order);
    setFormError('');
    setModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title || !client || !videoUrl) {
      setFormError('Title, Client, and Video URL are required.');
      return;
    }

    const payload = {
      title,
      client,
      year,
      category,
      description,
      thumbnailUrl,
      videoUrl,
      featured,
      order: Number(order),
    };

    try {
      if (editingProject) {
        // PUT update
        const res = await fetch(`/api/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          setModalOpen(false);
          fetchProjects();
        } else {
          setFormError('Failed to update project.');
        }
      } else {
        // POST create
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          setModalOpen(false);
          fetchProjects();
        } else {
          setFormError('Failed to create project.');
        }
      }
    } catch (err) {
      setFormError('Server error while saving project.');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this C8C project?')) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchProjects();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-['Outfit']">
      {/* Top Header */}
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[rgba(255,215,0,0.2)]">
        <div className="flex items-center gap-4">
          <Link href="/" className="w-12 h-12 rounded-full bg-black border-2 border-[var(--gold)] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-[var(--gold)]" />
          </Link>
          <div>
            <h1 className="text-2xl font-black uppercase text-white font-['Syne']">
              C8C ADMIN CMS<span className="text-[var(--gold)]">.</span>
            </h1>
            <p className="text-xs text-gray-400 font-mono">
              LOGGED IN AS: <span className="text-[var(--gold)]">{session?.user?.email || 'admin@c8c.agency'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/" className="btn-outline-gold text-xs !py-2.5 !px-5">
            View Live Site <ExternalLink className="w-4 h-4" />
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-red-500/50 bg-red-950/40 text-red-300 text-xs font-bold hover:bg-red-900/60 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-[rgba(255,215,0,0.2)] flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 uppercase font-mono">Total Showcase Projects</span>
            <h3 className="text-3xl font-extrabold text-[var(--gold)] font-['Syne'] mt-1">{projects.length}</h3>
          </div>
          <Film className="w-8 h-8 text-[var(--gold)]" />
        </div>

        <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-[rgba(255,215,0,0.2)] flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 uppercase font-mono">Featured Reel Items</span>
            <h3 className="text-3xl font-extrabold text-white font-['Syne'] mt-1">
              {projects.filter((p) => p.featured).length}
            </h3>
          </div>
          <Sparkles className="w-8 h-8 text-white" />
        </div>

        <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-[rgba(255,215,0,0.2)] flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 uppercase font-mono">Database Status</span>
            <h3 className="text-xl font-extrabold text-emerald-400 font-['Syne'] mt-1 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> Prisma SQLite Active
            </h3>
          </div>
          <Layers className="w-8 h-8 text-emerald-400" />
        </div>
      </div>

      {/* Projects Table Control Bar */}
      <div className="max-w-[1600px] mx-auto flex items-center justify-between my-6">
        <h2 className="text-xl font-bold uppercase tracking-wider text-white font-['Syne']">
          Manage Projects Catalog
        </h2>
        <button
          onClick={handleOpenCreateModal}
          className="btn-gold !py-3 !px-6 text-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Project
        </button>
      </div>

      {/* Projects Table */}
      <div className="max-w-[1600px] mx-auto bg-[#0a0a0a] border border-[rgba(255,215,0,0.15)] rounded-2xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-gray-400 font-mono">Loading C8C project catalog...</div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center text-gray-400 font-mono">No projects found. Click "Add New Project" to create one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-black/80 text-[var(--gold)] text-xs uppercase font-mono border-b border-[rgba(255,215,0,0.2)]">
                <tr>
                  <th className="p-4">Order</th>
                  <th className="p-4">Preview</th>
                  <th className="p-4">Project Title</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,215,0,0.1)]">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono text-gray-400">#{p.order}</td>
                    <td className="p-4">
                      <div className="w-16 h-10 rounded-lg overflow-hidden relative border border-gold/20 bg-black">
                        <img src={p.thumbnailUrl} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-4 font-bold text-white font-['Syne']">{p.title}</td>
                    <td className="p-4 text-gray-300">{p.client}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold bg-[rgba(255,215,0,0.1)] text-[var(--gold)] border border-[rgba(255,215,0,0.3)]">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs">
                      {p.featured ? (
                        <span className="text-emerald-400 font-bold">★ YES</span>
                      ) : (
                        <span className="text-gray-500">NO</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-2 rounded-lg border border-gray-700 hover:border-[var(--gold)] text-gray-300 hover:text-[var(--gold)] transition-colors"
                          title="Edit Project"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p.id)}
                          className="p-2 rounded-lg border border-red-900/50 hover:border-red-500 text-red-400 hover:text-red-300 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Create / Edit Project */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0c0c0c] border-2 border-[var(--gold)] rounded-3xl p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[rgba(255,215,0,0.2)]">
              <h3 className="text-xl font-black uppercase text-white font-['Syne']">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-gray-400 hover:text-[var(--gold)]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500 text-xs text-red-300 font-bold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#121212] border border-[rgba(255,215,0,0.2)] rounded-xl text-sm text-white focus:outline-none focus:border-[var(--gold)]"
                  placeholder="e.g. AURA - Kinetic Architectural Experience"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Client Name</label>
                  <input
                    type="text"
                    required
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#121212] border border-[rgba(255,215,0,0.2)] rounded-xl text-sm text-white focus:outline-none focus:border-[var(--gold)]"
                    placeholder="e.g. Aura Luxury Estates"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Year</label>
                  <input
                    type="text"
                    required
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#121212] border border-[rgba(255,215,0,0.2)] rounded-xl text-sm text-white focus:outline-none focus:border-[var(--gold)]"
                    placeholder="2026"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#121212] border border-[rgba(255,215,0,0.2)] rounded-xl text-sm text-white focus:outline-none focus:border-[var(--gold)]"
                  >
                    <option value="3D & Motion Craft">3D & Motion Craft</option>
                    <option value="Cinematography & VFX">Cinematography & VFX</option>
                    <option value="Digital Fashion & Brand Identity">Digital Fashion & Brand Identity</option>
                    <option value="Interactive Sound & Light">Interactive Sound & Light</option>
                    <option value="Commercial Direction">Commercial Direction</option>
                    <option value="Brand Strategy & VFX">Brand Strategy & VFX</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Display Order</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-[#121212] border border-[rgba(255,215,0,0.2)] rounded-xl text-sm text-white focus:outline-none focus:border-[var(--gold)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Thumbnail Image URL</label>
                <input
                  type="url"
                  required
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#121212] border border-[rgba(255,215,0,0.2)] rounded-xl text-sm text-white focus:outline-none focus:border-[var(--gold)]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Video Stream URL (.mp4)</label>
                <input
                  type="url"
                  required
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#121212] border border-[rgba(255,215,0,0.2)] rounded-xl text-sm text-white focus:outline-none focus:border-[var(--gold)]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#121212] border border-[rgba(255,215,0,0.2)] rounded-xl text-sm text-white focus:outline-none focus:border-[var(--gold)]"
                  placeholder="Short creative summary..."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 accent-[var(--gold)]"
                />
                <label htmlFor="featuredCheck" className="text-xs font-mono text-gray-300 cursor-pointer">
                  Feature on Master Showreel
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-3 rounded-full border border-gray-700 text-xs font-bold hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-gold text-xs !py-3 !px-6">
                  {editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
