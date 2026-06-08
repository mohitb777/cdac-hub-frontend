import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import DashboardPage from './pages/DashboardPage'
import SubmitProjectPage from './pages/SubmitProjectPage'
import ReviewerPage from './pages/ReviewerPage'

function App() {
  return (
    <div className="bg-[#09090f] min-h-screen">
      {/* Navbar appears on every page */}
      <Navbar />

      <Routes>
        <Route path="/"              element={<HomePage />} />
        <Route path="/login"         element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/dashboard"     element={<DashboardPage />} />
        <Route path="/submit"        element={<SubmitProjectPage />} />
        <Route path="/reviewer"      element={<ReviewerPage />} />
      </Routes>
    </div>
  )
}

export default App