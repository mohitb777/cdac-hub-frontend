import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyProjects } from '../services/api'
import { useAuth } from '../context/AuthContext'

// Status badge — different color for each status
function StatusBadge({ status }) {
  const styles = {
    PENDING:      'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    UNDER_REVIEW: 'bg-blue-500/10   text-blue-400   border-blue-500/20',
    APPROVED:     'bg-green-500/10  text-green-400  border-green-500/20',
    REJECTED:     'bg-red-500/10    text-red-400    border-red-500/20',
  }
  return (
    <span className={`text-xs font-medium border px-2 py-0.5 rounded-full ${styles[status] || ''}`}>
      {status}
    </span>
  )
}

function DashboardPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const { user, isLoggedIn }    = useAuth()
  const navigate                = useNavigate()

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    // Fetch this student's projects
    getMyProjects()
      .then(res => {
        setProjects(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [isLoggedIn])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-white/40">Loading your projects...</p>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 text-white">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Dashboard</h1>
          <p className="text-white/40 text-sm mt-1">
            Welcome back, {user?.name}
          </p>
        </div>
        <button
          onClick={() => navigate('/submit')}
          className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
        >
          + Submit New Project
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Total',       count: projects.length,                                       color: 'text-white' },
          { label: 'Pending',     count: projects.filter(p => p.status === 'PENDING').length,     color: 'text-yellow-400' },
          { label: 'Approved',    count: projects.filter(p => p.status === 'APPROVED').length,    color: 'text-green-400' },
          { label: 'Rejected',    count: projects.filter(p => p.status === 'REJECTED').length,    color: 'text-red-400' },
        ].map(stat => (
          <div key={stat.label}
            className="bg-[#0d0d18] border border-white/5 rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.count}</div>
            <div className="text-xs text-white/40 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="text-center py-20 border border-white/5 rounded-2xl">
          <p className="text-white/30 mb-4">No projects submitted yet</p>
          <button
            onClick={() => navigate('/submit')}
            className="bg-violet-600 hover:bg-violet-500 text-white text-sm px-5 py-2.5 rounded-xl transition-all"
          >
            Submit Your First Project
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map(project => (
            <div key={project.id}
              className="bg-[#0d0d18] border border-white/5 rounded-2xl p-5 flex items-center justify-between">

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold">{project.title}</h3>
                  <StatusBadge status={project.status} />
                </div>
                <p className="text-white/40 text-sm line-clamp-1">
                  {project.description}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-white/30">{project.category}</span>
                  <span className="text-xs text-white/20">•</span>
                  <span className="text-xs text-white/30">{project.techStack}</span>
                </div>
              </div>

              <div className="text-right ml-6">
                <div className="font-bold text-white">₹{project.price}</div>
                <div className="text-xs text-white/30 mt-1">
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DashboardPage