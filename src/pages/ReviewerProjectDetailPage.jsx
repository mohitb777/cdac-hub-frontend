import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProjectForReview, submitReview } from '../services/api'
import { useAuth } from '../context/AuthContext'

function getLatestReview(reviews) {
  if (!reviews || reviews.length === 0) return null
  return [...reviews].sort((a, b) => new Date(b.reviewedAt) - new Date(a.reviewedAt))[0]
}

function ReviewerProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  // 1. Check if AuthContext has a loading state (you might need to pull 'loading' or 'isLoading')
const { isLoggedIn, isReviewer, loading: authLoading } = useAuth()

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {

    // 2. WAIT FOR AUTH: If authentication is still loading in the background, do nothing yet!
    if (authLoading) return;
    if (!isLoggedIn) { navigate('/login'); return }
    if (!isReviewer) { navigate('/'); return }

    getProjectForReview(id)
      .then(res => { setProject(res.data); setLoading(false) })
      .catch(err => {
        setError(err.response?.data?.error || 'Could not load this project')
        setLoading(false)
      })
  }, [id, isLoggedIn, isReviewer])

  const handleReview = async (verdict) => {
    if (!feedback.trim()) { alert('Please write feedback before submitting'); return }
    setSubmitting(true)
    try {
      await submitReview(id, { feedback, verdict })
      navigate('/reviewer')
    } catch (err) {
      // This is The exact race this whole exercise is about: if someone else
      // reviewed it in the seconds since this page loaded, re-fetch and
      // flip into the read-only state instead of showing a raw error.
      if (err.response?.status === 409) {
        const refreshed = await getProjectForReview(id)
        setProject(refreshed.data)
      } else {
        alert(err.response?.data?.error || 'Failed to submit review')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-white/40">Loading project...</p>
    </div>
  )

  if (error) return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center text-white">
      <p className="text-red-400 mb-4">{error}</p>
      <button onClick={() => navigate('/reviewer')}
        className="text-sm bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl transition-all">
        Back to Queue
      </button>
    </div>
  )

  const latestReview = getLatestReview(project.reviews)
  const isPending = project.status === 'PENDING'

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 text-white">
      <span className="text-xs font-medium bg-violet-500/10 border border-violet-500/20 text-violet-300 px-3 py-1 rounded-full">
        {project.category}
      </span>
      <h1 className="text-2xl font-bold mt-3 mb-2">{project.title}</h1>
      <p className="text-white/50 text-sm mb-4">{project.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {project.techStack.split(',').map((tech, i) => (
          <span key={i} className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded">{tech.trim()}</span>
        ))}
      </div>

      <div className="text-sm text-white/50 mb-5 space-y-1">
        <p>Submitted by: <span className="text-white/70">{project.submitterName}</span></p>
        <p>Guide: <span className="text-white/70">{project.guideName}</span></p>
        {project.teamMembers?.length > 0 && (
          <p>Team: <span className="text-white/70">{project.teamMembers.map(m => m.name).join(', ')}</span></p>
        )}
      </div>

      {project.files?.length > 0 && (
        <div className="mb-6 p-3 bg-white/3 rounded-xl">
          <p className="text-xs text-white/40 mb-2">Files</p>
          {project.files.map((file, i) => (
            <a key={i} href={`${import.meta.env.VITE_API_URL}${file.fileUrl}`} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300">
              📄 {file.fileName}
            </a>
          ))}
        </div>
      )}

      <a href={project.gitLink} target="_blank" rel="noreferrer"
        className="block w-full text-center bg-white/5 hover:bg-white/10 text-white text-sm font-semibold py-2.5 rounded-xl transition-all mb-6">
        View Repository →
      </a>

      {isPending ? (
        <div className="border-t border-white/5 pt-5">
          <label className="text-sm font-medium text-white/60 block mb-2">Your Feedback *</label>
          <textarea
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Write your review..."
            className="w-full bg-[#0d0d18] border border-white/10 focus:border-violet-500 rounded-xl px-4 py-3 text-white text-sm outline-none resize-none mb-3"
          />
          <div className="flex gap-3">
            <button onClick={() => handleReview('APPROVED')} disabled={submitting}
              className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-sm transition-all">
              {submitting ? '...' : '✅ Approve'}
            </button>
            <button onClick={() => handleReview('REJECTED')} disabled={submitting}
              className="flex-1 bg-red-600/80 hover:bg-red-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-sm transition-all">
              {submitting ? '...' : '❌ Reject'}
            </button>
          </div>
        </div>
      ) : (
        <div className="border-t border-white/5 pt-5">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
            <p className="text-white font-semibold mb-1">Already Reviewed</p>
            <p className="text-white/50 text-sm mb-3">
              This project has already been evaluated by another reviewer and is
              currently marked as <span className="font-semibold">{project.status}</span>.
            </p>
            {latestReview && (
              <p className="text-white/40 text-xs italic">"{latestReview.feedback}" — {latestReview.reviewer?.name}</p>
            )}
          </div>
          <button onClick={() => navigate('/reviewer')}
            className="w-full mt-4 text-sm bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl transition-all">
            Back to Queue
          </button>
        </div>
      )}
    </div>
  )
}

export default ReviewerProjectDetailPage