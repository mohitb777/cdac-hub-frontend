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
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const { isLoggedIn } = useAuth()

  useEffect(() => {
  getApprovedProjects(page)
    .then(res => {
      console.log("API RESPONSE:", res.data)

      setProjects(res.data.content || [])
      setTotalPages(res.data.totalPages || 1)
      setLoading(false)
    })
    .catch(err => {
      console.error("API ERROR:", err)
      setLoading(false)
    })
}, [page])

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
      <p className="text-gray-500">Loading projects...</p>
    </div>
  )

  return (
    <div className="text-gray-900">
      <div className="text-center py-16 px-6 border-b border-gray-200">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Every CDAC Project<br />
          <span className="text-cdac-navy">Open. Verified. Free.</span>
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto mb-8">
          Browse verified student projects from every CDAC center. Login to view any project's repository and files.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, category, or tech stack..."
            className="flex-1 bg-white border border-gray-300 focus:border-cdac-navy rounded-xl px-5 py-3 text-gray-900 text-sm outline-none transition-all" />
          <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm outline-none">
            <option value="ALL">All Years</option>
            {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-lg font-bold mb-6">
          Verified Projects
          <span className="text-gray-400 text-sm font-normal ml-2">({filtered.length} found)</span>
        </h2>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400">{search ? `No projects matching "${search}"` : 'No approved projects yet.'}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {filtered.map(project => (
              <div key={project.id} className="bg-white border border-gray-200 hover:border-cdac-navy/40 rounded-2xl p-5 transition-all shadow-sm">
                <span className="text-xs font-medium bg-cdac-navy/8 border border-cdac-navy/20 text-cdac-navy px-3 py-1 rounded-full">
                  {project.category}
                </span>
                <h3 className="font-bold mt-3 mb-2">{project.title}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.techStack.split(',').map((tech, i) => (
                    <span key={i} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{tech.trim()}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs font-medium">{project.submitterName}</p>
                    <p className="text-xs text-gray-400">{project.month} {project.year}</p>
                  </div>
                  <button onClick={() => handleViewProject(project)}
                    className="text-xs font-semibold bg-cdac-navy hover:bg-cdac-navy-light text-white px-3 py-1.5 rounded-lg transition-all">
                    View Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
              className="text-sm px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-30 text-gray-600 hover:text-cdac-navy">
              ← Prev
            </button>
            <span className="text-sm text-gray-400 px-2 py-2">Page {page + 1} of {totalPages}</span>
            <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
              className="text-sm px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-30 text-gray-600 hover:text-cdac-navy">
              Next →
            </button>
          </div>
        )}
      </div>

      {showLoginModal && <LoginRequiredModal onClose={() => setShowLoginModal(false)} />}
      {selectedProject && <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </div>
  )
}

export default HomePage
