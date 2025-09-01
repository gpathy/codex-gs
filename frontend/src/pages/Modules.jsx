import { useEffect, useState } from 'react'
import { useAuth } from '../state/auth'
import { apiFetch } from '../utils/api'

export default function Modules(){
  const { token } = useAuth()
  const [modules, setModules] = useState([])
  const [form, setForm] = useState({ name:'', description:'' })

  const load = () => apiFetch('/modules', { token }).then(setModules)
  useEffect(() => { load() }, [])

  const create = async (e) => {
    e.preventDefault()
    await apiFetch('/modules', { method:'POST', body: JSON.stringify(form), token })
    setForm({ name:'', description:'' })
    load()
  }

  const remove = async (m) => {
    if (!confirm(`Delete module ${m.name}?`)) return
    await apiFetch(`/modules/${m.id}`, { method:'DELETE', token })
    load()
  }

  return (
    <div className="stack">
      <div className="panel">
        <h3>Create Module</h3>
        <form className="row wrap" onSubmit={create}>
          <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <input placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
          <button type="submit">Create</button>
        </form>
      </div>
      <div className="panel">
        <h3>Modules</h3>
        <table>
          <thead>
            <tr><th>Name</th><th>Description</th><th></th></tr>
          </thead>
          <tbody>
            {modules.map(m => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{m.description}</td>
                <td><button className="ghost" onClick={()=>remove(m)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

