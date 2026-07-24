import { useState, useEffect } from 'react'
import { getApprovedProjects } from '../services/api'
import { useAuth } from '../context/AuthContext'
import LoginRequiredModal from '../components/LoginRequiredModal'
import ProjectDetailModal from '../components/ProjectDetailModal'

const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i)

function HomePage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [yearFilter, setYearFilter] = useState('ALL')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const { isLoggedIn } = useAuth()

  useEffect(() => {
    getApprovedProjects()
      .then(res => { setProjects(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = projects.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.techStack.toLowerCase().includes(search.toLowerCase())
    const matchesYear = yearFilter === 'ALL' || p.year === Number(yearFilter)
    return matchesSearch && matchesYear
  })

  const handleViewProject = (project) => {
    if (!isLoggedIn) { setShowLoginModal(true); return }
    setSelectedProject(project)
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-white/40">Loading projects...</p>
    </div>
  )

  return (
    <div className="text-white">
      <div className="text-center py-16 px-6 border-b border-white/5">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Every CDAC Project<br />
          <span className="text-violet-400">Open. Verified. Free.</span>
        </h1>
        <p className="text-white/40 max-w-lg mx-auto mb-8">
          Browse verified student projects from every CDAC center. Login to view any project's repository and files.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, category, or tech stack..."
            className="flex-1 bg-[#0d0d18] border border-white/10 focus:border-violet-500 rounded-xl px-5 py-3 text-white text-sm outline-none transition-all" />
          <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}
            className="bg-[#0d0d18] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none">
            <option value="ALL">All Years</option>
            {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-lg font-bold mb-6">
          Verified Projects
          <span className="text-white/30 text-sm font-normal ml-2">({filtered.length} found)</span>
        </h2>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/30">{search ? `No projects matching "${search}"` : 'No approved projects yet.'}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {filtered.map(project => (
              <div key={project.id} className="bg-[#0d0d18] border border-white/5 hover:border-violet-500/30 rounded-2xl p-5 transition-all">
                <span className="text-xs font-medium bg-violet-500/10 border border-violet-500/20 text-violet-300 px-3 py-1 rounded-full">
                  {project.category}
                </span>
                <h3 className="font-bold mt-3 mb-2">{project.title}</h3>
                <p className="text-white/40 text-sm mb-4 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.techStack.split(',').map((tech, i) => (
                    <span key={i} className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded">{tech.trim()}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div>
                    <p className="text-xs font-medium">{project.submitterName}</p>
                    <p className="text-xs text-white/30">{project.month} {project.year}</p>
                  </div>
                  <button onClick={() => handleViewProject(project)}
                    className="text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-lg transition-all">
                    View Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showLoginModal && <LoginRequiredModal onClose={() => setShowLoginModal(false)} />}
      {selectedProject && <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </div>
  )
}

export default HomePage