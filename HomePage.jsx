import { Link } from 'react-router-dom'
import { useAuth } from 'AuthContext'
import { GENRES } from 'api'

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div style={{ minHeight:'100vh', background:'var(--paper)' }}>

      {/* Nav */}
      <header style={{ padding:'0 32px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid var(--border)', background:'white' }}>
        <div style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:900 }}>
          Cine<span style={{ color:'var(--amber)' }}>Verse</span>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          {user
            ? <Link to="/feed" className="btn btn-amber">Aller au feed</Link>
            : <>
                <Link to="/login"    className="btn btn-outline">Connexion</Link>
                <Link to="/register" className="btn btn-amber">S'inscrire</Link>
              </>
          }
        </div>
      </header>

      {/* Hero */}
      <div style={{ maxWidth:720, margin:'0 auto', padding:'80px 24px 60px', textAlign:'center' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'5px 16px', borderRadius:20, background:'var(--amber-dim)', border:'1px solid rgba(212,130,10,0.25)', fontSize:12, fontWeight:600, color:'var(--amber)', letterSpacing:'0.06em', marginBottom:28 }}>
          ✦ LE SAFE SPACE DES CINÉPHILES
        </div>

        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(38px,7vw,68px)', fontWeight:900, lineHeight:1.05, color:'var(--ink)', marginBottom:22 }}>
          Vos critiques,<br/>
          <em style={{ color:'var(--amber)', fontStyle:'italic' }}>partagées.</em>
        </h1>

        <p style={{ fontSize:17, color:'var(--ink-3)', lineHeight:1.75, maxWidth:500, margin:'0 auto 40px' }}>
          CineVerse est l'espace communautaire pour partager vos avis sur les films, séries, animés et documentaires — sans jugement.
        </p>

        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          {user
            ? <>
                <Link to="/feed"   className="btn btn-amber btn-lg">Explorer le feed</Link>
                <Link to="/create" className="btn btn-outline btn-lg">Écrire une critique</Link>
              </>
            : <>
                <Link to="/register" className="btn btn-amber btn-lg">Rejoindre CineVerse</Link>
                <Link to="/feed"     className="btn btn-outline btn-lg">Explorer</Link>
              </>
          }
        </div>
      </div>

      {/* Genre cards */}
      <div style={{ maxWidth:800, margin:'0 auto', padding:'0 24px 80px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))', gap:14 }}>
          {GENRES.map(g => (
            <Link key={g.value} to={user ? `/feed?genre=${g.value}` : '/register'}
              style={{ textDecoration:'none' }}>
              <div style={{
                background:'white', border:`1px solid ${g.color}20`,
                borderRadius:'var(--radius-lg)', padding:'20px 18px',
                display:'flex', alignItems:'center', gap:12,
                transition:'all 0.2s', cursor:'pointer',
              }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=g.color+'60'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='var(--shadow)' }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=g.color+'20'; e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none' }}>
                <span style={{ fontSize:28 }}>{g.emoji}</span>
                <div>
                  <div style={{ fontWeight:600, fontSize:14, color:'var(--ink)' }}>{g.label}</div>
                  <div style={{ fontSize:11, color:g.color, fontWeight:600 }}>Explorer →</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ background:'white', borderTop:'1px solid var(--border)', padding:'60px 24px' }}>
        <div style={{ maxWidth:800, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:32 }}>
          {[
            { icon:'💬', title:'Critiques détaillées', desc:'Partagez vos analyses, ressentis et notes avec la communauté.' },
            { icon:'❤️', title:'Likes & Commentaires', desc:'Réagissez aux critiques des autres et engagez la conversation.' },
            { icon:'👥', title:'Follow & Discover', desc:'Suivez vos critiques favoris et découvrez de nouveaux contenus.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ textAlign:'center' }}>
              <div style={{ fontSize:36, marginBottom:12 }}>{icon}</div>
              <h3 style={{ fontFamily:'var(--font-display)', fontSize:17, fontWeight:700, marginBottom:8 }}>{title}</h3>
              <p style={{ fontSize:13, color:'var(--ink-3)', lineHeight:1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
