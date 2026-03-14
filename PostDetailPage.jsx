import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { postService, timeAgo } from 'api'
import { useAuth } from 'AuthContext'
import { useToast } from 'ToastContext'
import Stars from 'Stars'

export default function PostDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const nav = useNavigate()

  const [post, setPost]         = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading]   = useState(true)
  const [liked, setLiked]       = useState(false)
  const [likes, setLikes]       = useState(0)
  const [text, setText]         = useState('')
  const [sending, setSending]   = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [pr, cr] = await Promise.all([postService.getPost(id), postService.getComments(id)])
        setPost(pr.data)
        setLiked(pr.data.likedBy?.includes(user?.id))
        setLikes(pr.data.likesCount || 0)
        setComments(cr.data.comments || cr.data || [])
      } catch { nav('/feed') }
      finally { setLoading(false) }
    }
    fetch()
  }, [id])

  const toggleLike = async () => {
    if (!user) { nav('/login'); return }
    try {
      if (liked) { await postService.unlikePost(id); setLiked(false); setLikes(l=>l-1) }
      else       { await postService.likePost(id);   setLiked(true);  setLikes(l=>l+1) }
    } catch { toast('Erreur', 'error') }
  }

  const sendComment = async e => {
    e.preventDefault(); if (!text.trim()) return
    setSending(true)
    try {
      const { data } = await postService.addComment(id, text)
      setComments(p => [data.comment, ...p])
      setText('')
      setPost(p => ({...p, commentsCount:(p.commentsCount||0)+1}))
    } catch { toast('Erreur', 'error') }
    finally { setSending(false) }
  }

  const delComment = async cid => {
    if (!window.confirm('Supprimer ?')) return
    try {
      await postService.deleteComment(id, cid)
      setComments(p => p.filter(c => c._id !== cid))
      setPost(p => ({...p, commentsCount:Math.max(0,(p.commentsCount||1)-1)}))
    } catch { toast('Erreur', 'error') }
  }

  const delPost = async () => {
    if (!window.confirm('Supprimer cette critique ?')) return
    try { await postService.deletePost(id); toast('Supprimé','success'); nav('/feed') }
    catch { toast('Erreur','error') }
  }

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', padding:60 }}>
      <div className="spinner" style={{ width:32, height:32, borderWidth:3 }}/>
    </div>
  )
  if (!post) return null

  const isOwner = user?.id === post.userId

  return (
    <div style={{ maxWidth:680, margin:'0 auto' }}>

      {/* Back */}
      <button onClick={() => nav(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom:20, gap:6 }}>
        <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        Retour
      </button>

      {/* Post */}
      <div className="card" style={{ overflow:'hidden', marginBottom:20 }}>

        {/* Header */}
        <div style={{ padding:'16px 20px 0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Link to={`/profile/${post.userId}`} style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
            <div className="avatar" style={{ width:40, height:40, fontSize:15 }}>
              {(post.authorUsername||'A')[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize:14, fontWeight:600, color:'var(--ink)' }}>{post.authorUsername||'Anonyme'}</div>
              <div style={{ fontSize:12, color:'var(--ink-4)' }}>{timeAgo(post.createdAt)}</div>
            </div>
          </Link>
          {isOwner && (
            <button onClick={delPost} className="btn btn-danger btn-sm">
              <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
              Supprimer
            </button>
          )}
        </div>

        {/* Content */}
        <div style={{ padding:'16px 20px' }}>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:900, lineHeight:1.2, marginBottom:8 }}>
            {post.movieTitle}
          </h1>
          <Stars value={post.rating||0} readonly size={18}/>
          {post.spoiler && (
            <span style={{ display:'inline-block', marginTop:8, background:'rgba(212,130,10,0.12)', color:'var(--amber)', padding:'2px 10px', borderRadius:20, fontSize:11, fontWeight:700 }}>
              ⚠ Contient des spoilers
            </span>
          )}
        </div>

        <div style={{ padding:'0 20px 16px', fontSize:15, color:'var(--ink-2)', lineHeight:1.75, whiteSpace:'pre-wrap' }}>
          {post.content}
        </div>

        {/* Actions */}
        <div style={{ padding:'12px 20px 16px', borderTop:'1px solid var(--border)', display:'flex', gap:8 }}>
          <button onClick={toggleLike}
            style={{
              display:'flex', alignItems:'center', gap:6,
              padding:'8px 16px', borderRadius:20, cursor:'pointer',
              background: liked ? 'rgba(192,57,43,0.08)' : 'var(--paper-2)',
              border: liked ? '1px solid rgba(192,57,43,0.3)' : '1px solid var(--border)',
              color: liked ? 'var(--rust)' : 'var(--ink-2)',
              fontSize:14, fontWeight:500, transition:'all 0.15s',
            }}>
            <svg viewBox="0 0 24 24" width={16} height={16} fill={liked?'currentColor':'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {liked ? 'Aimé' : "J'aime"} {likes > 0 && `· ${likes}`}
          </button>
        </div>
      </div>

      {/* Comments */}
      <div className="card" style={{ padding:20 }}>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:18, fontWeight:700, marginBottom:16 }}>
          Commentaires {post.commentsCount > 0 && <span style={{ color:'var(--ink-4)', fontSize:14, fontWeight:400 }}>({post.commentsCount})</span>}
        </h2>

        {user ? (
          <form onSubmit={sendComment} style={{ marginBottom:24 }}>
            <div style={{ display:'flex', gap:10 }}>
              <div className="avatar" style={{ width:34, height:34, fontSize:13, flexShrink:0 }}>
                {user.username?.[0]?.toUpperCase()||'U'}
              </div>
              <div style={{ flex:1 }}>
                <textarea className="form-textarea" style={{ minHeight:72, resize:'none' }}
                  placeholder="Votre réaction..."
                  value={text} onChange={e=>setText(e.target.value)}/>
                <div style={{ display:'flex', justifyContent:'flex-end', marginTop:8 }}>
                  <button type="submit" className="btn btn-amber btn-sm" disabled={sending||!text.trim()}>
                    {sending?<><div className="spinner"/>Envoi...</>:'Commenter'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div style={{ background:'var(--paper-2)', borderRadius:'var(--radius)', padding:'12px 16px', fontSize:14, color:'var(--ink-3)', marginBottom:20 }}>
            <Link to="/login" style={{ color:'var(--amber)', fontWeight:600 }}>Connectez-vous</Link> pour commenter
          </div>
        )}

        {comments.length === 0
          ? <p style={{ color:'var(--ink-4)', fontSize:14, textAlign:'center', padding:'20px 0' }}>Aucun commentaire — soyez le premier !</p>
          : comments.map(c => {
            const isMine = user?.id === c.userId || user?.id === c.author?._id
            return (
              <div key={c._id} style={{ display:'flex', gap:10, padding:'14px 0', borderTop:'1px solid var(--border)' }}>
                <div className="avatar" style={{ width:32, height:32, fontSize:12, background:'linear-gradient(135deg, var(--blue), #1a4d7a)', flexShrink:0 }}>
                  {(c.authorUsername||c.author?.username||'A')[0].toUpperCase()}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <span style={{ fontSize:13, fontWeight:600 }}>{c.authorUsername||c.author?.username||'Anonyme'}</span>
                    <span style={{ fontSize:11, color:'var(--ink-4)' }}>{timeAgo(c.createdAt)}</span>
                    {isMine && (
                      <button onClick={()=>delComment(c._id)}
                        style={{ marginLeft:'auto', background:'none', border:'none', color:'var(--ink-4)', cursor:'pointer', padding:3, borderRadius:4, transition:'color 0.15s' }}
                        onMouseEnter={e=>e.currentTarget.style.color='var(--rust)'}
                        onMouseLeave={e=>e.currentTarget.style.color='var(--ink-4)'}>
                        <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                      </button>
                    )}
                  </div>
                  <p style={{ fontSize:14, color:'var(--ink-2)', lineHeight:1.6 }}>{c.content}</p>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
