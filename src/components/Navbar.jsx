import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, isLoggedIn, isReviewer, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="border-b border-white/5 px-6 h-16 flex items-center justify-between bg-[#09090f] sticky top-0 z-50">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center font-bold text-sm text-white">
          C
        </div>
        <span className="font-bold text-white">
          CDAC<span className="text-violet-400">Hub</span>
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-6">
        <Link to="/"
          className="text-sm text-white/60 hover:text-white transition-colors">
          Browse
        </Link>

        {/* Only show these if logged in */}
        {isLoggedIn && (
          <>
            <Link to="/submit"
              className="text-sm text-white/60 hover:text-white transition-colors">
              Submit Project
            </Link>
            <Link to="/dashboard"
              className="text-sm text-white/60 hover:text-white transition-colors">
              My Projects
            </Link>
          </>
        )}

        {/* Only show Reviewer link if user is REVIEWER or ADMIN */}
        {isReviewer && (
          <Link to="/reviewer"
            className="text-sm text-white/60 hover:text-white transition-colors">
            Review Panel
          </Link>
        )}
      </div>

      {/* Right side — Login or User info */}
      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <>
            {/* Show avatar and name */}
            <div className="flex items-center gap-2">
              {user?.avatarUrl && (
                <img
                  src={user.avatarUrl}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-sm text-white/60 hidden md:block">
                {user?.name}
              </span>
            </div>
            <button
              onClick={logout}
              className="text-sm text-white/40 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-all"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="text-sm bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg transition-all"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar