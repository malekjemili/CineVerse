import { useState } from 'react'

export default function Stars({ value=0, onChange, readonly=false, size=18 }) {
  const [hover, setHover] = useState(0)
  const fill = hover || value
  return (
    <span style={{ display:'inline-flex', gap:1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i}
          onClick={() => !readonly && onChange?.(i === value ? 0 : i)}
          onMouseEnter={() => !readonly && setHover(i)}
          onMouseLeave={() => !readonly && setHover(0)}
          style={{
            fontSize: size, lineHeight:1,
            color: i <= fill ? 'var(--amber)' : 'var(--ink-4)',
            cursor: readonly ? 'default' : 'pointer',
            transition: 'color 0.12s, transform 0.12s',
            display: 'inline-block',
            transform: !readonly && hover === i ? 'scale(1.25)' : 'scale(1)',
          }}>★</span>
      ))}
    </span>
  )
}
