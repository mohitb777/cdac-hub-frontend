import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, isLoggedIn, isReviewer, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <nav className="h-16 bg-white border-b border-gray-200 sticky top-0 z-50 px-6 flex items-center justify-between">

        
          <div className="flex items-center gap-2">
          <img src="/cdac-logo.png" alt="CDAC Logo" className="w-12 h-12 object-contain"/>


          <span className="font-bold text-cdac-navy">
            CDAC<span className="text-cdac-maroon">Hub</span>
          </span>
          </div>
        

        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl border border-gray-300 
             hover:border-purple-500 hover:text-purple-600 
             transition-all duration-200"
          >
            Browse
          </Link>

          {isLoggedIn && (
            <>
              <Link
                to="/submit"
                className="px-5 py-2.5 rounded-xl border border-gray-300 
             hover:border-purple-500 hover:text-purple-600 
             transition-all duration-200"
              >
                Submit Project
              </Link>
<Link
  to="/dashboard"
  className="px-5 py-2.5 rounded-xl border border-gray-300
             hover:border-purple-500 hover:text-purple-600
             transition-all duration-200"
>
  My Projects
</Link>
            </>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className="text-sm text-cdac-maroon hover:text-cdac-navy transition-colors font-medium"
            >
              Admin Panel
            </Link>
          )}

          {isReviewer && (
            <Link
              to="/reviewer"
              className="text-sm text-gray-600 hover:text-cdac-navy transition-colors"
            >
              Review Panel
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-0.5 bg-cdac-navy transition-all ${
                mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />

            <span
              className={`block w-5 h-0.5 bg-cdac-navy transition-all ${
                mobileMenuOpen ? 'opacity-0' : ''
              }`}
            />

            <span
              className={`block w-5 h-0.5 bg-cdac-navy transition-all ${
                mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>

          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2">
                {user?.avatarUrl && (
                  <img
                    src={user.avatarUrl}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                )}

                <span className="text-sm text-gray-600 hidden md:block">
                  {user?.name}
                </span>
              </div>

              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-cdac-navy border border-gray-300 hover:border-cdac-navy px-3 py-1.5 rounded-lg transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="text-sm bg-cdac-navy hover:bg-cdac-navy-light text-white px-4 py-2 rounded-lg transition-all"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-6 py-4 flex flex-col gap-4 sticky top-16 z-40">

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm text-gray-600 hover:text-cdac-navy transition-colors"
          >
            Browse
          </Link>

          {isLoggedIn && (
            <>
              <Link
                to="/submit"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm text-gray-600 hover:text-cdac-navy transition-colors"
              >
                Submit Project
              </Link>

            <Link
  to="/dashboard"
  onClick={() => setMobileMenuOpen(false)}
  className="px-5 py-2.5 rounded-xl border border-gray-300
             hover:border-purple-500 hover:text-purple-600
             transition-all duration-200"
>
  My Projects
</Link>
            </>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm text-cdac-maroon hover:text-cdac-navy transition-colors font-medium"
            >
              Admin Panel
            </Link>
          )}

          {isReviewer && (
            <Link
              to="/reviewer"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm text-gray-600 hover:text-cdac-navy transition-colors"
            >
              Review Panel
            </Link>
          )}
        </div>
      )}
    </>
  )
}

export default Navbar;
