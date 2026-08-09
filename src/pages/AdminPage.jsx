import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAllUsers, updateUserRole, getAllProjectsAdmin, deleteProject, submitReview, updateSpecializations } from '../services/api'

const CATEGORIES = [
  'AI & ML', 'Web Dev', 'Mobile Apps',
  'Cybersecurity', 'Cloud & DevOps',
  'Data Science', 'Blockchain', 'IoT'
]
function RoleBadge({ role }) {
  const styles = {
ADMIN:    'bg-cdac-navy/8 text-cdac-navy border-cdac-navy/20',
  REVIEWER: 'bg-blue-50     text-blue-700   border-blue-200',
  STUDENT:  'bg-gray-100    text-gray-600   border-gray-200',
}

  return <span className={`text-xs font-medium border px-2 py-0.5 rounded-full ${styles[role]}`}>{role}</span>
}

function StatusBadge({ status }) {
  const styles = {
    PENDING:      'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    UNDER_REVIEW: 'bg-blue-500/10   text-blue-400   border-blue-500/20',
    APPROVED:     'bg-green-500/10  text-green-400  border-green-500/20',
    REJECTED:     'bg-red-500/10    text-red-400    border-red-500/20',
  }
  return <span className={`text-xs font-medium border px-2 py-0.5 rounded-full ${styles[status] || ''}`}>{status}</span>
}

function AdminPage() {
  const [activeTab, setActiveTab] = useState('users')
  const { isAdmin, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return }
    if (!isAdmin)    { navigate('/');      return }
  }, [isLoggedIn, isAdmin])

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-white/40 text-sm mt-1">Manage users and projects</p>
      </div>

      <div className="flex gap-2 mb-8 border-b border-white/5">
        <button
          onClick={() => setActiveTab('users')}
          className={`text-sm font-medium px-4 py-2.5 border-b-2 transition-all ${
            activeTab === 'users' ? 'border-violet-500 text-white' : 'border-transparent text-white/40 hover:text-white/70'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`text-sm font-medium px-4 py-2.5 border-b-2 transition-all ${
            activeTab === 'projects' ? 'border-violet-500 text-white' : 'border-transparent text-white/40 hover:text-white/70'
          }`}
        >
          Projects
        </button>
      </div>

      {activeTab === 'users' ? <UsersTab /> : <ProjectsTab />}
    </div>
  )
}

function UsersTab() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState({})
  const [message, setMessage] = useState('')
  const [specInputs, setSpecInputs] = useState({})
  const [savingSpec, setSavingSpec] = useState({})

  useEffect(() => {
    getAllUsers().then(res => {
      setUsers(res.data)
      const initial = {}
      res.data.forEach(u => { initial[u.id] = u.specializations || '' })
      setSpecInputs(initial)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleRoleChange = async (userId, newRole) => {
    setUpdating({ ...updating, [userId]: true })
    setMessage('')
    try {
      await updateUserRole(userId, newRole)
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
      setMessage('✅ Role updated successfully')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('❌ Failed to update role')
    } finally {
      setUpdating({ ...updating, [userId]: false })
    }
  }

  const toggleCategory = (userId, category) => {
    const current = specInputs[userId] ? specInputs[userId].split(',').map(c => c.trim()).filter(Boolean) : []
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category]
    setSpecInputs({ ...specInputs, [userId]: updated.join(', ') })
  }

  const handleSaveSpecializations = async (userId) => {
    setSavingSpec({ ...savingSpec, [userId]: true })
    setMessage('')
    try {
      await updateSpecializations(userId, specInputs[userId])
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, specializations: specInputs[userId] } : u))
      setMessage('✅ Specializations saved')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('❌ Failed to save specializations')
    } finally {
      setSavingSpec({ ...savingSpec, [userId]: false })
    }
  }

  if (loading) return <p className="text-white/40">Loading users...</p>

  return (
    <div>
      {message && <div className="mb-4 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/70">{message}</div>}

      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Students',  count: users.filter(u => u.role === 'STUDENT').length,  color: 'text-white' },
          { label: 'Reviewers', count: users.filter(u => u.role === 'REVIEWER').length, color: 'text-blue-400' },
          { label: 'Admins',    count: users.filter(u => u.role === 'ADMIN').length,    color: 'text-violet-400' },
        ].map(s => (
          <div key={s.label} className="bg-[#0d0d18] border border-white/5 rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
            <div className="text-xs text-white/40 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#0d0d18] border border-white/5 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 px-5 py-3 border-b border-white/5 text-xs font-medium text-white/30 uppercase tracking-wider">
          <div className="col-span-1">#</div>
          <div className="col-span-1">Avatar</div>
          <div className="col-span-3">Name</div>
          <div className="col-span-4">Email</div>
          <div className="col-span-3">Role</div>
        </div>
        {users.map((user, index) => (
          <div key={user.id} className="border-b border-white/5 last:border-0">
            <div className="grid grid-cols-12 px-5 py-4 items-center hover:bg-white/2 transition-colors">
              <div className="col-span-1 text-white/30 text-sm">{index + 1}</div>
              <div className="col-span-1">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-violet-600/30 flex items-center justify-center text-sm font-bold text-violet-400">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="col-span-3"><p className="text-sm font-medium">{user.name}</p></div>
              <div className="col-span-4"><p className="text-sm text-white/50 truncate">{user.email}</p></div>
              <div className="col-span-3">
                <select
                  value={user.role}
                  disabled={updating[user.id]}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="bg-[#09090f] border border-white/10 hover:border-violet-500/50 text-white text-xs rounded-lg px-2 py-1.5 outline-none transition-all disabled:opacity-50 cursor-pointer"
                >
                  <option value="STUDENT">STUDENT</option>
                  <option value="REVIEWER">REVIEWER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                {updating[user.id] && <span className="text-xs text-white/30 ml-2">saving...</span>}
              </div>
            </div>

            {user.role === 'REVIEWER' && (
              <div className="px-5 pb-4 pl-[7.5%]">
                <p className="text-xs text-white/30 mb-2">Reviews categories:</p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {CATEGORIES.map(cat => {
                    const selected = (specInputs[user.id] || '').split(',').map(c => c.trim()).includes(cat)
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(user.id, cat)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                          selected
                            ? 'bg-violet-500/20 border-violet-500/40 text-violet-300'
                            : 'bg-white/5 border-white/10 text-white/40 hover:text-white/70'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  })}
                </div>
                <button
                  onClick={() => handleSaveSpecializations(user.id)}
                  disabled={savingSpec[user.id]}
                  className="text-xs bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg transition-all"
                >
                  {savingSpec[user.id] ? 'Saving...' : 'Save Categories'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjectsTab() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [feedbacks, setFeedbacks] = useState({})
  const [busy, setBusy] = useState({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    getAllProjectsAdmin().then(res => { setProjects(res.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const handleDelete = async (projectId) => {
    if (!window.confirm('Delete this project permanently? This cannot be undone.')) return
    setBusy({ ...busy, [projectId]: true })
    try {
      await deleteProject(projectId)
      setProjects(prev => prev.filter(p => p.id !== projectId))
      setMessage('✅ Project deleted')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('❌ Failed to delete project')
    } finally {
      setBusy({ ...busy, [projectId]: false })
    }
  }

  const handleReview = async (projectId, verdict) => {
    const feedback = feedbacks[projectId] || ''
    if (!feedback.trim()) { alert('Please write feedback before submitting'); return }
    setBusy({ ...busy, [projectId]: true })
    try {
      await submitReview(projectId, { feedback, verdict })
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: verdict } : p))
      setMessage(`✅ Project ${verdict.toLowerCase()}`)
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('❌ Failed to update project')
    } finally {
      setBusy({ ...busy, [projectId]: false })
    }
  }

  if (loading) return <p className="text-white/40">Loading projects...</p>

  return (
    <div>
      {message && <div className="mb-4 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/70">{message}</div>}
      <p className="text-white/40 text-sm mb-4">{projects.length} total projects</p>

      <div className="space-y-3">
        {projects.map(project => (
          <div key={project.id} className="bg-[#0d0d18] border border-white/5 rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{project.title}</h3>
                  <StatusBadge status={project.status} />
                </div>
                <p className="text-xs text-white/30">by {project.submitterName} • {project.month} {project.year}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a href={project.gitLink} target="_blank" rel="noreferrer" className="text-xs text-violet-400 hover:text-violet-300">
                  View Repo
                </a>
                <button
                  onClick={() => handleDelete(project.id)}
                  disabled={busy[project.id]}
                  className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 px-2.5 py-1 rounded-lg disabled:opacity-50 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>

            {project.status === 'PENDING' && (
              <div className="pt-3 border-t border-white/5">
                <textarea
                  rows={2}
                  value={feedbacks[project.id] || ''}
                  onChange={(e) => setFeedbacks({ ...feedbacks, [project.id]: e.target.value })}
                  placeholder="Feedback..."
                  className="w-full bg-[#09090f] border border-white/10 focus:border-violet-500 rounded-lg px-3 py-2 text-white text-xs outline-none resize-none mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReview(project.id, 'APPROVED')}
                    disabled={busy[project.id]}
                    className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white text-xs font-semibold py-2 rounded-lg transition-all"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReview(project.id, 'REJECTED')}
                    disabled={busy[project.id]}
                    className="flex-1 bg-red-600/80 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-semibold py-2 rounded-lg transition-all"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminPage