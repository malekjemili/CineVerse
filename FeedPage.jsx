import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { postService, GENRES } from '../services/api'
import { useAuth } from '../context/AuthContext'
import PostCard from '../components/PostCard'

function Skel() {
  return (
    <div className="post-card" style={{ padding:16, marginBottom:16 }}>
      <div style={{ display:'flex', gap:10, marginBottom:12 }}>
        <div className="skeleton" style={{ width:40, height:40, borderRadius:'50%', flexShrink:0 }}/>
        <div style={{ flex:1 }}>
          <div className="skeleton" style={{ height:13, width:'40%', marginBottom:6 }}/>
          <div className="skeleton" style={{ height:11, width:'25%' }}/>
        </div>
      </div>
      <div style={{ marginBottom:10 }}>
        <div className="skeleton" style={{ height:18, width:'70%', marginBottom:8 }}/>
        <div className="skeleton" style={{ height:13, width:'40%', marginBottom:6 }}/>
        <div className="skeleton" style={{ height:12, width:'60%' }}/>
      </div>
      <div className="skeleton" style={{ height:13, width:'100%', marginBottom:5 }}/>
      <div className="skeleton" style={{ height:13, width:'75%' }}/>
    </div>
  )
}

const ALL = [{ value:'', label:'Tous', emoji:'✦' }]

export default function FeedPage() {
  const { user } = useAuth()
  const [posts, setPosts]     = useState([])
  const [loading, setLoading] = useState(true)
  const [more, setMore]       = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [genre, setGenre]     = useState('')
  const pageRef = useRef(1)
  const sentRef = useRef(null)

  const load = useCallback(async (p=1, reset=false) => {
    if (p===1) setLoading(true); else setMore(true)
    try {
      const { data } = await postService.getFeed(p)
      const arr = data.posts || []
      setPosts(prev => reset ? arr : [...prev, ...arr])
      setHasMore(arr.length === 10)
      pageRef.current = p
    } catch(e) { console.error(e) }
    finally { setLoading(false); setMore(false) }
  }, [])

  useEffect(() => { load(1, true) }, [load])

  useEffect(() => {
    const el = sentRef.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && hasMore && !more) load(pageRef.current + 1) },
      { rootMargin:'400px' }
    )
    obs.observe(el); return () => obs.disconnect()
  }, [hasMore, more, load])

  const del = id => setPosts(p => p.filter(x => x._id !== id))
  const filtered = genre ? posts.filter(p => p.genre === genre) : posts

  return (
    <div style={{ maxWidth:680, margin:'0 auto' }}>

      {/* Filtres genre */}
      <div style={{ display:'flex', gap:6, marginBottom:20, overflowX:'auto', paddingBottom:4, scrollbarWidth:'none' }}>
        {ALL.map(g => (
          <button key={g.value} onClick={() => setGenre(g.value)}
            style={{
              padding:'6px 14px', borderRadius:20, whiteSpace:'nowrap', cursor:'pointer',
              fontSize:12, fontWeight:600, border:'1.5px solid', transition:'all 0.15s',
              borderColor: genre===g.value ? 'var(--ink)'   : 'var(--border-2)',
              background:  genre===g.value ? 'var(--ink)'   : 'transparent',
              color:       genre===g.value ? 'var(--paper)' : 'var(--ink-3)',
            }}>
            {g.emoji} {g.label}
          </button>
        ))}
      </div>

      {/* Prompt nouvelle critique */}
      {user && (
        <Link to="/create" style={{ textDecoration:'none', display:'block', marginBottom:16 }}>
          <div className="card" style={{ padding:'12px 16px', display:'flex', alignItems:'center', gap:12, cursor:'pointer', transition:'var(--transition)' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='var(--amber)'}
            onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}>
            <div className="avatar" style={{ width:38, height:38, fontSize:15 }}>
              {user.username?.[0]?.toUpperCase()||'U'}
            </div>
            <div style={{ flex:1, background:'var(--paper-2)', borderRadius:20, padding:'9px 16px', fontSize:14, color:'var(--ink-4)' }}>
              Partagez votre avis sur un film, une série...
            </div>
            <span className="btn btn-amber btn-sm">Publier</span>
          </div>
        </Link>
      )}

      {/* Posts */}
      {loading
        ? Array.from({length:4}).map((_,i) => <Skel key={i}/>)
        : filtered.length === 0
          ? (
            <div className="card" style={{ padding:'60px 24px', textAlign:'center' }}>
              <div style={{ fontSize:44, marginBottom:12 }}>🎬</div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:700, marginBottom:8 }}>
                {genre
                  ? `Aucune critique en "${GENRES.find(g=>g.value===genre)?.label}"`
                  : 'Aucune critique pour l\'instant'}
              </div>
              <p style={{ color:'var(--ink-3)', fontSize:14, marginBottom:20 }}>
                Sois le premier à partager ton avis !
              </p>
              {user && <Link to="/create" className="btn btn-amber">Écrire une critique</Link>}
            </div>
          )
          : filtered.map((p, i) => (
            <div key={p._id} className="fade-up" style={{ animationDelay:`${(i%10)*0.04}s` }}>
              <PostCard post={p} onDelete={del}/>
            </div>
          ))
      }

      {more && Array.from({length:2}).map((_,i) => <Skel key={i}/>)}
      <div ref={sentRef} style={{ height:1 }}/>
      {!hasMore && posts.length > 0 && (
        <div style={{ textAlign:'center', padding:20, fontSize:12, color:'var(--ink-4)', letterSpacing:'0.06em' }}>
          — Fin du feed —
        </div>
      )}
    </div>
  )
}