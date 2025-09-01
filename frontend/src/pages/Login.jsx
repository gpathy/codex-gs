import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../state/auth'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    try{
      await login(email, password)
      navigate('/')
    }catch(ex){
      setErr('Invalid credentials')
    }
  }

  return (
    <div className="panel" style={{maxWidth:420, margin:'60px auto'}}>
      <h2>Sign in</h2>
      <form onSubmit={submit} className="stack">
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} type="password" />
        {err && <div style={{color:'#fca5a5'}}>{err}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

