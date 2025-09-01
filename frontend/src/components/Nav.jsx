import { Link } from 'react-router-dom'

export default function Nav({ me, onLogout }){
  return (
    <nav className="panel row wrap" style={{marginBottom:12, justifyContent:'space-between'}}>
      <div>
        <Link to="/">Dashboard</Link>
        {me?.is_admin && <>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/modules">Modules</Link>
          <Link to="/admin/assignments">Assignments</Link>
        </>}
      </div>
      <div className="row">
        <span className="muted">{me?.email}</span>
        <button className="ghost" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  )
}

