import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const loc = useLocation()
  const nav = useNavigate()

  const active = (p) => loc.pathname === p || loc.pathname.startsWith(p + '/')

  const handleLogout = () => { logout(); nav('/') }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <Link to="/" style={{ display:'block', marginBottom:32, paddingLeft:12 }}>
        <div style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:900, color:'var(--ink)', lineHeight:1 }}>
          Cine<span style={{ color:'var(--amber)' }}>Verse</span>
        </div>
        <div style={{ fontSize:11, color:'var(--ink-4)', marginTop:3, letterSpacing:'0.08em' }}>
          FAN COMMUNITY
        </div>
      </Link>

      {/* Nav */}
      <nav style={{ flex:1 }}>
        {user && <>
          <Link to="/feed" className={`nav-item${active('/feed')?' active':''}`}>
            <svg viewBox="0 0 24 24" width={19} height={19} fill={active('/feed')?'currentColor':'none'} stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Feed
          </Link>
          <Link to="/create" className={`nav-item${active('/create')?' active':''}`}>
            <svg viewBox="0 0 24 24" width={19} height={19} fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            Nouvelle critique
          </Link>
        </>}

        {!user && <>
          <Link to="/" className={`nav-item${loc.pathname==='/'?' active':''}`}>
            <svg viewBox="0 0 24 24" width={19} height={19} fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Accueil
          </Link>
          <Link to="/feed" className={`nav-item${active('/feed')?' active':''}`}>
            <svg viewBox="0 0 24 24" width={19} height={19} fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            Explorer
          </Link>
        </>}
      </nav>

      {/* User panel */}
      {user ? (
        <div style={{ marginTop:'auto', paddingTop:16, borderTop:'1px solid var(--border)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', marginBottom:4 }}>
            <div className="avatar" style={{ width:34, height:34, fontSize:14 }}>
              {user.username?.[0]?.toUpperCase()||'U'}
            </div>
            <div style={{ overflow:'hidden' }}>
              <div style={{ fontSize:14, fontWeight:600, color:'var(--ink)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                {user.username}
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="nav-item" style={{ width:'100%', color:'var(--rust)', border:'none' }}
            onMouseEnter={e=>e.currentTarget.style.background='var(--rust-dim)'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Déconnexion
          </button>
        </div>
      ) : (
        <div style={{ marginTop:'auto', display:'flex', flexDirection:'column', gap:8 }}>
          <Link to="/login"    className="btn btn-outline" style={{ justifyContent:'center' }}>Connexion</Link>
          <Link to="/register" className="btn btn-amber"   style={{ justifyContent:'center' }}>S'inscrire</Link>
        </div>
      )}
    </aside>
  )
}