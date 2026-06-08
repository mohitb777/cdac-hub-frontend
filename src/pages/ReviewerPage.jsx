import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPendingProjects, submitReview } from '../services/api'
import { useAuth } from '../context/AuthContext'

function ReviewerPage() {
  const [projects, setProjects]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [feedbacks, setFeedbacks] = useState({}) // { projectId: "feedback text" }
  const [submitting, setSubmitting] = useState({}) // { projectId: true/false }
  const [done, setDone]           = useState({}) // { projectId: verdict }
  const { isReviewer, isLoggedIn } = useAuth()
  const navigate                  = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return }
    if (!isReviewer)  { navigate('/');     return }

    getPendingProjects()
      .then(res => {
        setProjects(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [isLoggedIn, isReviewer])

  // Update feedback for a specific project
  const handleFeedbackChange = (projectId, value) => {
    setFeedbacks({ ...feedbacks, [projectId]: value })
  }

  // Submit approve or reject
  const handleReview = async (projectId, verdict) => {
    const feedback = feedbacks[projectId] || ''
    if (!feedback.trim()) {
      alert('Please write feedback before submitting')
      return
    }

    setSubmitting({ ...submitting, [projectId]: true })

    try {
      await submitReview(projectId, { feedback, verdict })
      // Mark this project as done and remove from list
      setDone({ ...done, [projectId]: verdict })
      setProjects(prev => prev.filter(p => p.id !== projectId))
    } catch (err) {
      alert('Review submission failed. Try again.')
    } finally {
      setSubmitting({ ...submitting, [projectId]: false })
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-white/40">Loading pending projects...</p>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Review Panel</h1>
        <p className="text-white/40 text-sm mt-1">
          {projects.length} project{projects.length !== 1 ? 's' : ''} waiting for review
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 border border-white/5 rounded-2xl">
          <div className="text-4xl mb-4">🎉</div>
          <p className="text-white/30">All projects have been reviewed!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map(project => (
            <div key={project.id}
              className="bg-[#0d0d18] border border-white/5 rounded-2xl p-6">

              {/* Project header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs bg-violet-500/10 border border-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full">
                    {project.category}
                  </span>
                  <h3 className="font-bold text-lg mt-2">{project.title}</h3>
                  <p className="text-white/50 text-sm mt-1">{project.description}</p>
                </div>
                <div className="text-right ml-4 shrink-0">
                  <div className="font-bold">₹{project.price}</div>
                  <div className="text-xs text-white/30 mt-1">
                    by {project.user?.name}
                  </div>
                </div>
              </div>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.techStack?.split(',').map((tech, i) => (
                  <span key={i}
                    className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded">
                    {tech.trim()}
                  </span>
                ))}
              </div>

              {/* Files */}
              {project.files?.length > 0 && (
                <div className="mb-4 p-3 bg-white/3 rounded-xl">
                  <p className="text-xs text-white/40 mb-2">Submitted files:</p>
                  {project.files.map((file, i) => (
                    <a key={i}
                      href={`http://localhost:8080${file.fileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      📄 {file.fileName}
                    </a>
                  ))}
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-white/5 my-4" />

              {/* Feedback + Buttons */}
              <div>
                <label className="text-sm font-medium text-white/60 block mb-2">
                  Your Feedback *
                </label>
                <textarea
                  rows={3}
                  value={feedbacks[project.id] || ''}
                  onChange={(e) => handleFeedbackChange(project.id, e.target.value)}
                  placeholder="Write your detailed review — what's good, what can be improved, why you're approving or rejecting..."
                  className="w-full bg-[#09090f] border border-white/10 focus:border-violet-500 rounded-xl px-4 py-3 text-white text-sm outline-none resize-none transition-all mb-3"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => handleReview(project.id, 'APPROVED')}
                    disabled={submitting[project.id]}
                    className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-all text-sm"
                  >
                    {submitting[project.id] ? '...' : '✅ Approve'}
                  </button>
                  <button
                    onClick={() => handleReview(project.id, 'REJECTED')}
                    disabled={submitting[project.id]}
                    className="flex-1 bg-red-600/80 hover:bg-red-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-all text-sm"
                  >
                    {submitting[project.id] ? '...' : '❌ Reject'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ReviewerPage