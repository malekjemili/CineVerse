import { createContext, useContext, useState, useEffect } from 'react'

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null)
  const [token, setToken]   = useState(() => localStorage.getItem('cv_token'))
  const [ready, setReady]   = useState(false)

  useEffect(() => {
    if (token) {
      try {
        const p = JSON.parse(atob(token.split('.')[1]))
        if (p.exp * 1000 > Date.now()) setUser(p)
        else logout()
      } catch { logout() }
    }
    setReady(true)
  }, [])

  const login = (tok) => {
    localStorage.setItem('cv_token', tok)
    setToken(tok)
    try { setUser(JSON.parse(atob(tok.split('.')[1]))) } catch {}
  }

  const logout = () => {
    localStorage.removeItem('cv_token')
    setToken(null); setUser(null)
  }

  return <Ctx.Provider value={{ user, token, ready, login, logout }}>{children}</Ctx.Provider>
}

export const useAuth = () => {
  const c = useContext(Ctx)
  if (!c) throw new Error('useAuth outside AuthProvider')
  return c
}
