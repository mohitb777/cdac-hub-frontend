import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { submitProject } from '../services/api'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = [
  'AI & ML', 'Web Dev', 'Mobile Apps',
  'Cybersecurity', 'Cloud & DevOps',
  'Data Science', 'Blockchain', 'IoT'
]

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 6 }, (_, i) => currentYear - i)
const MAX_TEAM_MEMBERS = 12

function SubmitProjectPage() {
  const navigate = useNavigate()
  const { isLoggedIn, user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: '', description: '', techStack: '', category: 'AI & ML',
    gitLink: '', year: currentYear, month: '',
    submitterName: user?.name || '', submitterEmail: user?.email || '',
    submitterRollNo: '', guideName: '', guideEmail: '',
  })

  const [teamMembers, setTeamMembers] = useState([])
  const [files, setFiles] = useState([])

  if (!isLoggedIn) {
    navigate('/login')
    return null
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleFileChange = (e) => setFiles(Array.from(e.target.files))

  const addTeamMember = () => {
    if (teamMembers.length >= MAX_TEAM_MEMBERS) return
    setTeamMembers([...teamMembers, { name: '', rollNo: '', email: '' }])
  }
  const removeTeamMember = (index) => setTeamMembers(teamMembers.filter((_, i) => i !== index))
  const updateTeamMember = (index, field, value) => {
    const updated = [...teamMembers]
    updated[index] = { ...updated[index], [field]: value }
    setTeamMembers(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.title || !form.description || !form.techStack || !form.month) {
      setError('Please fill in all project fields'); return
    }
    if (!form.gitLink.trim() || !/^https?:\/\/.+/i.test(form.gitLink.trim())) {
      setError('Please add a valid GitHub/GitLab link'); return
    }
    if (!form.submitterName || !form.submitterEmail || !form.submitterRollNo) {
      setError('Please fill in your name, email, and roll number'); return
    }
    if (!form.guideName || !form.guideEmail) {
      setError("Please fill in your guide's name and email"); return
    }
    if (files.length === 0) {
      setError('Please attach at least one file'); return
    }
    const incompleteRow = teamMembers.find(m => !m.name || !m.rollNo || !m.email)
    if (incompleteRow) {
      setError('Fill in all fields for each team member, or remove the empty row'); return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('description', form.description)
    formData.append('techStack', form.techStack)
    formData.append('category', form.category)
    formData.append('gitLink', form.gitLink)
    formData.append('year', form.year)
    formData.append('month', form.month)
    formData.append('submitterName', form.submitterName)
    formData.append('submitterEmail', form.submitterEmail)
    formData.append('submitterRollNo', form.submitterRollNo)
    formData.append('guideName', form.guideName)
    formData.append('guideEmail', form.guideEmail)
    formData.append('teamMembers', JSON.stringify(teamMembers))
    files.forEach(file => formData.append('files', file))

    try {
      await submitProject(formData)
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Submission failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-white text-xl font-bold">Project Submitted!</h2>
        <p className="text-white/40 mt-2">Redirecting to dashboard...</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 text-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Submit Your Project</h1>
        <p className="text-white/40 text-sm mt-1">Open to all CDAC students — reviewed before publishing</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        <div className="space-y-5">
          <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider">Project Details</h3>
          <div>
            <label className="text-sm font-medium text-white/70 block mb-1.5">Project Title *</label>
            <input type="text" name="title" value={form.title} onChange={handleChange}
              placeholder="e.g. Smart Attendance System"
              className="w-full bg-[#0d0d18] border border-white/10 focus:border-violet-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all" />
          </div>
          <div>
            <label className="text-sm font-medium text-white/70 block mb-1.5">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4}
              placeholder="Describe what your project does..."
              className="w-full bg-[#0d0d18] border border-white/10 focus:border-violet-500 rounded-xl px-4 py-3 text-white text-sm outline-none resize-none transition-all" />
          </div>
          <div>
            <label className="text-sm font-medium text-white/70 block mb-1.5">GitHub / GitLab Link *</label>
            <input type="url" name="gitLink" value={form.gitLink} onChange={handleChange}
              placeholder="https://github.com/yourname/your-project"
              className="w-full bg-[#0d0d18] border border-white/10 focus:border-violet-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all" />
            <p className="text-xs text-white/30 mt-1.5">Repository must be public</p>
          </div>
          <div>
            <label className="text-sm font-medium text-white/70 block mb-1.5">Category *</label>
            <select name="category" value={form.category} onChange={handleChange}
              className="w-full bg-[#0d0d18] border border-white/10 focus:border-violet-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all">
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-white/70 block mb-1.5">Submission Year *</label>
              <select name="year" value={form.year} onChange={handleChange}
                className="w-full bg-[#0d0d18] border border-white/10 focus:border-violet-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all">
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-white/70 block mb-1.5">Month *</label>
              <select name="month" value={form.month} onChange={handleChange}
                className="w-full bg-[#0d0d18] border border-white/10 focus:border-violet-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all">
                <option value="">Select month</option>
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-white/70 block mb-1.5">Tech Stack * <span className="text-white/30">(comma separated)</span></label>
            <input type="text" name="techStack" value={form.techStack} onChange={handleChange}
              placeholder="e.g. Python, OpenCV, Flask, MySQL"
              className="w-full bg-[#0d0d18] border border-white/10 focus:border-violet-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all" />
          </div>
        </div>

        <div className="space-y-5">
          <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider">Submitted By (You)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-white/70 block mb-1.5">Your Name *</label>
              <input type="text" name="submitterName" value={form.submitterName} onChange={handleChange}
                className="w-full bg-[#0d0d18] border border-white/10 focus:border-violet-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all" />
            </div>
            <div>
              <label className="text-sm font-medium text-white/70 block mb-1.5">Your Roll No *</label>
              <input type="text" name="submitterRollNo" value={form.submitterRollNo} onChange={handleChange}
                placeholder="e.g. DAC2401234"
                className="w-full bg-[#0d0d18] border border-white/10 focus:border-violet-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-white/70 block mb-1.5">Your Email *</label>
            <input type="email" name="submitterEmail" value={form.submitterEmail} onChange={handleChange}
              className="w-full bg-[#0d0d18] border border-white/10 focus:border-violet-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider">
              Team Members <span className="normal-case font-normal">(optional — solo is fine)</span>
            </h3>
            <span className="text-xs text-white/30">{teamMembers.length}/{MAX_TEAM_MEMBERS}</span>
          </div>

          {teamMembers.map((member, index) => (
            <div key={index} className="bg-[#0d0d18] border border-white/5 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40">Member {index + 1}</span>
                <button type="button" onClick={() => removeTeamMember(index)} className="text-xs text-red-400 hover:text-red-300">
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <input type="text" placeholder="Name" value={member.name}
                  onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                  className="bg-[#09090f] border border-white/10 focus:border-violet-500 rounded-lg px-3 py-2 text-white text-sm outline-none" />
                <input type="text" placeholder="Roll No" value={member.rollNo}
                  onChange={(e) => updateTeamMember(index, 'rollNo', e.target.value)}
                  className="bg-[#09090f] border border-white/10 focus:border-violet-500 rounded-lg px-3 py-2 text-white text-sm outline-none" />
                <input type="email" placeholder="Email" value={member.email}
                  onChange={(e) => updateTeamMember(index, 'email', e.target.value)}
                  className="bg-[#09090f] border border-white/10 focus:border-violet-500 rounded-lg px-3 py-2 text-white text-sm outline-none" />
              </div>
            </div>
          ))}

          {teamMembers.length < MAX_TEAM_MEMBERS && (
            <button type="button" onClick={addTeamMember}
              className="w-full border border-dashed border-white/10 hover:border-violet-500/50 text-white/50 hover:text-white text-sm py-2.5 rounded-xl transition-all">
              + Add Team Member
            </button>
          )}
        </div>

        <div className="space-y-5">
          <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider">Guided Under</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-white/70 block mb-1.5">Guide Name *</label>
              <input type="text" name="guideName" value={form.guideName} onChange={handleChange}
                className="w-full bg-[#0d0d18] border border-white/10 focus:border-violet-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all" />
            </div>
            <div>
              <label className="text-sm font-medium text-white/70 block mb-1.5">Guide Email *</label>
              <input type="email" name="guideEmail" value={form.guideEmail} onChange={handleChange}
                className="w-full bg-[#0d0d18] border border-white/10 focus:border-violet-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all" />
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-white/70 block mb-1.5">
            Project Files * <span className="text-white/30">(report, docs — code lives in your repo)</span>
          </label>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 hover:border-violet-500/50 rounded-xl cursor-pointer transition-all bg-[#0d0d18]">
            <div className="text-center">
              <div className="text-2xl mb-1">📁</div>
              <p className="text-white/40 text-sm">Click to select files</p>
              <p className="text-white/20 text-xs mt-1">PDF, ZIP, or any format</p>
            </div>
            <input type="file" multiple onChange={handleFileChange} className="hidden" />
          </label>
          {files.length > 0 && (
            <div className="mt-2 space-y-1">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-white/50">
                  <span>📄</span><span>{f.name}</span>
                  <span className="text-white/20">({(f.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all">
          {loading ? 'Submitting...' : 'Submit Project for Review'}
        </button>
      </form>
    </div>
  )
}

export default SubmitProjectPage