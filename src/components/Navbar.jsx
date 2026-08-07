import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, isLoggedIn, isReviewer, isAdmin, logout } = useAuth()
//  const { user, isLoggedIn, isReviewer, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
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

        {/* Navigation Links — unchanged, still hidden below md */}
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

          {/* Show Admin link only to ADMIN role */}
        {isAdmin && (
         <Link to="/admin"
           className="text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium">
          Admin Panel
        </Link>
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

          {/* ✅ Hamburger — mobile only, pure Tailwind, no new dependency */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-white/70 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-white/70 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-white/70 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>

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

      {/* ✅ Mobile dropdown — same links, same conditions, same paths
          as the desktop nav above, just stacked vertically. Every
          link closes the menu on tap for a normal mobile-nav feel. */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#09090f] border-b border-white/5 px-6 py-4 flex flex-col gap-4 sticky top-16 z-40">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}
            className="text-sm text-white/60 hover:text-white transition-colors">
            Browse
          </Link>

          {isLoggedIn && (
            <>
              <Link to="/submit" onClick={() => setMobileMenuOpen(false)}
                className="text-sm text-white/60 hover:text-white transition-colors">
                Submit Project
              </Link>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}
                className="text-sm text-white/60 hover:text-white transition-colors">
                My Projects
              </Link>
            </>
          )}

          {isAdmin && (
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)}
              className="text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium">
              Admin Panel
            </Link>
          )}

          {isReviewer && (
            <Link to="/reviewer" onClick={() => setMobileMenuOpen(false)}
              className="text-sm text-white/60 hover:text-white transition-colors">
              Review Panel
            </Link>
          )}
        </div>
      )}
    </>
  )
}

export default Navbar