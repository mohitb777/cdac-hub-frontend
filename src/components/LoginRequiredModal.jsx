import { useNavigate } from 'react-router-dom'

function LoginRequiredModal({ onClose }) {
  const navigate = useNavigate()

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6"
      onClick={onClose}
    >
      <div
        className="bg-[#0d0d18] border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-4xl mb-4">🔒</div>
        <h2 className="text-white text-lg font-bold mb-2">Login Required</h2>
        <p className="text-white/40 text-sm mb-6">
          Please log in to view this project's repository and files.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-white/10 text-white/60 hover:text-white py-2.5 rounded-xl text-sm transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => navigate('/login')}
            className="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-semibold py-2.5 rounded-xl text-sm transition-all"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginRequiredModal