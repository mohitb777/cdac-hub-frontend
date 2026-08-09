import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    //  1. Declare params and tokens INSIDE the hook where they belong
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const refreshToken = params.get('refreshToken')

    //  2. Safely check and store them after the component mounts
    if (token) {
      localStorage.setItem('token', token)
      
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
      }
      
      navigate('/dashboard')
    } else {
      navigate('/login')
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-[#09090f] flex items-center justify-center">
      <p className="text-white">Logging you in...</p>
    </div>
  )
}

export default AuthCallbackPage