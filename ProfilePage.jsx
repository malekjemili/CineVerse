import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { userService, postService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
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
      <div className="skeleton" style={{ height:18, width:'70%', marginBottom:8 }}/>
      <div className="skeleton" style={{ height:13, width:'100%', marginBottom:5 }}/>
      <div className="skeleton" style={{ height:13, width:'60%' }}/>
    </div>
  )
}

export default function ProfilePage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { toast } = useToast()

  const [profile, setProfile]       = useState(null)
  const [posts, setPosts]           = useState([])
  const [loadingP, setLoadingP]     = useState(true)
  const [loadingF, setLoadingF]     = useState(true)
  const [more, setMore]             = useState(false)
  const [hasMore, setHasMore]       = useState(true)
  const [following, setFollowing]   = useState(false)
  const [followBusy, setFollowBusy] = useState(false)
  const pageRef = useRef(1)
  const sentRef = useRef(null)
  const isOwn   = user?.id === id || user?._id === id

  useEffect(() => {
    userService.getProfile(id)
      .then(({ data }) => {
        setProfile(data.user || data)
        setFollowing(data.followers?.includes(user?.id) || false)
      })
      .catch(() => {})
      .finally(() => setLoadingP(false))
  }, [id])

  const loadPosts = useCallback(async (p=1, reset=false) => {
    if (p===1) setLoadingF(true); else setMore(true)
    try {
      const { data } = await postService.getUserPosts(id, p)
      const arr = data.posts || data || []
      setPosts(prev => reset ? arr : [...prev, ...arr])
      setHasMore(arr.length === 10)
      pageRef.current = p
    } catch {}
    finally { setLoadingF(false); setMore(false) }
  }, [id])

  useEffect(() => { loadPosts(1, true) }, [loadPosts])

  useEffect(() => {
    const el = sentRef.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && hasMore && !more) loadPosts(pageRef.current + 1)
    }, { rootMargin:'400px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [hasMore, more, loadPosts])

  const toggleFollow = async () => {
    if (!user) return
    setFollowBusy(true)
    try {
      if (following) {
        await userService.unfollow(id)
        setFollowing(false)
        setProfile(p => ({...p, followersCount: Math.max(0,(p.followersCount||1)-1)}))
        toast('Abonnement retiré', 'info')
      } else {
        await userService.follow(id)
        setFollowing(true)
        setProfile(p => ({...p, followersCount: (p.followersCount||0)+1}))
        toast('Vous suivez ce membre', 'success')
      }
    } catch { toast('Fonctionnalité bientôt disponible', 'info') }
    finally { setFollowBusy(false) }
  }

  const del = id => setPosts(p => p.filter(x => x._id !== id))

  if (loadingP) return (
    <div style={{ display:'flex', justifyContent:'center', padding:60 }}>
      <div className="spinner" style={{ width:32, height:32, borderWidth:3 }}/>
    </div>
  )

  if (!profile) return (
    <div style={{ textAlign:'center', padding:60, color:'var(--ink-3)' }}>Profil introuvable</div>
  )

  return (
    <div style={{ maxWidth:680, margin:'0 auto' }}>

      {/* Profile card */}
      <div className="card" style={{ padding:28, marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap:20, flexWrap:'wrap' }}>

          {/* Avatar */}
          <div className="avatar" style={{
            width:72, height:72, fontSize:26, flexShrink:0,
            boxShadow:'0 0 0 4px var(--paper), 0 0 0 6px var(--amber)',
          }}>
            {profile.username?.[0]?.toUpperCase()||'U'}
          </div>

          {/* Info */}
          <div style={{ flex:1, minWidth:200 }}>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:24, fontWeight:900, marginBottom:4 }}>
              {profile.username}
            </h1>
            {profile.bio && (
              <p style={{ fontSize:14, color:'var(--ink-3)', lineHeight:1.6, marginBottom:10 }}>
                {profile.bio}
              </p>
            )}
            {/* Stats */}
            <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
              {[
                { label:'Critiques', val: posts.length },
                { label:'Abonnés',   val: profile.followersCount  || 0 },
                { label:'Suivis',    val: profile.followingCount  || 0 },
              ].map(({ label, val }) => (
                <div key={label}>
                  <span style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:700 }}>{val}</span>
                  <span style={{ fontSize:12, color:'var(--ink-4)', marginLeft:5 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action */}
          <div>
            {isOwn
              ? <Link to="/settings" className="btn btn-outline btn-sm">Modifier le profil</Link>
              : user
                ? <button onClick={toggleFollow} disabled={followBusy}
                    className={`btn btn-sm ${following ? 'btn-outline' : 'btn-amber'}`}>
                    {followBusy ? <div className="spinner"/> : following ? '✓ Abonné' : '+ Suivre'}
                  </button>
                : <Link to="/login" className="btn btn-amber btn-sm">+ Suivre</Link>
            }
          </div>
        </div>
      </div>

      {/* Posts */}
      <h2 style={{ fontFamily:'var(--font-display)', fontSize:18, fontWeight:700, marginBottom:14, paddingLeft:4 }}>
        Critiques de {profile.username}
      </h2>

      {loadingF
        ? Array.from({length:3}).map((_,i) => <Skel key={i}/>)
        : posts.length === 0
          ? (
            <div className="card" style={{ padding:'48px 24px', textAlign:'center' }}>
              <div style={{ fontSize:40, marginBottom:10 }}>🎬</div>
              <p style={{ color:'var(--ink-3)', fontSize:14 }}>Aucune critique pour l'instant</p>
              {isOwn && <Link to="/create" className="btn btn-amber" style={{ marginTop:16 }}>Écrire ma première critique</Link>}
            </div>
          )
          : posts.map(p => <PostCard key={p._id} post={p} onDelete={del}/>)
      }

      {more && Array.from({length:2}).map((_,i) => <Skel key={i}/>)}
      <div ref={sentRef} style={{ height:1 }}/>
      {!hasMore && posts.length > 0 && (
        <div style={{ textAlign:'center', padding:20, fontSize:12, color:'var(--ink-4)' }}>— Fin —</div>
      )}
    </div>
  )
}
