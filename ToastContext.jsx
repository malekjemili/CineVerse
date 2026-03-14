import { createContext, useContext, useState, useCallback } from 'react'

const Ctx = createContext(null)

export function ToastProvider({ children }) {
  const [list, setList] = useState([])

  const toast = useCallback((msg, type = 'info') => {
    const id = Date.now()
    setList(p => [...p, { id, msg, type }])
    setTimeout(() => setList(p => p.filter(t => t.id !== id)), 3200)
  }, [])

  const icons = { success:'✓', error:'✕', info:'◆' }

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="toast-wrap">
        {list.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span style={{flexShrink:0}}>{icons[t.type]}</span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

export const useToast = () => useContext(Ctx)
