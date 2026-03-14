import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from 'AuthContext'
import { useToast } from 'ToastContext'
import { postService, timeAgo, GENRES } from 'api'
import Stars from './Stars'

export default function PostCard({ post, onDelete, style }) {
  const { user }    = useAuth()
  const { toast }   = useToast()
  const navigate    = useNavigate()
  const [liked, setLiked] = useState(post.likedBy?.includes(user?.id))
  const [likes, setLikes] = useState(post.likesCount || 0)
  const [busy, setBusy]   = useState(false)

  const genre   = GENRES.find(g => g.value === post.genre) || GENRES[0]
  const isOwner = user?.id === post.userId || user?._id === post.userId

  const toggleLike = async (e) => {
    e.preventDefault(); e.stopPropagation()
    if (!user) { navigate('/login'); return }
    if (busy) return
    setBusy(true)
    try {
      if (liked) { await postService.unlikePost(post._id); setLiked(false); setLikes(l=>l-1) }
      else       { await postService.likePost(post._id);   setLiked(true);  setLikes(l=>l+1) }
    } catch { toast('Erreur', 'error') }
    finally { setBusy(false) }
  }

  const del = async (e) => {
    e.preventDefault(); e.stopPropagation()
    if (!window.confirm('Supprimer cette critique ?')) return
    try { await postService.deletePost(post._id); toast('Supprimé', 'success'); onDelete?.(post._id) }
    catch { toast('Erreur suppression', 'error') }
  }

  return (
    <Link to={`/post/${post._id}`} style={{ display:'block', textDecoration:'none', ...style }}>
      <article className="post-card fade-up">

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px 0' }}>
          <Link to={`/profile/${post.userId}`} onClick={e=>e.stopPropagation()}
            style={{ display:'flex', alignItems:'center', gap:9, textDecoration:'none' }}>
            <div className="avatar" style={{ width:36, height:36, fontSize:14 }}>
              {(post.authorUsername||post.author?.username||'A')[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize:14, fontWeight:600, color:'var(--ink)', lineHeight:1.2 }}>
                {post.authorUsername || post.author?.username || 'Anonyme'}
              </div>
              <div style={{ fontSize:11, color:'var(--ink-4)' }}>{timeAgo(post.createdAt)}</div>
            </div>
          </Link>

          {isOwner && (
            <button onClick={del} title="Supprimer"
              style={{ background:'none', border:'none', cursor:'pointer', color:'var(--ink-4)', padding:4, borderRadius:4, transition:'color 0.15s' }}
              onMouseEnter={e=>e.currentTarget.style.color='var(--rust)'}
              onMouseLeave={e=>e.currentTarget.style.color='var(--ink-4)'}>
              <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
            </button>
          )}
        </div>

        {/* Movie title + rating */}
        <div style={{ padding:'10px 16px 0' }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:18, fontWeight:700, color:'var(--ink)', lineHeight:1.2, marginBottom:6 }}>
            {post.movieTitle}
          </h3>
          <Stars value={post.rating||0} readonly size={15}/>
          {post.spoiler && (
            <span style={{ display:'inline-block', marginTop:4, background:'rgba(212,130,10,0.12)', color:'var(--amber)', padding:'1px 8px', borderRadius:20, fontSize:10, fontWeight:700 }}>
              ⚠ SPOILER
            </span>
          )}
        </div>

        {/* Content */}
        <p style={{
          padding:'10px 16px', fontSize:14, color:'var(--ink-2)', lineHeight:1.65,
          overflow:'hidden', display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical',
        }}>
          {post.content}
        </p>

        {/* Actions */}
        <div style={{
          display:'flex', alignItems:'center', gap:4,
          padding:'10px 16px 14px',
          borderTop:'1px solid var(--border)',
        }}>
          <button onClick={toggleLike} disabled={busy}
            style={{
              display:'flex', alignItems:'center', gap:5,
              padding:'6px 12px', borderRadius:20,
              background: liked ? 'rgba(192,57,43,0.08)' : 'transparent',
              border: liked ? '1px solid rgba(192,57,43,0.25)' : '1px solid transparent',
              color: liked ? 'var(--rust)' : 'var(--ink-3)',
              fontSize:13, fontWeight:500, cursor:'pointer', transition:'all 0.15s',
            }}
            onMouseEnter={e=>{ if(!liked){ e.currentTarget.style.background='var(--paper-2)'; e.currentTarget.style.color='var(--ink)' }}}
            onMouseLeave={e=>{ if(!liked){ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--ink-3)' }}}
          >
            <svg viewBox="0 0 24 24" width={15} height={15} fill={liked?'currentColor':'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {likes > 0 && <span>{likes}</span>}
            {likes === 0 && <span>J'aime</span>}
          </button>

          <button style={{
            display:'flex', alignItems:'center', gap:5,
            padding:'6px 12px', borderRadius:20,
            background:'transparent', border:'1px solid transparent',
            color:'var(--ink-3)', fontSize:13, fontWeight:500, cursor:'pointer', transition:'all 0.15s',
          }}
          onMouseEnter={e=>{ e.currentTarget.style.background='var(--paper-2)'; e.currentTarget.style.color='var(--ink)' }}
          onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--ink-3)' }}>
            <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            {post.commentsCount > 0 ? post.commentsCount : 'Commenter'}
          </button>

          {post.visibility === 'private' && (
            <span style={{ marginLeft:'auto', fontSize:11, color:'var(--ink-4)', display:'flex', alignItems:'center', gap:3 }}>
              <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Privé
            </span>
          )}
        </div>
      </article>
    </Link>
  )
}
