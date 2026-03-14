import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userService } from 'api'
import { useAuth } from 'AuthContext'
import { useToast } from 'ToastContext'

export default function LoginPage() {
  const { login } = useAuth()
  const { toast } = useToast()
  const nav = useNavigate()
  const [f, setF]   = useState({ email:'', password:'' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true)
    try {
      const { data } = await userService.login(f)
      login(data.token)
      toast('Connexion réussie !', 'success')
      nav('/feed')
    } catch(ex) {
      setErr(ex.response?.data?.error || 'Email ou mot de passe incorrect')
    } finally { setBusy(false) }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:20, background:'var(--paper)' }}>
      <div style={{ width:'100%', maxWidth:400 }}>

        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontFamily:'var(--font-display)', fontSize:32, fontWeight:900, marginBottom:6 }}>
            Bon retour 👋
          </div>
          <p style={{ color:'var(--ink-3)', fontSize:15 }}>Connectez-vous à votre compte</p>
        </div>

        <div className="card" style={{ padding:32 }}>
          {err && <div style={{ background:'var(--rust-dim)', border:'1px solid rgba(192,57,43,0.2)', color:'var(--rust)', padding:'10px 14px', borderRadius:'var(--radius)', fontSize:14, marginBottom:18 }}>{err}</div>}

          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="vous@exemple.com" value={f.email}
                onChange={e=>setF(p=>({...p,email:e.target.value}))} required autoFocus/>
            </div>
            <div className="form-group" style={{ marginBottom:24 }}>
              <label className="form-label">Mot de passe</label>
              <input className="form-input" type="password" placeholder="••••••••" value={f.password}
                onChange={e=>setF(p=>({...p,password:e.target.value}))} required/>
            </div>
            <button type="submit" className="btn btn-amber" disabled={busy}
              style={{ width:'100%', justifyContent:'center', height:46, fontSize:15 }}>
              {busy ? <><div className="spinner"/>Connexion...</> : 'Se connecter'}
            </button>
          </form>
        </div>

        <p style={{ textAlign:'center', marginTop:20, color:'var(--ink-3)', fontSize:14 }}>
          Pas encore inscrit ?{' '}
          <Link to="/register" style={{ color:'var(--amber)', fontWeight:600 }}>Créer un compte</Link>
        </p>
      </div>
    </div>
  )
}
