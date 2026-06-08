import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')

    if (token) {
      localStorage.setItem('token', token)
      navigate('/dashboard')
    } else {
      navigate('/login')
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#09090f] flex items-center justify-center">
      <p className="text-white">Logging you in...</p>
    </div>
  )
}

export default AuthCallbackPage