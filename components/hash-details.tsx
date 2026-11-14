"use client"
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/** Reveal collapsed reference sections when the TOC or a search result targets them. */
export function HashDetails() {
  const pathname = usePathname()
  useEffect(() => {
    const reveal = (hash: string) => {
      if (!hash) return
      let id: string
      try { id = decodeURIComponent(hash.slice(1)) } catch { return }
      const target = document.getElementById(id)
      if (!target) return
      let parent = target.closest('details')
      let changed = false
      while (parent) { changed ||= !parent.open; parent.open = true; parent = parent.parentElement?.closest('details') || null }
      if (changed) requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }))
    }
    const onHash = () => reveal(location.hash)
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!(link instanceof HTMLAnchorElement)) return
      const url = new URL(link.href)
      if (url.origin === location.origin && url.pathname === location.pathname) reveal(url.hash)
    }
    const frame = requestAnimationFrame(onHash)
    addEventListener('hashchange', onHash)
    document.addEventListener('click', onClick)
    return () => { cancelAnimationFrame(frame); removeEventListener('hashchange', onHash); document.removeEventListener('click', onClick) }
  }, [pathname])
  return null
}
