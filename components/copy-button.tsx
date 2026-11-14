"use client"
import { useEffect, useRef, useState } from 'react'
import { CheckIcon, CopyIcon } from './icons'

export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setStatus('copied')
    } catch { setStatus('error') }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setStatus('idle'), 2200)
  }
  return <button type="button" className="copy-button" onClick={copy} aria-label={status === 'copied' ? 'Copied' : label} title={label}>
    {status === 'copied' ? <CheckIcon /> : <CopyIcon />}
    <span className="sr-only" role="status">{status === 'copied' ? 'Copied to clipboard.' : status === 'error' ? 'Copy unavailable. Select and copy the text manually.' : ''}</span>
  </button>
}
