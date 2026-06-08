import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { submitProject } from '../services/api'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = [
  'AI & ML', 'Web Dev', 'Mobile Apps',
  'Cybersecurity', 'Cloud & DevOps',
  'Data Science', 'Blockchain', 'IoT'
]

function SubmitProjectPage() {
  const navigate           = useNavigate()
  const { isLoggedIn }     = useAuth()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')

  // All form fields in one state object
  const [form, setForm] = useState({
    title:       '',
    description: '',
    techStack:   '',
    category:    'AI & ML',
    price:       '',
  })

  // Selected files
  const [files, setFiles] = useState([])

  // Redirect if not logged in
  if (!isLoggedIn) {
    navigate('/login')
    return null
  }

  // Update a single field without losing other fields
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files)) // convert FileList to Array
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Basic validation
    if (!form.title || !form.description || !form.techStack || !form.price) {
      setError('Please fill in all fields')
      return
    }
    if (files.length === 0) {
      setError('Please attach at least one file')
      return
    }

    setLoading(true)

    // Build FormData — required for file upload
    const formData = new FormData()
    formData.append('title',       form.title)
    formData.append('description', form.description)
    formData.append('techStack',   form.techStack)
    formData.append('category',    form.category)
    formData.append('price',       form.price)

    // Append each file with the key "files"
    files.forEach(file => formData.append('files', file))

    try {
      await submitProject(formData)
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  // Success screen
  if (success) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-white text-xl font-bold">Project Submitted!</h2>
        <p className="text-white/40 mt-2">
          Redirecting to dashboard...
        </p>
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 text-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Submit Your Project</h1>
        <p className="text-white/40 text-sm mt-1">
          Your project will be reviewed by experts before publishing
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Title */}
        <div>
          <label className="text-sm font-medium text-white/70 block mb-1.5">
            Project Title *
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Smart Attendance System"
            className="w-full bg-[#0d0d18] border border-white/10 focus:border-violet-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-white/70 block mb-1.5">
            Description *
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe what your project does, its features, and how it works..."
            className="w-full bg-[#0d0d18] border border-white/10 focus:border-violet-500 rounded-xl px-4 py-3 text-white text-sm outline-none resize-none transition-all"
          />
        </div>

        {/* Category + Price row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-white/70 block mb-1.5">
              Category *
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full bg-[#0d0d18] border border-white/10 focus:border-violet-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-white/70 block mb-1.5">
              Price (₹) *
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="e.g. 499"
              min="0"
              className="w-full bg-[#0d0d18] border border-white/10 focus:border-violet-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all"
            />
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <label className="text-sm font-medium text-white/70 block mb-1.5">
            Tech Stack * <span className="text-white/30">(comma separated)</span>
          </label>
          <input
            type="text"
            name="techStack"
            value={form.techStack}
            onChange={handleChange}
            placeholder="e.g. Python, OpenCV, Flask, MySQL"
            className="w-full bg-[#0d0d18] border border-white/10 focus:border-violet-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="text-sm font-medium text-white/70 block mb-1.5">
            Project Files * <span className="text-white/30">(source code, report, docs)</span>
          </label>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 hover:border-violet-500/50 rounded-xl cursor-pointer transition-all bg-[#0d0d18]">
            <div className="text-center">
              <div className="text-2xl mb-1">📁</div>
              <p className="text-white/40 text-sm">Click to select files</p>
              <p className="text-white/20 text-xs mt-1">PDF, ZIP, or any format</p>
            </div>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Show selected file names */}
          {files.length > 0 && (
            <div className="mt-2 space-y-1">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-white/50">
                  <span>📄</span>
                  <span>{f.name}</span>
                  <span className="text-white/20">
                    ({(f.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all"
        >
          {loading ? 'Submitting...' : 'Submit Project for Review'}
        </button>

      </form>
    </div>
  )
}

export default SubmitProjectPage