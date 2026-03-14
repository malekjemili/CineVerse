import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userService } from 'api'
import { useAuth } from 'AuthContext'
import { useToast } from 'ToastContext'

export default function RegisterPage() {
  const { login } = useAuth()
  const { toast } = useToast()
  const nav = useNavigate()
  const [f, setF]     = useState({ username:'', email:'', password:'', confirm:'' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const set = k => e => setF(p => ({...p,[k]:e.target.value}))

  const submit = async (e) => {
    e.preventDefault(); setErr('')
    if (f.password !== f.confirm) { setErr('Les mots de passe ne correspondent pas'); return }
    if (f.password.length < 6)    { setErr('Mot de passe trop court (min. 6 caractères)'); return }
    setBusy(true)
    try {
      const { data } = await userService.register({ username:f.username, email:f.email, password:f.password })
      login(data.token)
      toast('Bienvenue sur CineVerse !', 'success')
      nav('/feed')
    } catch(ex) {
      setErr(ex.response?.data?.error || 'Erreur lors de l\'inscription')
    } finally { setBusy(false) }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:20, background:'var(--paper)' }}>
      <div style={{ width:'100%', maxWidth:420 }}>

        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontFamily:'var(--font-display)', fontSize:32, fontWeight:900, marginBottom:6 }}>
            Rejoindre CineVerse 🎬
          </div>
          <p style={{ color:'var(--ink-3)', fontSize:15 }}>Le safe space des fans de cinéma</p>
        </div>

        <div className="card" style={{ padding:32 }}>
          {err && <div style={{ background:'var(--rust-dim)', border:'1px solid rgba(192,57,43,0.2)', color:'var(--rust)', padding:'10px 14px', borderRadius:'var(--radius)', fontSize:14, marginBottom:18 }}>{err}</div>}

          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Nom d'utilisateur</label>
              <input className="form-input" placeholder="cinephile_42" value={f.username} onChange={set('username')} required autoFocus/>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="vous@exemple.com" value={f.email} onChange={set('email')} required/>
            </div>
            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <input className="form-input" type="password" placeholder="Min. 6 caractères" value={f.password} onChange={set('password')} required/>
            </div>
            <div className="form-group" style={{ marginBottom:24 }}>
              <label className="form-label">Confirmer</label>
              <input className="form-input" type="password" placeholder="••••••••" value={f.confirm} onChange={set('confirm')} required/>
            </div>
            <button type="submit" className="btn btn-amber" disabled={busy}
              style={{ width:'100%', justifyContent:'center', height:46, fontSize:15 }}>
              {busy ? <><div className="spinner"/>Création...</> : 'Créer mon compte'}
            </button>
          </form>
        </div>

        <p style={{ textAlign:'center', marginTop:20, color:'var(--ink-3)', fontSize:14 }}>
          Déjà inscrit ?{' '}
          <Link to="/login" style={{ color:'var(--amber)', fontWeight:600 }}>Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
