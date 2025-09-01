import { useEffect, useState } from 'react'
import { useAuth } from '../state/auth'
import { apiFetch } from '../utils/api'

export default function Assignments(){
  const { token } = useAuth()
  const [users, setUsers] = useState([])
  const [modules, setModules] = useState([])
  const [selection, setSelection] = useState({ user_id: '', module_id: '' })

  const load = async () => {
    const [us, ms] = await Promise.all([
      apiFetch('/users', { token }),
      apiFetch('/modules', { token }),
    ])
    setUsers(us)
    setModules(ms)
  }
  useEffect(() => { load() }, [])

  const assign = async (e) => {
    e.preventDefault()
    await apiFetch('/assignments', { method: 'POST', body: JSON.stringify(selection), token })
    alert('Assigned!')
  }

  const unassign = async (e) => {
    e.preventDefault()
    await apiFetch('/assignments', { method: 'DELETE', body: JSON.stringify(selection), token })
    alert('Removed!')
  }

  return (
    <div className="panel">
      <h3>Assignments</h3>
      <form className="row wrap" onSubmit={assign}>
        <select value={selection.user_id} onChange={e=>setSelection({...selection, user_id:Number(e.target.value)})}>
          <option value="">Select user</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.email}</option>)}
        </select>
        <select value={selection.module_id} onChange={e=>setSelection({...selection, module_id:Number(e.target.value)})}>
          <option value="">Select module</option>
          {modules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <button type="submit">Assign</button>
        <button className="ghost" onClick={unassign}>Remove</button>
      </form>
    </div>
  )
}

