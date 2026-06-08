import { useState, useEffect } from 'react'
import { getApprovedProjects } from '../services/api'

function HomePage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')

  useEffect(() => {
    getApprovedProjects()
      .then(res => { setProjects(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Filter projects by search
  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.techStack.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-white/40">Loading projects...</p>
    </div>
  )

  return (
    <div className="text-white">

      {/* Hero */}
      <div className="text-center py-16 px-6 border-b border-white/5">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Every CDAC Project<br />
          <span className="text-violet-400">Preserved. Verified. Valued.</span>
        </h1>
        <p className="text-white/40 max-w-lg mx-auto mb-8">
          Browse verified student projects. Learn, discover, and connect with creators.
        </p>

        {/* Search bar */}
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by title, category, or tech stack..."
          className="w-full max-w-md mx-auto block bg-[#0d0d18] border border-white/10 focus:border-violet-500 rounded-xl px-5 py-3 text-white text-sm outline-none transition-all"
        />
      </div>

      {/* Projects Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-lg font-bold mb-6">
          Verified Projects
          <span className="text-white/30 text-sm font-normal ml-2">
            ({filtered.length} found)
          </span>
        </h2>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/30">
              {search ? `No projects matching "${search}"` : 'No approved projects yet.'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {filtered.map(project => (
              <div key={project.id}
                className="bg-[#0d0d18] border border-white/5 hover:border-violet-500/30 rounded-2xl p-5 transition-all cursor-pointer">

                <span className="text-xs font-medium bg-violet-500/10 border border-violet-500/20 text-violet-300 px-3 py-1 rounded-full">
                  {project.category}
                </span>

                <h3 className="font-bold mt-3 mb-2">{project.title}</h3>
                <p className="text-white/40 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.techStack.split(',').map((tech, i) => (
                    <span key={i}
                      className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded">
                      {tech.trim()}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div>
                    <p className="text-xs font-medium">{project.user?.name}</p>
                    <p className="text-xs text-white/30">{project.user?.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{project.price}</p>
                    <span className="text-xs text-emerald-400">✓ Verified</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage