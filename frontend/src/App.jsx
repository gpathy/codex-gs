import { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Modules from './pages/Modules'
import Assignments from './pages/Assignments'
import { useAuth } from './state/auth'
import Nav from './components/Nav'

export default function App() {
  const { token, me, fetchMe, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (token) fetchMe().catch(() => logout())
  }, [token])

  return (
    <div className="container">
      {token && <Nav me={me} onLogout={() => { logout(); navigate('/login') }} />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/admin/users" element={token && me?.is_admin ? <Users /> : <Navigate to="/" />} />
        <Route path="/admin/modules" element={token && me?.is_admin ? <Modules /> : <Navigate to="/" />} />
        <Route path="/admin/assignments" element={token && me?.is_admin ? <Assignments /> : <Navigate to="/" />} />
      </Routes>
    </div>
  )
}

