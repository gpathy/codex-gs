import { useEffect, useState } from 'react'
import { useAuth } from '../state/auth'
import { apiFetch } from '../utils/api'

export default function Users(){
  const { token } = useAuth()
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ email:'', full_name:'', password:'', is_admin:false })

  const load = () => apiFetch('/users', { token }).then(setUsers)
  useEffect(() => { load() }, [])

  const create = async (e) => {
    e.preventDefault()
    await apiFetch('/users', { method:'POST', body: JSON.stringify(form), token })
    setForm({ email:'', full_name:'', password:'', is_admin:false })
    load()
  }

  const toggle = async (u, field) => {
    await apiFetch(`/users/${u.id}`, { method:'PATCH', body: JSON.stringify({ [field]: !u[field] }), token })
    load()
  }

  const remove = async (u) => {
    if (!confirm(`Delete ${u.email}?`)) return
    await apiFetch(`/users/${u.id}`, { method:'DELETE', token })
    load()
  }

  return (
    <div className="stack">
      <div className="panel">
        <h3>Create User</h3>
        <form className="row wrap" onSubmit={create}>
          <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
          <input placeholder="Full name" value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})} />
          <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
          <label className="row" style={{gap:6}}>
            <input type="checkbox" checked={form.is_admin} onChange={e=>setForm({...form, is_admin:e.target.checked})} /> Admin
          </label>
          <button type="submit">Create</button>
        </form>
      </div>
      <div className="panel">
        <h3>Users</h3>
        <table>
          <thead>
            <tr><th>Email</th><th>Name</th><th>Admin</th><th>Active</th><th></th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.full_name}</td>
                <td><button className="ghost" onClick={()=>toggle(u, 'is_admin')}>{u.is_admin ? 'Yes' : 'No'}</button></td>
                <td><button className="ghost" onClick={()=>toggle(u, 'is_active')}>{u.is_active ? 'Yes' : 'No'}</button></td>
                <td><button className="ghost" onClick={()=>remove(u)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

