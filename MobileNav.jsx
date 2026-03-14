import { Link, useLocation } from 'react-router-dom'
import { useAuth } from 'AuthContext'

export default function MobileNav() {
  const { user } = useAuth()
  const loc = useLocation()
  const a = (p) => loc.pathname.startsWith(p) ? 'var(--amber)' : 'var(--ink-3)'

  return (
    <div className="mobile-nav" style={{ display:'none' }}>
      <Link to="/feed" style={{ color: a('/feed'), display:'flex', flexDirection:'column', alignItems:'center', gap:2, fontSize:10 }}>
        <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
        Feed
      </Link>
      {user && <Link to="/create" style={{ color: a('/create'), display:'flex', flexDirection:'column', alignItems:'center', gap:2, fontSize:10 }}>
        <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        Publier
      </Link>}
      {user
        ? <Link to={`/profile/${user.id||user._id}`} style={{ color: a('/profile'), display:'flex', flexDirection:'column', alignItems:'center', gap:2, fontSize:10 }}>
            <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>
            Profil
          </Link>
        : <Link to="/login" style={{ color: a('/login'), display:'flex', flexDirection:'column', alignItems:'center', gap:2, fontSize:10 }}>
            <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            Connexion
          </Link>
      }
    </div>
  )
}
