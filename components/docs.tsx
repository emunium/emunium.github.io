import type { ReactNode } from 'react'
import Link from 'next/link'
import { Arrow } from './icons'

type Card = { title: string; description: string; href: string; label?: string }
export function DocCards({ items }: { items: Card[] }) {
  return (
    <div className="doc-cards">
      {items.map(item => (
        <Link className="doc-card" href={item.href} key={item.href}>
          <strong>
            {item.title}
            <Arrow />
          </strong>
          <p>{item.description}</p>
        </Link>
      ))}
    </div>
  )
}
export function Notice({ title = 'Note', children }: { title?: string; children: ReactNode }) {
  return (
    <aside className="doc-notice" aria-label={title}>
      <strong>{title}</strong>
      <div>{children}</div>
    </aside>
  )
}
