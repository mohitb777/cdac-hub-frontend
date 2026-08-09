import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyProjects } from '../services/api'
import { useAuth } from '../context/AuthContext'

function StatusBadge({ status }) {
  const styles = {
    PENDING:      'bg-yellow-50 text-yellow-700 border-yellow-200',
    UNDER_REVIEW: 'bg-blue-50   text-blue-700   border-blue-200',
    APPROVED:     'bg-green-50   text-green-700   border-green-200',
    REJECTED:     'bg-red-50     text-red-700     border-red-200',
  }
  return (
    <span className={`text-xs font-medium border px-2 py-0.5 rounded-full ${styles[status] || ''}`}>
      {status}
    </span>
  )
}

// Picks the most recent review by date, regardless of array order
function getLatestReview(reviews) {
  if (!reviews || reviews.length === 0) return null
  return [...reviews].sort((a, b) => new Date(b.reviewedAt) - new Date(a.reviewedAt))[0]
}

function DashboardPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const { user, isLoggedIn }    = useAuth()
  const navigate                = useNavigate()

  useEffect(() => {
  if (!isLoggedIn) {
    navigate('/login')
    return
  }

  getMyProjects()
  .then(res => {
    console.log("MY PROJECTS RESPONSE:", res.data);
    setProjects(res.data);
    setLoading(false);
  })
  .catch(err => {
    console.error("MY PROJECTS ERROR:", err);
    console.error("STATUS:", err.response?.status);
    console.error("DATA:", err.response?.data);
    setLoading(false);
  });
}, [isLoggedIn])

  const handleResubmit = (project) => {
    // Pass the existing project through router state — SubmitProjectPage
    // detects this and switches into edit mode, pre-filled.
    navigate('/submit', { state: { editProject: project } })
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-black/40">Loading your projects...</p>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 text-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-black 2xl font-bold">My Dashboard</h1>
          <p className="text-black text-sm mt-1">Welcome back, {user?.name}</p>
        </div>
        <button onClick={() => navigate('/submit')}
          className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all">
          + Submit New Project
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Total',    count: projects.length, color: 'text-white' },
          { label: 'Pending',  count: projects.filter(p => p.status === 'PENDING').length, color: 'text-yellow-400' },
          { label: 'Approved', count: projects.filter(p => p.status === 'APPROVED').length, color: 'text-green-400' },
          { label: 'Rejected', count: projects.filter(p => p.status === 'REJECTED').length, color: 'text-red-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-[#0d0d18] border border-white/5 rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.count}</div>
            <div className="text-xs text-white/40 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 border border-white/5 rounded-2xl">
          <p className="text-white/30 mb-4">No projects submitted yet</p>
          <button onClick={() => navigate('/submit')}
            className="bg-violet-600 hover:bg-violet-500 text-black-bold text-sm px-5 py-2.5 rounded-xl transition-all">
            Submit Your First Project
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map(project => {
            const latestReview = getLatestReview(project.reviews)
            return (
              <div key={project.id} className="bg-[#0d0d18] border border-white/5 rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold">{project.title}</h3>
                      <StatusBadge status={project.status} />
                    </div>
                    <p className="text-black/40 text-sm line-clamp-1">{project.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-white/30">{project.category}</span>
                      <span className="text-xs text-white/20">•</span>
                      <span className="text-xs text-white/30">{project.month} {project.year}</span>
                    </div>
                  </div>
                  <div className="text-right ml-6">
                    <a href={project.gitLink} target="_blank" rel="noreferrer"
                      className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors">
                      View Repo →
                    </a>
                    <div className="text-xs text-white/30 mt-1">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* ✅ Fix 1 — surface reviewer feedback directly to the student */}
                {latestReview && (project.status === 'APPROVED' || project.status === 'REJECTED') && (
                  <div className={`mt-3 pt-3 border-t border-white/5 text-sm ${
                    project.status === 'REJECTED' ? 'text-red-300' : 'text-green-300'
                  }`}>
                    <p className="text-xs text-white/40 mb-1">
                      Feedback from {latestReview.reviewer?.name || 'reviewer'}:
                    </p>
                    <p className="text-white/70">{latestReview.feedback}</p>
                  </div>
                )}

                {/* ✅ Fix 2 — resubmit path for rejected projects */}
                {project.status === 'REJECTED' && (
                  <button
                    onClick={() => handleResubmit(project)}
                    className="mt-3 text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-lg transition-all"
                  >
                    Fix & Resubmit
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default DashboardPage