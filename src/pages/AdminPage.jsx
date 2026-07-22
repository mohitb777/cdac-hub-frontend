import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllUsers, updateUserRole } from '../services/api'
import { useAuth } from '../context/AuthContext'

// Role badge colors
function RoleBadge({ role }) {
  const styles = {
    ADMIN:    'bg-violet-500/10 text-violet-400 border-violet-500/20',
    REVIEWER: 'bg-blue-500/10   text-blue-400   border-blue-500/20',
    STUDENT:  'bg-white/5       text-white/50   border-white/10',
  }
  return (
    <span className={`text-xs font-medium border px-2 py-0.5 rounded-full ${styles[role]}`}>
      {role}
    </span>
  )
}

function AdminPage() {
  const [users, setUsers]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [updating, setUpdating] = useState({})   // { userId: true/false }
  const [message, setMessage]   = useState('')
  const { isAdmin, isLoggedIn } = useAuth()
  const navigate                = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return }
    if (!isAdmin)    { navigate('/');      return }

    getAllUsers()
      .then(res => { setUsers(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [isLoggedIn, isAdmin])

  const handleRoleChange = async (userId, newRole) => {
    setUpdating({ ...updating, [userId]: true })
    setMessage('')
    try {
      await updateUserRole(userId, newRole)
      // Update locally — no need to refetch
      setUsers(prev =>
        prev.map(u => u.id === userId ? { ...u, role: newRole } : u)
      )
      setMessage('✅ Role updated successfully')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('❌ Failed to update role')
    } finally {
      setUpdating({ ...updating, [userId]: false })
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-white/40">Loading users...</p>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-white">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-white/40 text-sm mt-1">
          Manage user roles — {users.length} users registered
        </p>
      </div>

      {/* Success / Error message */}
      {message && (
        <div className="mb-4 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/70">
          {message}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Students',  count: users.filter(u => u.role === 'STUDENT').length,  color: 'text-white' },
          { label: 'Reviewers', count: users.filter(u => u.role === 'REVIEWER').length, color: 'text-blue-400' },
          { label: 'Admins',    count: users.filter(u => u.role === 'ADMIN').length,    color: 'text-violet-400' },
        ].map(s => (
          <div key={s.label}
            className="bg-[#0d0d18] border border-white/5 rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
            <div className="text-xs text-white/40 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-[#0d0d18] border border-white/5 rounded-2xl overflow-hidden">

        {/* Table Header */}
        <div className="grid grid-cols-12 px-5 py-3 border-b border-white/5 text-xs font-medium text-white/30 uppercase tracking-wider">
          <div className="col-span-1">#</div>
          <div className="col-span-1">Avatar</div>
          <div className="col-span-3">Name</div>
          <div className="col-span-4">Email</div>
          <div className="col-span-3">Role</div>
        </div>

        {/* Rows */}
        {users.map((user, index) => (
          <div key={user.id}
            className="grid grid-cols-12 px-5 py-4 border-b border-white/5 last:border-0 items-center hover:bg-white/2 transition-colors">

            {/* Index */}
            <div className="col-span-1 text-white/30 text-sm">
              {index + 1}
            </div>

            {/* Avatar */}
            <div className="col-span-1">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt=""
                  className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-violet-600/30 flex items-center justify-center text-sm font-bold text-violet-400">
                  {user.name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>

            {/* Name */}
            <div className="col-span-3">
              <p className="text-sm font-medium">{user.name}</p>
            </div>

            {/* Email */}
            <div className="col-span-4">
              <p className="text-sm text-white/50 truncate">{user.email}</p>
            </div>

            {/* Role Dropdown */}
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
              {updating[user.id] && (
                <span className="text-xs text-white/30 ml-2">saving...</span>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminPage