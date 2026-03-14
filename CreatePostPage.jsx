import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postService, GENRES } from 'api'
import { useToast } from 'ToastContext'
import Stars from 'Stars'

export default function CreatePostPage() {
  const { toast } = useToast()
  const nav = useNavigate()
  const [f, setF] = useState({ movieTitle:'', genre:'film', content:'', rating:0, spoiler:false, visibility:'public' })
  const [busy, setBusy]     = useState(false)
  const [errs, setErrs]     = useState({})
  const set = k => e => setF(p=>({...p,[k]:e.target.value}))

  const validate = () => {
    const e = {}
    if (!f.movieTitle.trim()) e.movieTitle = 'Titre requis'
    if (!f.content.trim())   e.content    = 'Critique requise'
    if (f.rating === 0)      e.rating     = 'Note requise'
    setErrs(e); return Object.keys(e).length === 0
  }

  const submit = async e => {
    e.preventDefault(); if(!validate()) return
    setBusy(true)
    try {
      const fd = new FormData()
      Object.entries(f).forEach(([k,v]) => fd.append(k, v))
      await postService.createPost(fd)
      toast('Critique publiée !', 'success')
      nav('/feed')
    } catch(ex) {
      toast(ex.response?.data?.error || 'Erreur publication', 'error')
    } finally { setBusy(false) }
  }

  return (
    <div style={{ maxWidth:680, margin:'0 auto' }}>

      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:900, marginBottom:4 }}>
          Nouvelle critique
        </h1>
        <p style={{ color:'var(--ink-3)', fontSize:14 }}>Partagez votre avis avec la communauté</p>
      </div>

      <div className="card" style={{ padding:28 }}>
        <form onSubmit={submit}>

          {/* Title + Genre + Visibility */}
          <div className="form-group">
            <label className="form-label">Titre *</label>
            <input className="form-input" placeholder="ex: Interstellar" value={f.movieTitle} onChange={set('movieTitle')}/>
            {errs.movieTitle && <span style={{ color:'var(--rust)', fontSize:12 }}>{errs.movieTitle}</span>}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }} className="form-group">
            <div>
              <label className="form-label">Genre</label>
              <select className="form-select" value={f.genre} onChange={set('genre')}>
                {GENRES.map(g=><option key={g.value} value={g.value}>{g.emoji} {g.label}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Visibilité</label>
              <select className="form-select" value={f.visibility} onChange={set('visibility')}>
                <option value="public">🌍 Public</option>
                <option value="private">🔒 Privé</option>
              </select>
            </div>
          </div>

          {/* Rating */}
          <div className="form-group">
            <label className="form-label">Note *</label>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <Stars value={f.rating} onChange={r=>setF(p=>({...p,rating:r}))} size={28}/>
              {f.rating > 0 && <span style={{ fontSize:14, color:'var(--amber)', fontWeight:600 }}>{f.rating}/5</span>}
            </div>
            {errs.rating && <span style={{ color:'var(--rust)', fontSize:12 }}>{errs.rating}</span>}
          </div>

          {/* Content */}
          <div className="form-group">
            <label className="form-label">Votre critique *</label>
            <textarea className="form-textarea" style={{ minHeight:130 }}
              placeholder="Partagez votre avis, vos ressentis, ce qui vous a marqué..."
              value={f.content} onChange={set('content')}/>
            {errs.content && <span style={{ color:'var(--rust)', fontSize:12 }}>{errs.content}</span>}
          </div>

          {/* Spoiler toggle */}
          <div className="form-group" style={{ display:'flex', alignItems:'center', gap:12, marginBottom:28 }}>
            <button type="button" onClick={() => setF(p=>({...p,spoiler:!p.spoiler}))}
              style={{
                width:44, height:24, borderRadius:12, border:'none', cursor:'pointer',
                background: f.spoiler ? 'var(--amber)' : 'var(--paper-3)',
                position:'relative', transition:'background 0.2s', flexShrink:0,
              }}>
              <div style={{
                position:'absolute', top:2, left: f.spoiler ? 22 : 2,
                width:20, height:20, borderRadius:'50%', background:'white',
                transition:'left 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.2)',
              }}/>
            </button>
            <label style={{ fontSize:14, color:'var(--ink-2)', cursor:'pointer' }} onClick={()=>setF(p=>({...p,spoiler:!p.spoiler}))}>
              ⚠️ Contient des spoilers
            </label>
          </div>

          <div style={{ display:'flex', gap:10 }}>
            <button type="button" className="btn btn-outline" style={{ flex:1, justifyContent:'center' }} onClick={()=>nav(-1)}>Annuler</button>
            <button type="submit" className="btn btn-amber" disabled={busy} style={{ flex:2, justifyContent:'center', height:44 }}>
              {busy ? <><div className="spinner"/>Publication...</> : '✦ Publier la critique'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
