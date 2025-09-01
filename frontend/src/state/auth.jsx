import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiBase, apiFetch } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }){
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [me, setMe] = useState(null)

  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  const login = async (email, password) => {
    const res = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    setToken(res.access_token)
    return res
  }

  const logout = () => { setToken(null); setMe(null) }

  const fetchMe = async () => {
    const data = await apiFetch('/me', { token })
    setMe(data)
    return data
  }

  const value = useMemo(() => ({ token, me, login, logout, fetchMe }), [token, me])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(){
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
