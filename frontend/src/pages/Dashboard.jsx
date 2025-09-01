import { useEffect, useState } from 'react'
import { useAuth } from '../state/auth'
import { apiFetch } from '../utils/api'

export default function Dashboard(){
  const { token, me } = useAuth()
  const [modules, setModules] = useState([])

  useEffect(() => {
    if (token) apiFetch('/me', { token }).then(data => setModules(data.modules || []))
  }, [token])

  return (
    <div className="panel">
      <h2>Welcome{me?.full_name ? `, ${me.full_name}` : ''}</h2>
      <p className="muted">Your accessible modules:</p>
      <ul>
        {modules.map(m => (
          <li key={m.id}><strong>{m.name}</strong>{m.description ? ` — ${m.description}` : ''}</li>
        ))}
        {!modules.length && <li className="muted">No modules assigned yet.</li>}
      </ul>
    </div>
  )
}

